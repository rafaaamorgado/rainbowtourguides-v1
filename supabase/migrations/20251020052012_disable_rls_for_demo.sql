/*
  # Disable RLS for Demo Mode

  ## Purpose
  This migration temporarily disables Row Level Security on all tables
  to allow the demo application to function without authentication.

  ## Security Warning
  This is ONLY for demo/development purposes. In production, RLS should
  be enabled with proper policies based on authenticated users.
*/

-- Disable RLS on all tables for demo mode
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE traveler_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE guide_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
