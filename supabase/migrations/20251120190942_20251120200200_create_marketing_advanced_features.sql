/*
  # Marketing Advanced Features Part 3

  ## New Tables
  1. promo_banners - Site-wide promotional banners
  2. ab_tests - A/B testing experiments
  3. content_versions - Version control and rollback
  4. affiliate_programs - Affiliate tracking
  5. social_media_metrics - Social performance data
  6. content_approvals - Approval workflow
  7. marketing_changelog - Audit trail

  ## Security
  - Marketing managers can create and manage
  - Admins can approve critical changes
  - Complete audit trail
*/

-- ============================================================================
-- 1. PROMO BANNERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS promo_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  cta_text text,
  cta_link text,
  banner_type text NOT NULL CHECK (banner_type IN ('announcement', 'discount', 'event', 'alert')),
  style jsonb,
  display_pages text[],
  priority integer DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_banners_active ON promo_banners(is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promo_banners_priority ON promo_banners(priority);

-- ============================================================================
-- 2. A/B TESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  test_type text NOT NULL CHECK (test_type IN ('cta', 'pricing', 'layout', 'copy', 'signup_flow')),
  page_slug text NOT NULL,
  variant_a jsonb NOT NULL,
  variant_b jsonb NOT NULL,
  traffic_split integer DEFAULT 50 CHECK (traffic_split BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  variant_a_views integer DEFAULT 0,
  variant_a_conversions integer DEFAULT 0,
  variant_b_views integer DEFAULT 0,
  variant_b_conversions integer DEFAULT 0,
  winner text CHECK (winner IN ('a', 'b', 'inconclusive')),
  started_at timestamptz,
  ended_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_page ON ab_tests(page_slug);

-- ============================================================================
-- 3. CONTENT VERSIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('cms_page', 'blog_post', 'content_block')),
  content_id uuid NOT NULL,
  version_number integer NOT NULL,
  content_snapshot jsonb NOT NULL,
  change_summary text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_versions_content ON content_versions(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_by ON content_versions(created_by);

-- ============================================================================
-- 4. AFFILIATE PROGRAMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS affiliate_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL,
  partner_logo_url text,
  affiliate_code text UNIQUE NOT NULL,
  landing_page_slug text,
  commission_rate_pct numeric(5,2) NOT NULL,
  tracking_url text,
  referral_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  total_revenue_cents integer DEFAULT 0,
  total_payout_cents integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'terminated')),
  contact_email text,
  notes text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_programs_code ON affiliate_programs(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_programs_status ON affiliate_programs(status);

-- ============================================================================
-- 5. SOCIAL MEDIA METRICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS social_media_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'tiktok', 'youtube')),
  metric_date date NOT NULL,
  followers_count integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  engagement_count integer DEFAULT 0,
  reach integer DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  top_posts jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(platform, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_social_media_platform ON social_media_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_date ON social_media_metrics(metric_date);

-- ============================================================================
-- 6. CONTENT APPROVALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('cms_page', 'blog_post', 'email_campaign', 'banner')),
  content_id uuid NOT NULL,
  requester_id uuid REFERENCES users(id),
  approver_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
  reviewer_notes text,
  requested_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_content_approvals_status ON content_approvals(status);
CREATE INDEX IF NOT EXISTS idx_content_approvals_requester ON content_approvals(requester_id);
CREATE INDEX IF NOT EXISTS idx_content_approvals_approver ON content_approvals(approver_id);

-- ============================================================================
-- 7. MARKETING CHANGELOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketing_changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('page_published', 'post_published', 'campaign_sent', 'banner_created', 'test_started', 'content_updated')),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_changelog_created ON marketing_changelog(created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_changelog_author ON marketing_changelog(author_id);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_changelog ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Promo Banners: Public can see active, managers can edit
CREATE POLICY "Anyone can view active promo_banners"
  ON promo_banners FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can manage promo_banners"
  ON promo_banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- A/B Tests
CREATE POLICY "Managers can manage ab_tests"
  ON ab_tests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Content Versions
CREATE POLICY "Managers can manage content_versions"
  ON content_versions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Affiliate Programs
CREATE POLICY "Managers can manage affiliate_programs"
  ON affiliate_programs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Social Media Metrics
CREATE POLICY "Managers can view social_media_metrics"
  ON social_media_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "System can insert social_media_metrics"
  ON social_media_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Content Approvals
CREATE POLICY "Managers can view content_approvals"
  ON content_approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can create approval_requests"
  ON content_approvals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Admins can update approvals"
  ON content_approvals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Marketing Changelog
CREATE POLICY "Managers can view marketing_changelog"
  ON marketing_changelog FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "System can insert marketing_changelog"
  ON marketing_changelog FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_promo_banners_updated_at BEFORE UPDATE ON promo_banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_programs_updated_at BEFORE UPDATE ON affiliate_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE promo_banners IS 'Site-wide promotional banners with scheduling';
COMMENT ON TABLE ab_tests IS 'A/B testing experiments for conversion optimization';
COMMENT ON TABLE content_versions IS 'Version control for all content with rollback';
COMMENT ON TABLE affiliate_programs IS 'Affiliate partner tracking and commissions';
COMMENT ON TABLE social_media_metrics IS 'Social media performance from API integrations';
COMMENT ON TABLE content_approvals IS 'Approval workflow for content publishing';
COMMENT ON TABLE marketing_changelog IS 'Complete audit trail of marketing actions';
