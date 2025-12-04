/*
  # Contact Submissions Table

  Creates a table to store contact form submissions from the website.

  ## New Tables

  ### contact_submissions
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text, required) - Name of person submitting
  - `email` (text, required) - Email address for contact
  - `subject` (text, required) - Subject of inquiry
  - `message` (text, required) - Message content (max 2000 chars)
  - `gdpr_consent` (boolean, required) - GDPR consent checkbox status
  - `status` (text) - Submission status: new, reviewed, resolved
  - `user_id` (uuid, nullable) - User ID if submitted by authenticated user
  - `created_at` (timestamptz) - Submission timestamp
  - `resolved_at` (timestamptz, nullable) - Resolution timestamp
  - `resolved_by` (uuid, nullable) - Admin who resolved the submission
  - `admin_notes` (text, nullable) - Internal admin notes

  ## Security
  - Enable RLS on contact_submissions table
  - Allow anyone (anon + authenticated) to insert submissions
  - Only authenticated users can read their own submissions
  - Admins have full access to all submissions
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL CHECK (length(message) <= 2000),
  gdpr_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('new', 'reviewed', 'resolved')) DEFAULT 'new',
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES users(id),
  admin_notes text
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create submissions
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator', 'support')
    )
  );

-- Admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator', 'support')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator', 'support')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user ON contact_submissions(user_id);