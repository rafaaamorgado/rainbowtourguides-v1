/*
  # Marketing Campaigns & Analytics Part 2

  ## New Tables
  1. email_campaigns - Marketing email campaigns
  2. email_campaign_analytics - Campaign performance tracking
  3. newsletter_segments - Subscriber segmentation
  4. seo_metadata - SEO tags and Open Graph data
  5. marketing_analytics - Traffic and conversion metrics
  6. utm_campaigns - UTM tracking links

  ## Security
  - Only marketing managers and admins can access
  - Analytics data protected by RLS
*/

-- ============================================================================
-- 1. EMAIL CAMPAIGNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  preview_text text,
  html_content text NOT NULL,
  plain_text_content text,
  from_name text NOT NULL,
  from_email text NOT NULL,
  reply_to text,
  segment_id uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_send_at timestamptz,
  sent_at timestamptz,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  campaign_type text NOT NULL CHECK (campaign_type IN ('newsletter', 'promo', 'announcement', 'digest', 'automated')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled ON email_campaigns(scheduled_send_at);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON email_campaigns(created_by);

-- ============================================================================
-- 2. EMAIL CAMPAIGN ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES newsletter_subscriptions(id),
  event_type text NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'complained')),
  link_url text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign ON email_campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_event ON email_campaign_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_created ON email_campaign_analytics(created_at);

-- ============================================================================
-- 3. NEWSLETTER SEGMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  filter_criteria jsonb NOT NULL,
  subscriber_count integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_segments_created_by ON newsletter_segments(created_by);

-- ============================================================================
-- 4. SEO METADATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('home', 'city', 'guide', 'blog', 'static', 'custom')),
  page_identifier text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  description text NOT NULL,
  keywords text[],
  og_title text,
  og_description text,
  og_image_url text,
  og_type text DEFAULT 'website',
  twitter_card text DEFAULT 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  canonical_url text,
  structured_data jsonb,
  robots_meta text DEFAULT 'index, follow',
  last_checked_at timestamptz,
  seo_score integer,
  accessibility_score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_type, page_identifier, locale)
);

CREATE INDEX IF NOT EXISTS idx_seo_metadata_page ON seo_metadata(page_type, page_identifier);
CREATE INDEX IF NOT EXISTS idx_seo_metadata_locale ON seo_metadata(locale);

-- ============================================================================
-- 5. MARKETING ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketing_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  source text NOT NULL,
  medium text,
  campaign text,
  sessions integer DEFAULT 0,
  new_users integer DEFAULT 0,
  pageviews integer DEFAULT 0,
  bounce_rate numeric(5,2),
  avg_session_duration_seconds integer,
  conversions integer DEFAULT 0,
  conversion_rate numeric(5,2),
  revenue_cents integer DEFAULT 0,
  top_pages jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, source, medium, campaign)
);

CREATE INDEX IF NOT EXISTS idx_marketing_analytics_date ON marketing_analytics(date);
CREATE INDEX IF NOT EXISTS idx_marketing_analytics_source ON marketing_analytics(source);

-- ============================================================================
-- 6. UTM CAMPAIGNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS utm_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  utm_source text NOT NULL,
  utm_medium text NOT NULL,
  utm_campaign text NOT NULL,
  utm_term text,
  utm_content text,
  target_url text NOT NULL,
  full_url text NOT NULL,
  click_count integer DEFAULT 0,
  conversion_count integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(utm_source, utm_medium, utm_campaign, utm_content)
);

CREATE INDEX IF NOT EXISTS idx_utm_campaigns_name ON utm_campaigns(name);
CREATE INDEX IF NOT EXISTS idx_utm_campaigns_created_by ON utm_campaigns(created_by);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_campaigns ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Email Campaigns
CREATE POLICY "Managers can manage email_campaigns"
  ON email_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Email Campaign Analytics
CREATE POLICY "Managers can view campaign_analytics"
  ON email_campaign_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "System can insert campaign_analytics"
  ON email_campaign_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Newsletter Segments
CREATE POLICY "Managers can manage newsletter_segments"
  ON newsletter_segments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- SEO Metadata
CREATE POLICY "Anyone can view seo_metadata"
  ON seo_metadata FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage seo_metadata"
  ON seo_metadata FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Marketing Analytics
CREATE POLICY "Managers can view marketing_analytics"
  ON marketing_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "System can insert marketing_analytics"
  ON marketing_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UTM Campaigns
CREATE POLICY "Managers can manage utm_campaigns"
  ON utm_campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_segments_updated_at BEFORE UPDATE ON newsletter_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON seo_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
