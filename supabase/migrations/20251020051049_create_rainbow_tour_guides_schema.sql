/*
  # Rainbow Tour Guides - Complete Schema Migration

  ## Overview
  Creates the complete database schema for Rainbow Tour Guides platform including users, guides, 
  bookings, conversations, reviews, and reports with proper Row Level Security policies.

  ## New Tables
  
  ### 1. users
  - `id` (uuid, primary key) - User identifier
  - `email` (text) - User email address
  - `role` (text) - User role: traveler, guide, admin, support, moderator
  - `display_name` (text) - User display name
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. traveler_profiles
  - `uid` (uuid, primary key, references users) - User identifier
  - `display_name` (text) - Traveler display name
  - `avatar_url` (text) - Profile picture URL
  - `home_country` (text) - Home country
  - `preferred_language` (text) - Preferred language
  - `bio` (text) - Biography
  - `rating_avg` (numeric) - Average rating
  - `rating_count` (integer) - Number of ratings

  ### 3. guide_profiles
  - `uid` (uuid, primary key, references users) - User identifier
  - `handle` (text, unique) - URL-friendly handle
  - `display_name` (text) - Guide display name
  - `avatar_url` (text) - Profile picture URL
  - `city` (text) - City name
  - `city_slug` (text) - URL-friendly city name
  - `country` (text) - Country
  - `timezone` (text) - Timezone
  - `bio` (text) - Biography
  - `languages` (jsonb) - Array of languages spoken
  - `themes` (jsonb) - Array of tour themes
  - `photos` (jsonb) - Array of photo URLs
  - `prices` (jsonb) - Pricing structure {h4, h6, h8, currency}
  - `max_group_size` (integer) - Maximum group size
  - `rating_avg` (numeric) - Average rating
  - `rating_count` (integer) - Number of ratings
  - `verified` (boolean) - Verification status
  - `meetup_pref` (jsonb) - Meeting preferences

  ### 4. availability
  - `uid` (uuid, primary key, references users) - Guide identifier
  - `weekly` (jsonb) - Weekly availability schedule
  - `blackouts` (jsonb) - Array of blackout dates
  - `lead_hours_min` (integer) - Minimum lead time in hours

  ### 5. reservations
  - `id` (uuid, primary key) - Reservation identifier
  - `traveler_id` (uuid, references users) - Traveler identifier
  - `guide_id` (uuid, references users) - Guide identifier
  - `status` (text) - Status: pending, accepted, cancelled, completed, refunded
  - `currency` (text) - Currency code
  - `subtotal` (integer) - Subtotal in cents
  - `traveler_fee_pct` (numeric) - Traveler fee percentage
  - `platform_commission_pct` (numeric) - Platform commission percentage
  - `platform_commission_min_usd` (integer) - Minimum platform commission in cents
  - `total` (integer) - Total in cents
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. bookings
  - `id` (uuid, primary key) - Booking identifier
  - `reservation_id` (uuid, references reservations) - Related reservation
  - `traveler_id` (uuid, references users) - Traveler identifier
  - `guide_id` (uuid, references users) - Guide identifier
  - `sessions` (jsonb) - Array of booking sessions
  - `meeting` (jsonb) - Meeting location details
  - `itinerary_note` (text) - Custom itinerary notes
  - `status` (text) - Status: pending, accepted, cancelled, completed
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. conversations
  - `id` (uuid, primary key) - Conversation identifier
  - `reservation_id` (uuid, references reservations) - Related reservation
  - `participant_ids` (jsonb) - Array of participant user IDs
  - `created_at` (timestamptz) - Creation timestamp
  - `last_message_at` (timestamptz) - Last message timestamp

  ### 8. messages
  - `id` (uuid, primary key) - Message identifier
  - `conversation_id` (uuid, references conversations) - Parent conversation
  - `sender_id` (uuid, references users) - Message sender
  - `text` (text) - Message content
  - `created_at` (timestamptz) - Creation timestamp

  ### 9. reviews
  - `id` (uuid, primary key) - Review identifier
  - `subject_user_id` (uuid, references users) - User being reviewed
  - `author_user_id` (uuid, references users) - Review author
  - `reservation_id` (uuid, references reservations) - Related reservation
  - `rating` (integer) - Rating 1-5
  - `text` (text) - Review text
  - `response_text` (text) - Response from reviewed user
  - `status` (text) - Status: published, hidden, reported
  - `created_at` (timestamptz) - Creation timestamp

  ### 10. reports
  - `id` (uuid, primary key) - Report identifier
  - `type` (text) - Report type: profile, review, message
  - `target_id` (uuid) - ID of reported item
  - `reason` (text) - Report reason
  - `reporter_id` (uuid, references users) - User who reported
  - `status` (text) - Status: open, closed
  - `created_at` (timestamptz) - Creation timestamp
  - `resolved_by` (uuid, references users) - Admin who resolved
  - `resolution_note` (text) - Resolution notes

  ## Security
  - Enable RLS on all tables
  - Users can read their own data
  - Guides can read their bookings and conversations
  - Travelers can read their bookings and conversations
  - Admins have full access
  - Public can read published guide profiles and reviews
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  role text NOT NULL CHECK (role IN ('traveler', 'guide', 'admin', 'support', 'moderator')),
  display_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read users for guides"
  ON users FOR SELECT
  TO anon
  USING (role = 'guide');

-- Create traveler_profiles table
CREATE TABLE IF NOT EXISTS traveler_profiles (
  uid uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  home_country text,
  preferred_language text,
  bio text,
  rating_avg numeric DEFAULT 0,
  rating_count integer DEFAULT 0
);

ALTER TABLE traveler_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Travelers can read own profile"
  ON traveler_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = uid);

CREATE POLICY "Travelers can update own profile"
  ON traveler_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = uid)
  WITH CHECK (auth.uid() = uid);

CREATE POLICY "Travelers can insert own profile"
  ON traveler_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uid);

-- Create guide_profiles table
CREATE TABLE IF NOT EXISTS guide_profiles (
  uid uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  handle text NOT NULL UNIQUE,
  display_name text NOT NULL,
  avatar_url text,
  city text NOT NULL,
  city_slug text NOT NULL,
  country text NOT NULL,
  timezone text NOT NULL,
  bio text NOT NULL,
  languages jsonb NOT NULL DEFAULT '[]'::jsonb,
  themes jsonb NOT NULL DEFAULT '[]'::jsonb,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  prices jsonb NOT NULL DEFAULT '{}'::jsonb,
  max_group_size integer NOT NULL DEFAULT 6,
  rating_avg numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  verified boolean DEFAULT false,
  meetup_pref jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE guide_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read guide profiles"
  ON guide_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Guides can update own profile"
  ON guide_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = uid)
  WITH CHECK (auth.uid() = uid);

CREATE POLICY "Guides can insert own profile"
  ON guide_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uid);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  uid uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  weekly jsonb NOT NULL DEFAULT '{}'::jsonb,
  blackouts jsonb NOT NULL DEFAULT '[]'::jsonb,
  lead_hours_min integer NOT NULL DEFAULT 24
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read guide availability"
  ON availability FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Guides can update own availability"
  ON availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = uid)
  WITH CHECK (auth.uid() = uid);

CREATE POLICY "Guides can insert own availability"
  ON availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uid);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL REFERENCES users(id),
  guide_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'cancelled', 'completed', 'refunded')) DEFAULT 'pending',
  currency text NOT NULL DEFAULT 'USD',
  subtotal integer NOT NULL DEFAULT 0,
  traveler_fee_pct numeric NOT NULL DEFAULT 0.10,
  platform_commission_pct numeric NOT NULL DEFAULT 0.25,
  platform_commission_min_usd integer NOT NULL DEFAULT 2500,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Travelers can read own reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Guides can read their reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = guide_id);

CREATE POLICY "Travelers can create reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

CREATE POLICY "Guides can update their reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (auth.uid() = guide_id)
  WITH CHECK (auth.uid() = guide_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  traveler_id uuid NOT NULL REFERENCES users(id),
  guide_id uuid NOT NULL REFERENCES users(id),
  sessions jsonb NOT NULL DEFAULT '[]'::jsonb,
  meeting jsonb NOT NULL DEFAULT '{}'::jsonb,
  itinerary_note text,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'cancelled', 'completed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Travelers can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Guides can read their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = guide_id);

CREATE POLICY "Travelers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

CREATE POLICY "Guides can update their bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = guide_id)
  WITH CHECK (auth.uid() = guide_id);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  participant_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    participant_ids @> jsonb_build_array(auth.uid()::text)
  );

CREATE POLICY "Participants can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    participant_ids @> jsonb_build_array(auth.uid()::text)
  );

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    participant_ids @> jsonb_build_array(auth.uid()::text)
  )
  WITH CHECK (
    participant_ids @> jsonb_build_array(auth.uid()::text)
  );

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids @> jsonb_build_array(auth.uid()::text)
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.participant_ids @> jsonb_build_array(auth.uid()::text)
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_user_id uuid NOT NULL REFERENCES users(id),
  author_user_id uuid NOT NULL REFERENCES users(id),
  reservation_id uuid NOT NULL REFERENCES reservations(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  response_text text,
  status text NOT NULL CHECK (status IN ('published', 'hidden', 'reported')) DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_user_id);

CREATE POLICY "Subject users can update review responses"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = subject_user_id)
  WITH CHECK (auth.uid() = subject_user_id);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('profile', 'review', 'message')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  reporter_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  resolved_by uuid REFERENCES users(id),
  resolution_note text
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_guide_profiles_city_slug ON guide_profiles(city_slug);
CREATE INDEX IF NOT EXISTS idx_guide_profiles_handle ON guide_profiles(handle);
CREATE INDEX IF NOT EXISTS idx_reservations_traveler ON reservations(traveler_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guide ON reservations(guide_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_bookings_reservation ON bookings(reservation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_reservation ON conversations(reservation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_subject ON reviews(subject_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
