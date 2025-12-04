/*
  # Announcement Banners Table

  Creates a table for managing site-wide announcement banners and promotional messages.

  ## New Tables

  ### announcement_banners
  - `id` (uuid, primary key) - Unique banner identifier
  - `message` (text, required) - Banner message text
  - `link` (text, nullable) - Optional link URL
  - `cta_text` (text, nullable) - Call-to-action button text
  - `banner_type` (text, required) - Type: info, success, warning, promo
  - `is_active` (boolean) - Whether banner is currently active
  - `start_date` (timestamptz, nullable) - When to start showing banner
  - `end_date` (timestamptz, nullable) - When to stop showing banner
  - `priority` (integer) - Display priority (higher = more important)
  - `dismissible` (boolean) - Whether users can dismiss the banner
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on announcement_banners table
  - Anyone (anon/authenticated) can read active banners
  - Only admins can create/update/delete banners

  ## Indexes
  - Index on is_active for fast filtering
  - Index on start_date and end_date for date range queries
  - Index on priority for ordering
*/

CREATE TABLE IF NOT EXISTS announcement_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  link text,
  cta_text text,
  banner_type text NOT NULL CHECK (banner_type IN ('info', 'success', 'warning', 'promo')) DEFAULT 'info',
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  priority integer DEFAULT 0,
  dismissible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcement_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active banners"
  ON announcement_banners FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

CREATE POLICY "Admins can manage banners"
  ON announcement_banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_banners_active ON announcement_banners(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_banners_dates ON announcement_banners(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_banners_priority ON announcement_banners(priority DESC);

-- Insert a sample banner
INSERT INTO announcement_banners (message, link, cta_text, banner_type, priority, is_active)
VALUES (
  'Now available in Da Nang, Vietnam! 🌈 Book your guide today.',
  '/explore',
  'Explore Now',
  'promo',
  10,
  true
)
ON CONFLICT DO NOTHING;
