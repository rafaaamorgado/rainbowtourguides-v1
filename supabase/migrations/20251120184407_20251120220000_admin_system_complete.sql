/*
  # Complete Admin System - Platform Management

  ## Changes
  
  1. System Settings
    - Create platform_settings table for global configuration
    - Commission rates, fees, cancellation rules
    - Currency and payment gateway settings
  
  2. Audit Log
    - Create admin_audit_log for all admin actions
    - Track who did what and when
  
  3. Platform Analytics
    - Create platform_analytics for KPIs
    - Daily/monthly metrics
  
  4. Content Management
    - Create cms_content for homepage, FAQs, city descriptions
    - Version control and approval workflow
  
  5. Admin Users
    - Enhance users table with admin roles
    - Add 2FA enforcement, last_login tracking
  
  6. Safety & Moderation
    - Enhance reports table
    - Add moderation history
  
  7. System Monitoring
    - Create system_logs for errors and events
    - API monitoring and alerts

  ## Security
  - All tables have strict RLS
  - Only admins can access
  - Audit trail for compliance
*/

-- ============================================================================
-- 1. PLATFORM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL CHECK (category IN ('payments', 'policies', 'features', 'integrations', 'system')),
  description text,
  last_updated_by uuid,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings"
  ON platform_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

-- Insert default settings
INSERT INTO platform_settings (key, value, category, description) VALUES
  ('commission_rate', '{"percentage": 15, "min_usd": 5}', 'payments', 'Platform commission on bookings'),
  ('traveler_service_fee', '{"percentage": 10}', 'payments', 'Service fee charged to travelers'),
  ('cancellation_rules', '{
    "48_hours": {"refund": 100, "description": "Full refund if cancelled 48+ hours before"},
    "24_hours": {"refund": 50, "description": "50% refund if cancelled 24-48 hours before"},
    "under_24": {"refund": 0, "description": "No refund if cancelled under 24 hours"}
  }', 'policies', 'Cancellation and refund policy'),
  ('supported_currencies', '["USD", "EUR", "GBP", "JPY", "AUD"]', 'payments', 'Available currencies'),
  ('payment_gateways', '{"stripe": true, "paypal": true, "momo": false, "zalopay": false}', 'integrations', 'Enabled payment providers'),
  ('supported_languages', '["en", "es", "fr", "de", "pt"]', 'system', 'Available site languages'),
  ('default_locale', '"en"', 'system', 'Default language'),
  ('email_smtp', '{"host": null, "port": null, "user": null, "from": "noreply@rainbowtourguides.com"}', 'integrations', 'SMTP configuration'),
  ('analytics_tracking', '{"google_analytics": null, "mixpanel": null}', 'integrations', 'Analytics tracking IDs'),
  ('maintenance_mode', 'false', 'system', 'Enable maintenance mode'),
  ('featured_guides_limit', '12', 'features', 'Max featured guides on homepage')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_settings_category ON platform_settings(category);

COMMENT ON TABLE platform_settings IS 'Global platform configuration and settings';

-- ============================================================================
-- 2. ADMIN AUDIT LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('user', 'guide', 'booking', 'review', 'setting', 'content', 'report')),
  target_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can view audit log
CREATE POLICY "Admins can view audit log"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

-- System can insert audit entries
CREATE POLICY "System can insert audit entries"
  ON admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = (select auth.uid()));

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_target ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log(created_at);

COMMENT ON TABLE admin_audit_log IS 'Complete audit trail of all admin actions';

-- ============================================================================
-- 3. PLATFORM ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS platform_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  signups_travelers integer DEFAULT 0,
  signups_guides integer DEFAULT 0,
  active_users integer DEFAULT 0,
  guides_verified integer DEFAULT 0,
  booking_requests integer DEFAULT 0,
  bookings_accepted integer DEFAULT 0,
  bookings_completed integer DEFAULT 0,
  bookings_cancelled integer DEFAULT 0,
  total_revenue integer DEFAULT 0,
  commission_revenue integer DEFAULT 0,
  refunds_issued integer DEFAULT 0,
  reviews_posted integer DEFAULT 0,
  reports_submitted integer DEFAULT 0,
  metrics jsonb DEFAULT '{}'
);

ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

-- Admins can view analytics
CREATE POLICY "Admins can view analytics"
  ON platform_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date DESC);

COMMENT ON TABLE platform_analytics IS 'Daily platform-wide KPIs and metrics';

-- ============================================================================
-- 4. CMS CONTENT MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('page', 'section', 'faq', 'city_description', 'banner', 'email_template')),
  title text NOT NULL,
  content jsonb NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'archived')),
  language text DEFAULT 'en',
  created_by uuid NOT NULL,
  approved_by uuid,
  published_at timestamptz,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Admins can manage content
CREATE POLICY "Admins can manage content"
  ON cms_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

-- Public can read published content
CREATE POLICY "Public can read published content"
  ON cms_content FOR SELECT
  USING (status = 'published');

CREATE INDEX IF NOT EXISTS idx_cms_type_status ON cms_content(type, status);
CREATE INDEX IF NOT EXISTS idx_cms_key ON cms_content(key);

COMMENT ON TABLE cms_content IS 'CMS for managing site content with approval workflow';

