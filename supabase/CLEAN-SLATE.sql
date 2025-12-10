-- ============================================================================
-- CLEAN SLATE: Delete all existing data
-- ============================================================================
-- Run this if you want to start fresh before seeding
-- This is SAFE - it only deletes data, not the table structure

-- Delete in correct order (respects foreign keys)
DELETE FROM reviews;
DELETE FROM availability_slots;
DELETE FROM reservations;
DELETE FROM bookings;
DELETE FROM guide_profiles;
DELETE FROM traveler_profiles;
DELETE FROM users;
DELETE FROM cities;

-- ============================================================================
-- RESULT:
-- ============================================================================
-- You should see "Success. X rows affected" for each DELETE
-- If you see "0 rows affected" for all, the database was already empty

-- ============================================================================
-- NEXT STEP:
-- ============================================================================
-- Now run seed-comprehensive.sql to populate with fresh data
