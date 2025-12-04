/*
  # Add Blog Post View Increment Function

  1. New Functions
    - `increment_blog_post_views` - Safely increment view_count for a blog post

  2. Changes
    - Creates a database function to atomically increment the view counter
*/

CREATE OR REPLACE FUNCTION increment_blog_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;