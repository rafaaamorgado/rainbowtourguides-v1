/*
  # Add Demo-Friendly Policies for Anonymous Access

  ## Purpose
  This migration adds policies to allow the anon role to perform operations
  needed for the demo/seed functionality. In a production environment, these
  would be removed and replaced with proper authentication-based policies.

  ## Security Note
  These policies are for DEMO purposes only. They allow public inserts/updates
  which should NOT be used in production.
*/

-- Allow anon to insert users (for seeding)
CREATE POLICY "Allow anon to insert users for demo"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert traveler profiles (for seeding)
CREATE POLICY "Allow anon to insert traveler profiles for demo"
  ON traveler_profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert guide profiles (for seeding)
CREATE POLICY "Allow anon to insert guide profiles for demo"
  ON guide_profiles FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert availability (for seeding)
CREATE POLICY "Allow anon to insert availability for demo"
  ON availability FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert reviews (for seeding)
CREATE POLICY "Allow anon to insert reviews for demo"
  ON reviews FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert reservations
CREATE POLICY "Allow anon to insert reservations for demo"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert bookings
CREATE POLICY "Allow anon to insert bookings for demo"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert conversations
CREATE POLICY "Allow anon to insert conversations for demo"
  ON conversations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert messages
CREATE POLICY "Allow anon to insert messages for demo"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to insert reports
CREATE POLICY "Allow anon to insert reports for demo"
  ON reports FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon to delete (for reset functionality)
CREATE POLICY "Allow anon to delete users for demo"
  ON users FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete traveler profiles for demo"
  ON traveler_profiles FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete guide profiles for demo"
  ON guide_profiles FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete availability for demo"
  ON availability FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete reviews for demo"
  ON reviews FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete reservations for demo"
  ON reservations FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete bookings for demo"
  ON bookings FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete conversations for demo"
  ON conversations FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete messages for demo"
  ON messages FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow anon to delete reports for demo"
  ON reports FOR DELETE
  TO anon
  USING (true);

-- Allow anon to update (for application functionality)
CREATE POLICY "Allow anon to update reservations for demo"
  ON reservations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update bookings for demo"
  ON bookings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update conversations for demo"
  ON conversations FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update reviews for demo"
  ON reviews FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update reports for demo"
  ON reports FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update guide profiles for demo"
  ON guide_profiles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update traveler profiles for demo"
  ON traveler_profiles FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to update users for demo"
  ON users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
