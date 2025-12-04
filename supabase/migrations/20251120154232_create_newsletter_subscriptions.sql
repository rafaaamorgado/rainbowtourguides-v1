/*
  # Newsletter Subscriptions Table

  Creates a table for managing newsletter email subscriptions with double opt-in.

  ## New Tables

  ### newsletter_subscriptions
  - `id` (uuid, primary key) - Unique subscription identifier
  - `email` (text, unique, required) - Subscriber email address
  - `status` (text, required) - Subscription status: pending, confirmed, unsubscribed
  - `token` (text, unique, required) - Confirmation token for double opt-in
  - `user_id` (uuid, nullable) - Associated user ID if signed up later
  - `subscribed_at` (timestamptz) - Initial subscription timestamp
  - `confirmed_at` (timestamptz, nullable) - Confirmation timestamp
  - `unsubscribed_at` (timestamptz, nullable) - Unsubscription timestamp
  - `ip_address` (text, nullable) - IP address for audit trail
  - `user_agent` (text, nullable) - Browser user agent for audit trail

  ## Security
  - Enable RLS on newsletter_subscriptions table
  - Allow anyone (anon) to insert pending subscriptions
  - Only admins can read/update subscription records
  - Confirmation is handled via public API endpoint

  ## Indexes
  - Index on email for fast lookups
  - Index on token for confirmation links
  - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'unsubscribed')) DEFAULT 'pending',
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  user_id uuid REFERENCES users(id),
  subscribed_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  ip_address text,
  user_agent text
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create newsletter subscriptions"
  ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Admins can read all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update subscriptions"
  ON newsletter_subscriptions FOR UPDATE
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

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscriptions(token);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);
