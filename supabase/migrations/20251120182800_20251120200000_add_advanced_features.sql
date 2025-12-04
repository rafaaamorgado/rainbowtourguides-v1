/*
  # Add Advanced Traveler Features

  ## Changes
  
  1. Guide Social Links
    - Add social_links JSONB to guide_profiles (Instagram, Twitter, Facebook, etc.)
  
  2. Blocked Guides
    - Create blocked_guides table for users to hide specific guides
  
  3. Promo Codes
    - Create promo_codes table with discount rules
    - Add promo_code_id to reservations
  
  4. Loyalty/Status System
    - Add loyalty_tier and loyalty_points to traveler_profiles
    - Create loyalty_perks table
  
  5. Review Editing
    - Add edited_at to reviews table
    - Track edit history
  
  6. Two-Factor Authentication
    - Add mfa_enabled and mfa_secret to users table
  
  7. Payment Methods
    - Add payment_method JSONB to users (MoMo, ZaloPay support)

  ## Security
  - All tables have RLS enabled
  - Appropriate indexes for performance
*/

-- ============================================================================
-- 1. ADD SOCIAL LINKS TO GUIDE PROFILES
-- ============================================================================

ALTER TABLE guide_profiles 
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT jsonb_build_object(
  'instagram', null,
  'twitter', null,
  'facebook', null,
  'tiktok', null,
  'youtube', null,
  'website', null
);

COMMENT ON COLUMN guide_profiles.social_links IS 'Guide social media links and personal website';

-- ============================================================================
-- 2. BLOCKED GUIDES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blocked_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL,
  guide_id uuid NOT NULL,
  reason text,
  blocked_at timestamptz DEFAULT now(),
  UNIQUE(traveler_id, guide_id)
);

ALTER TABLE blocked_guides ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own blocks
CREATE POLICY "Travelers can manage own blocks"
  ON blocked_guides FOR ALL
  TO authenticated
  USING (traveler_id = (select auth.uid()))
  WITH CHECK (traveler_id = (select auth.uid()));

CREATE INDEX IF NOT EXISTS idx_blocked_guides_traveler ON blocked_guides(traveler_id);
CREATE INDEX IF NOT EXISTS idx_blocked_guides_guide ON blocked_guides(guide_id);

COMMENT ON TABLE blocked_guides IS 'Allows travelers to hide guides they do not want to see';

-- ============================================================================
-- 3. PROMO CODES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value integer NOT NULL CHECK (discount_value > 0),
  min_booking_amount integer DEFAULT 0,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active promo codes
CREATE POLICY "Anyone can read active promo codes"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (active = true AND (valid_until IS NULL OR valid_until > now()));

-- Admins can manage promo codes
CREATE POLICY "Admins can manage promo codes"
  ON promo_codes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid()) 
      AND users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(active) WHERE active = true;

-- Add promo code reference to reservations
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS promo_code_id uuid REFERENCES promo_codes(id),
ADD COLUMN IF NOT EXISTS discount_amount integer DEFAULT 0;

COMMENT ON TABLE promo_codes IS 'Discount codes for travelers';

-- ============================================================================
-- 4. LOYALTY SYSTEM
-- ============================================================================

-- Add loyalty fields to traveler_profiles
ALTER TABLE traveler_profiles
ADD COLUMN IF NOT EXISTS loyalty_tier text DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_traveler_loyalty_tier ON traveler_profiles(loyalty_tier);

-- Loyalty perks table
CREATE TABLE IF NOT EXISTS loyalty_perks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  perk_type text NOT NULL CHECK (perk_type IN ('discount', 'priority_booking', 'free_cancellation', 'concierge')),
  value jsonb NOT NULL,
  description text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loyalty_perks ENABLE ROW LEVEL SECURITY;

-- Anyone can read active perks
CREATE POLICY "Anyone can read active perks"
  ON loyalty_perks FOR SELECT
  TO authenticated
  USING (active = true);

-- Insert default loyalty perks
INSERT INTO loyalty_perks (tier, perk_type, value, description) VALUES
  ('bronze', 'discount', '{"percentage": 0}', 'Standard pricing'),
  ('silver', 'discount', '{"percentage": 5}', '5% discount on all bookings'),
  ('silver', 'priority_booking', '{"hours": 12}', 'Book with 12-hour lead time instead of 24'),
  ('gold', 'discount', '{"percentage": 10}', '10% discount on all bookings'),
  ('gold', 'priority_booking', '{"hours": 6}', 'Book with 6-hour lead time'),
  ('gold', 'free_cancellation', '{"hours": 12}', 'Free cancellation up to 12 hours before'),
  ('platinum', 'discount', '{"percentage": 15}', '15% discount on all bookings'),
  ('platinum', 'priority_booking', '{"hours": 3}', 'Book with 3-hour lead time'),
  ('platinum', 'free_cancellation', '{"hours": 6}', 'Free cancellation up to 6 hours before'),
  ('platinum', 'concierge', '{"enabled": true}', 'Dedicated concierge service')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE loyalty_perks IS 'Benefits for loyal travelers based on their tier';

-- ============================================================================
-- 5. REVIEW EDITING
-- ============================================================================

ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS edited_at timestamptz,
ADD COLUMN IF NOT EXISTS edit_count integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_reviews_edited ON reviews(edited_at) WHERE edited_at IS NOT NULL;

COMMENT ON COLUMN reviews.edited_at IS 'Last time review was edited (24h grace period)';

-- ============================================================================
-- 6. TWO-FACTOR AUTHENTICATION
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS mfa_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS mfa_secret text,
ADD COLUMN IF NOT EXISTS mfa_backup_codes jsonb;

CREATE INDEX IF NOT EXISTS idx_users_mfa_enabled ON users(mfa_enabled) WHERE mfa_enabled = true;

COMMENT ON COLUMN users.mfa_enabled IS 'Whether 2FA is enabled for this user';

-- ============================================================================
-- 7. PAYMENT METHODS
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS payment_methods jsonb DEFAULT jsonb_build_object(
  'default', 'card',
  'methods', jsonb_build_array(
    jsonb_build_object('type', 'card', 'enabled', true)
  )
);

COMMENT ON COLUMN users.payment_methods IS 'Supported payment methods including MoMo, ZaloPay';

-- ============================================================================
-- 8. CHAT IMAGE UPLOADS (Storage Setup)
-- ============================================================================

-- Add image_url to messages for shared images
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS image_metadata jsonb;

COMMENT ON COLUMN messages.image_url IS 'URL to uploaded image in Supabase Storage';

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Advanced Features Migration Complete ===';
  RAISE NOTICE '✓ Social links added to guide profiles';
  RAISE NOTICE '✓ Blocked guides table created';
  RAISE NOTICE '✓ Promo codes system created';
  RAISE NOTICE '✓ Loyalty/status system created with 4 tiers';
  RAISE NOTICE '✓ Review editing tracking added';
  RAISE NOTICE '✓ Two-factor authentication fields added';
  RAISE NOTICE '✓ Payment methods (MoMo/ZaloPay) support added';
  RAISE NOTICE '✓ Chat image sharing support added';
  RAISE NOTICE '✓ All tables secured with RLS';
END $$;
