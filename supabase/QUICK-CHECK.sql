-- ============================================================================
-- QUICK VERIFICATION: Check table counts
-- ============================================================================
-- Run this to see if your database has been seeded successfully

SELECT 
  (SELECT COUNT(*) FROM cities) as cities,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM guide_profiles) as guides,
  (SELECT COUNT(*) FROM reviews) as reviews,
  (SELECT COUNT(*) FROM availability_slots) as slots;

-- ============================================================================
-- EXPECTED RESULTS (after successful seeding):
-- ============================================================================
-- cities: 5
-- users: 14 (10 guides + 4 travelers)
-- guides: 10
-- reviews: 8
-- slots: 20

-- ============================================================================
-- IF ALL COUNTS ARE 0:
-- ============================================================================
-- Your database is empty. Follow SETUP-SIMPLIFIED.md to seed it.

-- ============================================================================
-- IF COUNTS MATCH EXPECTED:
-- ============================================================================
-- Success! Your database is seeded. Test your app:
-- 1. curl http://localhost:5001/api/health/db
-- 2. Visit http://localhost:5001/guides