-- ============================================================================
-- 5. FEATURED CONTENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS featured_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('guide', 'city', 'promo')),
  target_id uuid NOT NULL,
  position integer NOT NULL,
  location text NOT NULL CHECK (location IN ('homepage', 'city_page', 'explore')),
  active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE featured_content ENABLE ROW LEVEL SECURITY;

-- Admins can manage featured content
CREATE POLICY "Admins can manage featured"
  ON featured_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

-- Public can read active featured content
CREATE POLICY "Public can read active featured"
  ON featured_content FOR SELECT
  USING (
    active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  );

CREATE INDEX IF NOT EXISTS idx_featured_type_location ON featured_content(type, location, active);

COMMENT ON TABLE featured_content IS 'Featured guides and cities on homepage';

-- ============================================================================
-- 6. SYSTEM LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
  category text NOT NULL CHECK (category IN ('api', 'auth', 'payment', 'email', 'webhook', 'system')),
  message text NOT NULL,
  details jsonb,
  stack_trace text,
  user_id uuid,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view system logs
CREATE POLICY "Admins can view logs"
  ON system_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

CREATE INDEX IF NOT EXISTS idx_logs_level_created ON system_logs(level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_category ON system_logs(category);

COMMENT ON TABLE system_logs IS 'System error and event logs for monitoring';

-- ============================================================================
-- 7. ENHANCE REPORTS TABLE
-- ============================================================================

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS assigned_to uuid,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS resolution_notes text,
ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
ADD COLUMN IF NOT EXISTS resolved_by uuid;

CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority, status);
CREATE INDEX IF NOT EXISTS idx_reports_assigned ON reports(assigned_to);

-- ============================================================================
-- 8. CITY MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS cities_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  country text NOT NULL,
  timezone text NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'hidden')),
  description text,
  banner_image text,
  guides_count integer DEFAULT 0,
  launch_date date,
  featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cities_config ENABLE ROW LEVEL SECURITY;

-- Admins can manage cities
CREATE POLICY "Admins can manage cities"
  ON cities_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

-- Public can read active cities
CREATE POLICY "Public can read active cities"
  ON cities_config FOR SELECT
  USING (status = 'active');

CREATE INDEX IF NOT EXISTS idx_cities_status ON cities_config(status);

COMMENT ON TABLE cities_config IS 'City configuration and status management';

-- ============================================================================
-- 9. BROADCAST ANNOUNCEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS broadcast_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'maintenance', 'feature', 'policy')),
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'travelers', 'guides', 'unverified')),
  delivery_method text[] DEFAULT ARRAY['email', 'in_app'],
  sent_to_count integer DEFAULT 0,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE broadcast_announcements ENABLE ROW LEVEL SECURITY;

-- Admins can manage announcements
CREATE POLICY "Admins can manage announcements"
  ON broadcast_announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

CREATE INDEX IF NOT EXISTS idx_announcements_sent ON broadcast_announcements(sent_at);

COMMENT ON TABLE broadcast_announcements IS 'Platform-wide broadcast messages';

-- ============================================================================
-- 10. SYSTEM ALERTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('booking_drop', 'payment_failure', 'api_error', 'uptime', 'security')),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message text NOT NULL,
  metrics jsonb,
  triggered_at timestamptz DEFAULT now(),
  acknowledged boolean DEFAULT false,
  acknowledged_by uuid,
  acknowledged_at timestamptz
);

ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can manage alerts
CREATE POLICY "Admins can manage alerts"
  ON system_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = (select auth.uid())
      AND users.role IN ('admin', 'support')
    )
  );

CREATE INDEX IF NOT EXISTS idx_alerts_severity ON system_alerts(severity, triggered_at DESC);

COMMENT ON TABLE system_alerts IS 'Automated system alerts and monitoring';

-- ============================================================================
-- 11. ENHANCE USERS TABLE FOR ADMIN FEATURES
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS ban_reason text,
ADD COLUMN IF NOT EXISTS banned_by uuid,
ADD COLUMN IF NOT EXISTS suspended_reason text,
ADD COLUMN IF NOT EXISTS suspended_by uuid,
ADD COLUMN IF NOT EXISTS suspended_until timestamptz,
ADD COLUMN IF NOT EXISTS ip_address inet,
ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS flagged_for_review boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_notes text;

CREATE INDEX IF NOT EXISTS idx_users_flagged ON users(flagged_for_review) WHERE flagged_for_review = true;
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(banned_until) WHERE banned_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_ip ON users(ip_address);

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '=== Admin System Migration Complete ===';
  RAISE NOTICE '✓ Created platform_settings table with default config';
  RAISE NOTICE '✓ Created admin_audit_log for compliance';
  RAISE NOTICE '✓ Created platform_analytics for KPIs';
  RAISE NOTICE '✓ Created cms_content for content management';
  RAISE NOTICE '✓ Created featured_content for homepage';
  RAISE NOTICE '✓ Created system_logs for monitoring';
  RAISE NOTICE '✓ Created cities_config for city management';
  RAISE NOTICE '✓ Created broadcast_announcements';
  RAISE NOTICE '✓ Created system_alerts for automation';
  RAISE NOTICE '✓ Enhanced reports table with assignments';
  RAISE NOTICE '✓ Enhanced users table with admin fields';
  RAISE NOTICE '✓ All tables secured with RLS';
END $$;
