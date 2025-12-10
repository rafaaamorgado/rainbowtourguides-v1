-- ============================================================================
-- VERIFICATION QUERY: Check if tables exist
-- ============================================================================
-- Run this query FIRST to see if your database schema has been created
-- If this returns 0 rows, you need to run migrations-consolidated.sql first

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('cities', 'users', 'guide_profiles', 'reviews', 'availability_slots')
ORDER BY table_name;

-- Expected result if migrations ARE applied:
-- You should see 5 rows: availability_slots, cities, guide_profiles, reviews, users

-- Expected result if migrations are NOT applied:
-- You will see 0 rows (empty result)

-- ============================================================================
-- WHAT TO DO BASED ON RESULTS:
-- ============================================================================

-- IF YOU SEE 0 ROWS (tables don't exist):
--   1. Go back to SQL Editor
--   2. Click "New query"
--   3. Open and paste: migrations-consolidated.sql
--   4. Click "Run"
--   5. Then come back and run this verification query again

-- IF YOU SEE 5 ROWS (tables exist):
--   1. You're ready to seed!
--   2. Click "New query"
--   3. Open and paste: seed-comprehensive.sql
--   4. Click "Run"
