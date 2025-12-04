/*
  # Marketing Manager System - CMS Tables Part 1

  ## New Tables
  1. cms_pages - Landing pages and editable content
  2. cms_content_blocks - Reusable content blocks
  3. blog_categories - Blog categorization
  4. blog_posts - Blog articles and travel guides
  5. media_library - Centralized media management

  ## Security
  - Marketing managers can create and edit content
  - Admins can approve and publish
  - Public can read published content
*/

-- Add manager role documentation
COMMENT ON COLUMN users.role IS 'User role: traveler, guide, admin, support, moderator, or manager';

-- ============================================================================
-- 1. CMS PAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  page_type text NOT NULL CHECK (page_type IN ('landing', 'city', 'static', 'custom')),
  locale text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  hero_image_url text,
  hero_title text,
  hero_subtitle text,
  hero_cta_text text,
  hero_cta_link text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'published', 'archived')),
  published_at timestamptz,
  scheduled_publish_at timestamptz,
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_locale ON cms_pages(locale);
CREATE INDEX IF NOT EXISTS idx_cms_pages_scheduled ON cms_pages(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;

-- ============================================================================
-- 2. CMS CONTENT BLOCKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key text NOT NULL,
  block_type text NOT NULL CHECK (block_type IN ('text', 'html', 'markdown', 'faq', 'testimonials', 'features', 'cta', 'hero')),
  locale text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  content jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(block_key, locale)
);

CREATE INDEX IF NOT EXISTS idx_cms_blocks_key ON cms_content_blocks(block_key);
CREATE INDEX IF NOT EXISTS idx_cms_blocks_locale ON cms_content_blocks(locale);

-- ============================================================================
-- 3. BLOG CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES blog_categories(id),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_parent ON blog_categories(parent_id);

INSERT INTO blog_categories (slug, name, description) VALUES
  ('destinations', 'Destinations', 'Travel guides and destination highlights'),
  ('safety', 'Safety & Travel Tips', 'LGBTQ+ travel safety and advice'),
  ('lifestyle', 'Lifestyle', 'LGBTQ+ culture and lifestyle content'),
  ('news', 'LGBTQ+ News', 'Community news and updates'),
  ('guides', 'Local Guides', 'Stories from our guide community'),
  ('events', 'Events & Pride', 'Pride events and LGBTQ+ celebrations')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. BLOG POSTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  title text NOT NULL,
  subtitle text,
  excerpt text,
  body text NOT NULL,
  featured_image_url text,
  featured_image_alt text,
  category_id uuid REFERENCES blog_categories(id),
  tags text[] DEFAULT ARRAY[]::text[],
  author_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
  published_at timestamptz,
  scheduled_publish_at timestamptz,
  seo_title text,
  seo_description text,
  seo_keywords text[],
  view_count integer DEFAULT 0,
  booking_conversions integer DEFAULT 0,
  campaign_tags text[],
  featured boolean DEFAULT false,
  seasonal_tags text[],
  related_city_slugs text[],
  related_guide_ids text[],
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled ON blog_posts(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;

-- ============================================================================
-- 5. MEDIA LIBRARY
-- ============================================================================

CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'audio')),
  mime_type text NOT NULL,
  file_size_bytes bigint NOT NULL,
  width integer,
  height integer,
  duration_seconds integer,
  alt_text text,
  caption text,
  title text,
  tags text[],
  folder text DEFAULT 'root',
  uploaded_by uuid REFERENCES users(id),
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_tags ON media_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);

-- ============================================================================
-- ENABLE RLS
-- ============================================================================

ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- CMS Pages
CREATE POLICY "Managers and admins can view all cms_pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
    OR status = 'published'
  );

CREATE POLICY "Managers can create cms_pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can update cms_pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Admins can delete cms_pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Content Blocks
CREATE POLICY "Anyone can view published content_blocks"
  ON cms_content_blocks FOR SELECT
  USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can manage content_blocks"
  ON cms_content_blocks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Blog Posts
CREATE POLICY "Anyone can view published blog_posts"
  ON blog_posts FOR SELECT
  USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can manage blog_posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Blog Categories
CREATE POLICY "Anyone can view blog_categories"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Managers can manage blog_categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('manager', 'admin')
    )
  );

-- Media Library
CREATE POLICY "Managers can manage media_library"
  ON media_library FOR ALL
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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_content_blocks_updated_at BEFORE UPDATE ON cms_content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
