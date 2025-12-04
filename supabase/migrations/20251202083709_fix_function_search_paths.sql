/*
  # Fix Function Search Paths

  This migration fixes the search_path for functions to be immutable,
  preventing potential security issues.

  ## Functions Updated
  1. increment_blog_post_views
  2. update_last_login  
  3. update_updated_at
  4. update_updated_at_column

  ## Security Impact
  - Prevents potential SQL injection through search_path manipulation
  - Functions now have stable, secure search paths
*/

-- Fix increment_blog_post_views function
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE blog_posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id;
END;
$$;

-- Fix update_last_login function
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_login := NOW();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;