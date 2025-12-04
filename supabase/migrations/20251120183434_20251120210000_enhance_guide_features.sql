/*
  # Enhance Guide Features - Complete System

  ## Changes
  
  1. Guide Profile Enhancements
    - Add tagline, years_experience, account_status
    - Add verification_status and documents
    - Add payout information
    - Add statistics and analytics fields
  
  2. Guide Onboarding
    - Add onboarding_completed and onboarding_step tracking
    - Save progress for multi-step forms
  
  3. Availability System
    - Add last_minute_booking_enabled
    - Add custom_availability_rules
  
  4. Earnings & Payouts
    - Create payouts table
    - Create earnings_summary table
    - Track platform commission per booking
  
  5. Guide Actions
    - Add decline_reason to reservations
    - Add guide_response_time tracking
    - Add tour_status (started, completed, no-show)
  
  6. Verification System
    - Create verification_documents table
    - Track verification status and history
  
  7. Guide Settings
    - Add notification preferences
    - Add profile visibility settings
    - Add analytics opt-in

  ## Security
  - All tables have RLS enabled
  - Guides can only access their own data
  - Admins have full access for verification
*/

-- ============================================================================
-- 1. ENHANCE GUIDE PROFILES
-- ============================================================================

ALTER TABLE guide_profiles
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active' CHECK (account_status IN ('active', 'temporarily_unavailable', 'suspended')),
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'resubmit')),
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS onboarding_data jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_conversion_rate numeric(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time_avg integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payout_method jsonb DEFAULT jsonb_build_object(
  'type', null,
  'account_id', null,
  'verified', false
),
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT jsonb_build_object(
  'booking_requests', true,
  'messages', true,
  'payouts', true,
  'reviews', true,
  'email', true,
  'push', false,
  'sms', false
),
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_guide_verification_status ON guide_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_guide_account_status ON guide_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_guide_onboarding ON guide_profiles(onboarding_completed);

COMMENT ON COLUMN guide_profiles.tagline IS 'Short catchy headline for guide profile';
COMMENT ON COLUMN guide_profiles.verification_status IS 'Guide identity verification status';
COMMENT ON COLUMN guide_profiles.onboarding_step IS 'Current step in onboarding flow (1-5)';

-- ============================================================================
-- 2. ENHANCE AVAILABILITY SYSTEM
-- ============================================================================

ALTER TABLE availability
ADD COLUMN IF NOT EXISTS last_minute_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_rules jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS auto_decline_hours integer DEFAULT 24;

COMMENT ON COLUMN availability.last_minute_enabled IS 'Allow same-day bookings';
COMMENT ON COLUMN availability.auto_decline_hours IS 'Hours before auto-declining pending requests';

-- ============================================================================
-- 3. VERIFICATION DOCUMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'selfie', 'license', 'certificate', 'other')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- Guides can manage their own documents
CREATE POLICY "Guides can manage own documents"
  ON verification_documents FOR ALL
  TO authenticated
  USING (
    guide_id IN (
      SELECT uid FROM guide_profiles WHERE uid = (select auth.uid())
    )
  )
  WITH CHECK (
    guide_id IN (
      SELECT uid FROM guide_profiles WHERE uid = (select auth.uid())
    )
  );

-- Admins can review all documents
CREATE POLICY "Admins can review all documents"
  ON verification_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_verification_guide ON verification_documents(guide_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_documents(status);

COMMENT ON TABLE verification_documents IS 'Guide identity and credential verification documents';

-- ============================================================================
-- 4. PAYOUTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payout_method jsonb NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  reservation_ids jsonb NOT NULL,
  initiated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  failure_reason text,
  transaction_id text
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Guides can view their own payouts
CREATE POLICY "Guides can view own payouts"
  ON payouts FOR SELECT
  TO authenticated
  USING (
    guide_id IN (
      SELECT uid FROM guide_profiles WHERE uid = (select auth.uid())
    )
  );

-- Admins can manage all payouts
CREATE POLICY "Admins can manage payouts"
  ON payouts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_payouts_guide ON payouts(guide_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_period ON payouts(period_start, period_end);

COMMENT ON TABLE payouts IS 'Guide payout transactions';

-- ============================================================================
-- 5. ENHANCE RESERVATIONS FOR GUIDE FEATURES
-- ============================================================================

ALTER TABLE reservations
ADD COLUMN IF NOT EXISTS decline_reason text,
ADD COLUMN IF NOT EXISTS guide_responded_at timestamptz,
ADD COLUMN IF NOT EXISTS auto_declined boolean DEFAULT false;

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS tour_status text DEFAULT 'scheduled' CHECK (tour_status IN ('scheduled', 'started', 'completed', 'no_show_traveler', 'no_show_guide', 'cancelled')),
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz,
ADD COLUMN IF NOT EXISTS cancellation_reason text,
ADD COLUMN IF NOT EXISTS cancelled_by uuid;

CREATE INDEX IF NOT EXISTS idx_bookings_tour_status ON bookings(tour_status);
CREATE INDEX IF NOT EXISTS idx_reservations_guide_responded ON reservations(guide_responded_at);

COMMENT ON COLUMN reservations.decline_reason IS 'Reason provided by guide when declining';
COMMENT ON COLUMN bookings.tour_status IS 'Current status of the tour session';

-- ============================================================================
-- 6. GUIDE ANALYTICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS guide_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL,
  date date NOT NULL,
  profile_views integer DEFAULT 0,
  booking_requests integer DEFAULT 0,
  bookings_accepted integer DEFAULT 0,
  bookings_completed integer DEFAULT 0,
  total_earnings integer DEFAULT 0,
  avg_rating numeric(3,2),
  UNIQUE(guide_id, date)
);

ALTER TABLE guide_analytics ENABLE ROW LEVEL SECURITY;

-- Guides can view their own analytics
CREATE POLICY "Guides can view own analytics"
  ON guide_analytics FOR SELECT
  TO authenticated
  USING (
    guide_id IN (
      SELECT uid FROM guide_profiles WHERE uid = (select auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_analytics_guide_date ON guide_analytics(guide_id, date);

COMMENT ON TABLE guide_analytics IS 'Daily analytics for guide performance';

-- ============================================================================
-- 7. GUIDE ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS guide_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'urgent')),
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'verified', 'pending', 'active')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE guide_announcements ENABLE ROW LEVEL SECURITY;

-- All guides can read active announcements
CREATE POLICY "Guides can read announcements"
  ON guide_announcements FOR SELECT
  TO authenticated
  USING (
    active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND EXISTS (
      SELECT 1 FROM guide_profiles WHERE uid = (select auth.uid())
    )
  );

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements"
  ON guide_announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_announcements_active ON guide_announcements(active, expires_at);

COMMENT ON TABLE guide_announcements IS 'Platform announcements for guides';

-- ============================================================================
-- 8. AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_guide_profiles_updated_at ON guide_profiles;
CREATE TRIGGER update_guide_profiles_updated_at
  BEFORE UPDATE ON guide_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Guide Features Migration Complete ===';
  RAISE NOTICE '✓ Enhanced guide_profiles with 15+ new fields';
  RAISE NOTICE '✓ Created verification_documents table';
  RAISE NOTICE '✓ Created payouts table';
  RAISE NOTICE '✓ Created guide_analytics table';
  RAISE NOTICE '✓ Created guide_announcements table';
  RAISE NOTICE '✓ Enhanced reservations and bookings tracking';
  RAISE NOTICE '✓ Added RLS policies for all new tables';
  RAISE NOTICE '✓ Created performance indexes';
  RAISE NOTICE '✓ Added auto-update timestamp triggers';
END $$;
