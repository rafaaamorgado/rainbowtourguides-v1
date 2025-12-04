/*
  # Add Cities and Availability Slots Tables (PRD Alignment)

  Creates core tables needed for slot-based booking system:
  - cities: Location-based guide discovery
  - availability_slots: Individual bookable time blocks
  
  Updates existing tables:
  - bookings: Add payment and slot tracking
  - guide_profiles: Add city reference and hourly rate
*/

-- Enum for slot status
DO $$ BEGIN
  CREATE TYPE slot_status AS ENUM ('open', 'pending', 'booked', 'closed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- CITIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code text NOT NULL,
  slug text UNIQUE NOT NULL,
  lat double precision,
  lng double precision,
  timezone text NOT NULL DEFAULT 'UTC',
  created_at timestamptz DEFAULT now()
);

-- Seed cities
INSERT INTO cities (name, country_code, slug, timezone, lat, lng) VALUES
  ('Barcelona', 'ES', 'barcelona', 'Europe/Madrid', 41.3851, 2.1734),
  ('Paris', 'FR', 'paris', 'Europe/Paris', 48.8566, 2.3522),
  ('Lisbon', 'PT', 'lisbon', 'Europe/Lisbon', 38.7223, -9.1393),
  ('Ho Chi Minh City', 'VN', 'saigon', 'Asia/Ho_Chi_Minh', 10.8231, 106.6297),
  ('Bangkok', 'TH', 'bangkok', 'Asia/Bangkok', 13.7563, 100.5018),
  ('Amsterdam', 'NL', 'amsterdam', 'Europe/Amsterdam', 52.3676, 4.9041),
  ('Berlin', 'DE', 'berlin', 'Europe/Berlin', 52.5200, 13.4050),
  ('Prague', 'CZ', 'prague', 'Europe/Prague', 50.0755, 14.4378),
  ('Mexico City', 'MX', 'mexico-city', 'America/Mexico_City', 19.4326, -99.1332),
  ('Buenos Aires', 'AR', 'buenos-aires', 'America/Argentina/Buenos_Aires', -34.6037, -58.3816)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cities" ON cities FOR SELECT USING (true);

CREATE POLICY "Admins can manage cities" ON cities FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- ============================================================================
-- AVAILABILITY_SLOTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  duration_hours integer NOT NULL CHECK (duration_hours IN (4, 6, 8)),
  status slot_status NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_slots_guide_id ON availability_slots(guide_id);
CREATE INDEX IF NOT EXISTS idx_slots_start_time ON availability_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_slots_status ON availability_slots(status);
CREATE INDEX IF NOT EXISTS idx_slots_composite ON availability_slots(guide_id, start_time, status);

-- RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read open slots" ON availability_slots FOR SELECT
  USING (status = 'open');

CREATE POLICY "Guides can read own slots" ON availability_slots FOR SELECT TO authenticated
  USING (guide_id = auth.uid());

CREATE POLICY "Guides can create own slots" ON availability_slots FOR INSERT TO authenticated
  WITH CHECK (guide_id = auth.uid());

CREATE POLICY "Guides can update own slots" ON availability_slots FOR UPDATE TO authenticated
  USING (guide_id = auth.uid()) WITH CHECK (guide_id = auth.uid());

CREATE POLICY "Guides can delete own slots" ON availability_slots FOR DELETE TO authenticated
  USING (guide_id = auth.uid());

CREATE POLICY "Admins can manage all slots" ON availability_slots FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'support')));

-- ============================================================================
-- UPDATE EXISTING TABLES
-- ============================================================================

-- Update bookings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'slot_id') THEN
    ALTER TABLE bookings ADD COLUMN slot_id uuid REFERENCES availability_slots(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_provider') THEN
    ALTER TABLE bookings ADD COLUMN payment_provider text CHECK (payment_provider IN ('stripe', 'paypal', 'momo', 'zalopay', 'payos'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_ref') THEN
    ALTER TABLE bookings ADD COLUMN payment_ref text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price_total') THEN
    ALTER TABLE bookings ADD COLUMN price_total numeric(10,2);
  END IF;
END $$;

-- Update guide_profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'city_id') THEN
    ALTER TABLE guide_profiles ADD COLUMN city_id uuid REFERENCES cities(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'base_rate_hour') THEN
    ALTER TABLE guide_profiles ADD COLUMN base_rate_hour numeric(10,2) NOT NULL DEFAULT 25.00;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_guide_profiles_city_id ON guide_profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);

-- Helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_availability_slots_updated_at ON availability_slots;
CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
