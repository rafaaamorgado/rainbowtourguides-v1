/*
  # Add Missing Foreign Key Indexes

  This migration adds indexes for all foreign keys that were missing covering indexes,
  which can lead to suboptimal query performance.

  ## Indexes Added
  1. ab_tests.created_by
  2. affiliate_programs.created_by
  3. blog_posts.created_by and updated_by
  4. cms_content_blocks.created_by and updated_by
  5. cms_pages.approved_by, created_by, and updated_by
  6. email_campaign_analytics.subscriber_id
  7. promo_banners.created_by
  8. reservations.promo_code_id

  ## Performance Impact
  - These indexes will significantly improve JOIN performance
  - Query performance will be optimized for foreign key lookups
  - Minimal storage overhead (~1-2% per index)
*/

-- ab_tests indexes
CREATE INDEX IF NOT EXISTS idx_ab_tests_created_by ON public.ab_tests(created_by);

-- affiliate_programs indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_programs_created_by ON public.affiliate_programs(created_by);

-- blog_posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_by ON public.blog_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_by ON public.blog_posts(updated_by);

-- cms_content_blocks indexes
CREATE INDEX IF NOT EXISTS idx_cms_content_blocks_created_by ON public.cms_content_blocks(created_by);
CREATE INDEX IF NOT EXISTS idx_cms_content_blocks_updated_by ON public.cms_content_blocks(updated_by);

-- cms_pages indexes
CREATE INDEX IF NOT EXISTS idx_cms_pages_approved_by ON public.cms_pages(approved_by);
CREATE INDEX IF NOT EXISTS idx_cms_pages_created_by ON public.cms_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_cms_pages_updated_by ON public.cms_pages(updated_by);

-- email_campaign_analytics indexes
CREATE INDEX IF NOT EXISTS idx_email_campaign_analytics_subscriber_id ON public.email_campaign_analytics(subscriber_id);

-- promo_banners indexes
CREATE INDEX IF NOT EXISTS idx_promo_banners_created_by ON public.promo_banners(created_by);

-- reservations indexes
CREATE INDEX IF NOT EXISTS idx_reservations_promo_code_id ON public.reservations(promo_code_id);