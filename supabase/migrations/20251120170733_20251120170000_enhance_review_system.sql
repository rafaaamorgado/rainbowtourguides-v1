/*
  # Enhance Review System

  1. Changes
    - Add responseAt timestamp for tracking when reviews were responded to
    - Add editedAt timestamp for tracking review edits
    - Add originalText for edit history
    - Update policies to allow review authors to edit within 24h
    - Add mutual review support (both travelers and guides can review each other)

  2. Security
    - Authors can edit their own reviews within 24h
    - Subject users can respond to reviews at any time
    - All users can read published reviews
*/

-- Add new columns for enhanced review tracking
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "responseAt" timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "editedAt" timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "originalText" text;

-- Update the policy to allow authors to edit their own reviews within 24h
DROP POLICY IF EXISTS "Authors can update own reviews within 24h" ON reviews;
CREATE POLICY "Authors can update own reviews within 24h"
  ON reviews FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = "authorUserId"::text
    AND "createdAt" > NOW() - INTERVAL '24 hours'
  )
  WITH CHECK (
    auth.uid()::text = "authorUserId"::text
    AND "createdAt" > NOW() - INTERVAL '24 hours'
  );

-- Update indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_author ON reviews("authorUserId");
CREATE INDEX IF NOT EXISTS idx_reviews_reservation ON reviews("reservationId");
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews("createdAt" DESC);

-- Add comment for documentation
COMMENT ON COLUMN reviews."responseAt" IS 'Timestamp when the subject user responded to the review';
COMMENT ON COLUMN reviews."editedAt" IS 'Timestamp of the last edit by the author';
COMMENT ON COLUMN reviews."originalText" IS 'Original review text before any edits';