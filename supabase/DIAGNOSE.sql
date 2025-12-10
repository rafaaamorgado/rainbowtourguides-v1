-- ============================================================================
-- DIAGNOSTIC SCRIPT: Run this to see your exact database state
-- ============================================================================
-- Copy and paste this entire script into Supabase SQL Editor and click "Run"

-- 1. List all tables
SELECT '--- TABLES ---' as section;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Show columns in key tables (to check naming convention)
SELECT '--- USERS COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

SELECT '--- CITIES COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cities'
ORDER BY ordinal_position;

SELECT '--- GUIDE_PROFILES COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'guide_profiles'
ORDER BY ordinal_position;

SELECT '--- AVAILABILITY_SLOTS COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'availability_slots'
ORDER BY ordinal_position;

SELECT '--- REVIEWS COLUMNS ---' as section;  
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reviews'
ORDER BY ordinal_position;

SELECT '--- RESERVATIONS COLUMNS ---' as section;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'reservations'
ORDER BY ordinal_position;

-- 3. Count existing data
SELECT '--- DATA COUNTS ---' as section;
SELECT 
  (SELECT COUNT(*) FROM cities) as cities,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM guide_profiles) as guides;

-- ============================================================================
-- INSTRUCTIONS:
-- ============================================================================
-- After running this, share the output with me and I'll create the correct 
-- seed script that matches YOUR EXACT column names.
-- 
-- Key things I need to see:
-- 1. What tables exist
-- 2. Are columns named snake_case (display_name) or camelCase ("displayName")?
-- 3. What columns exist in guide_profiles?
-- 4. Does availability_slots table exist?
