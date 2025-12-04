/*
  # Storage Versioning System

  ## Purpose
  This migration creates the infrastructure for tracking file versions
  in Supabase Storage, including version history and metadata.

  ## New Tables

  ### storage_versions
  - `id` (uuid, primary key) - Version record identifier
  - `bucket_id` (text) - Storage bucket name
  - `file_path` (text) - Full file path including folders
  - `version` (integer) - Version number (incremental)
  - `file_size` (bigint) - File size in bytes
  - `mime_type` (text) - Content type of the file
  - `uploaded_by` (uuid) - User who uploaded the file
  - `uploaded_at` (timestamptz) - Upload timestamp
  - `metadata` (jsonb) - Additional metadata
  - `is_current` (boolean) - Whether this is the current version

  ## Functions
  - `track_storage_version` - RPC function to track new file versions

  ## Indexes
  - Index on current versions for fast lookups
  - Index on user uploads for audit trails
  - Index on bucket and path for version queries
*/

-- Create storage_versions table
CREATE TABLE IF NOT EXISTS storage_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL,
  file_path text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  is_current boolean DEFAULT true,
  UNIQUE(bucket_id, file_path, version)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_storage_versions_current
  ON storage_versions(bucket_id, file_path)
  WHERE is_current = true;

CREATE INDEX IF NOT EXISTS idx_storage_versions_user
  ON storage_versions(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_storage_versions_bucket
  ON storage_versions(bucket_id);

CREATE INDEX IF NOT EXISTS idx_storage_versions_path
  ON storage_versions(file_path);

-- Enable RLS
ALTER TABLE storage_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view versions of their own files
CREATE POLICY "Users can view own file versions"
  ON storage_versions FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

-- Users can view versions of files in public buckets
CREATE POLICY "Public can view public bucket versions"
  ON storage_versions FOR SELECT
  TO authenticated
  USING (
    bucket_id IN ('guide-photos', 'user-avatars', 'tour-media')
  );

-- Admins can view all versions
CREATE POLICY "Admins can view all versions"
  ON storage_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Only service role can insert/update versions (via RPC)
CREATE POLICY "Service role can manage versions"
  ON storage_versions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RPC function to track storage version
CREATE OR REPLACE FUNCTION track_storage_version(
  p_bucket_id text,
  p_file_path text,
  p_file_size bigint,
  p_mime_type text,
  p_user_id uuid,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_version integer;
BEGIN
  -- Mark previous version as not current
  UPDATE storage_versions
  SET is_current = false
  WHERE bucket_id = p_bucket_id
    AND file_path = p_file_path
    AND is_current = true;

  -- Get next version number
  SELECT COALESCE(MAX(version), 0) + 1
  INTO v_next_version
  FROM storage_versions
  WHERE bucket_id = p_bucket_id
    AND file_path = p_file_path;

  -- Insert new version record
  INSERT INTO storage_versions (
    bucket_id,
    file_path,
    version,
    file_size,
    mime_type,
    uploaded_by,
    metadata,
    is_current
  ) VALUES (
    p_bucket_id,
    p_file_path,
    v_next_version,
    p_file_size,
    p_mime_type,
    p_user_id,
    p_metadata,
    true
  );

  RETURN v_next_version;
END;
$$;

-- Create storage stats view for monitoring
CREATE OR REPLACE VIEW storage_stats AS
SELECT
  bucket_id,
  COUNT(*) as total_files,
  COUNT(DISTINCT file_path) as unique_files,
  SUM(file_size) as total_bytes,
  SUM(file_size) / 1024 / 1024 as total_mb,
  AVG(file_size) / 1024 as avg_kb,
  MAX(uploaded_at) as last_upload,
  COUNT(DISTINCT uploaded_by) as unique_uploaders
FROM storage_versions
WHERE is_current = true
GROUP BY bucket_id;

-- Grant access to storage_stats view
GRANT SELECT ON storage_stats TO authenticated;

-- Create user storage quota view
CREATE OR REPLACE VIEW user_storage_quota AS
SELECT
  uploaded_by as user_id,
  bucket_id,
  COUNT(*) as file_count,
  SUM(file_size) as total_bytes,
  SUM(file_size) / 1024 / 1024 as total_mb
FROM storage_versions
WHERE is_current = true
  AND uploaded_by IS NOT NULL
GROUP BY uploaded_by, bucket_id;

-- Grant access to user_storage_quota view
GRANT SELECT ON user_storage_quota TO authenticated;

-- Create policy for users to view their own quota
CREATE POLICY "Users can view own quota"
  ON user_storage_quota FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to get user's total storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id uuid)
RETURNS TABLE (
  bucket_id text,
  file_count bigint,
  total_mb numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    bucket_id,
    file_count,
    total_mb
  FROM user_storage_quota
  WHERE user_id = p_user_id;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_storage_usage(uuid) TO authenticated;

-- Create function to cleanup old versions (admin only)
CREATE OR REPLACE FUNCTION cleanup_old_versions(
  p_keep_versions integer DEFAULT 5,
  p_older_than_days integer DEFAULT 90
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count integer := 0;
BEGIN
  -- Only allow admins to run this
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can cleanup old versions';
  END IF;

  -- Delete old versions, keeping the most recent N versions per file
  WITH versions_to_delete AS (
    SELECT id
    FROM (
      SELECT
        id,
        ROW_NUMBER() OVER (
          PARTITION BY bucket_id, file_path
          ORDER BY version DESC
        ) as rn
      FROM storage_versions
      WHERE is_current = false
        AND uploaded_at < NOW() - (p_older_than_days || ' days')::interval
    ) ranked
    WHERE rn > p_keep_versions
  )
  DELETE FROM storage_versions
  WHERE id IN (SELECT id FROM versions_to_delete);

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$;

-- Grant execute permission to authenticated users (function checks for admin)
GRANT EXECUTE ON FUNCTION cleanup_old_versions(integer, integer) TO authenticated;
