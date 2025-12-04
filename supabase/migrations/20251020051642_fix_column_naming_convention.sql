/*
  # Fix Column Naming to Match Application Schema

  ## Changes
  - Rename all snake_case columns to match the application's camelCase expectations
  - This migration ensures compatibility with the existing TypeScript interfaces

  ## Columns Renamed
  - All `_id`, `_url`, `_at`, `_pct`, `_min`, `_usd` suffixed columns
*/

DO $$
BEGIN
  -- users table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'display_name') THEN
    ALTER TABLE users RENAME COLUMN display_name TO "displayName";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
    ALTER TABLE users RENAME COLUMN avatar_url TO "avatarUrl";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
    ALTER TABLE users RENAME COLUMN created_at TO "createdAt";
  END IF;

  -- traveler_profiles table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'display_name') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN display_name TO "displayName";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN avatar_url TO "avatarUrl";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'home_country') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN home_country TO "homeCountry";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'preferred_language') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN preferred_language TO "preferredLanguage";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'rating_avg') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN rating_avg TO "ratingAvg";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'traveler_profiles' AND column_name = 'rating_count') THEN
    ALTER TABLE traveler_profiles RENAME COLUMN rating_count TO "ratingCount";
  END IF;

  -- guide_profiles table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'display_name') THEN
    ALTER TABLE guide_profiles RENAME COLUMN display_name TO "displayName";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE guide_profiles RENAME COLUMN avatar_url TO "avatarUrl";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'city_slug') THEN
    ALTER TABLE guide_profiles RENAME COLUMN city_slug TO "citySlug";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'max_group_size') THEN
    ALTER TABLE guide_profiles RENAME COLUMN max_group_size TO "maxGroupSize";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'rating_avg') THEN
    ALTER TABLE guide_profiles RENAME COLUMN rating_avg TO "ratingAvg";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'rating_count') THEN
    ALTER TABLE guide_profiles RENAME COLUMN rating_count TO "ratingCount";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'guide_profiles' AND column_name = 'meetup_pref') THEN
    ALTER TABLE guide_profiles RENAME COLUMN meetup_pref TO "meetupPref";
  END IF;

  -- availability table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'availability' AND column_name = 'lead_hours_min') THEN
    ALTER TABLE availability RENAME COLUMN lead_hours_min TO "leadHoursMin";
  END IF;

  -- reservations table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'traveler_id') THEN
    ALTER TABLE reservations RENAME COLUMN traveler_id TO "travelerId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'guide_id') THEN
    ALTER TABLE reservations RENAME COLUMN guide_id TO "guideId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'traveler_fee_pct') THEN
    ALTER TABLE reservations RENAME COLUMN traveler_fee_pct TO "travelerFeePct";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'platform_commission_pct') THEN
    ALTER TABLE reservations RENAME COLUMN platform_commission_pct TO "platformCommissionPct";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'platform_commission_min_usd') THEN
    ALTER TABLE reservations RENAME COLUMN platform_commission_min_usd TO "platformCommissionMinUsd";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'created_at') THEN
    ALTER TABLE reservations RENAME COLUMN created_at TO "createdAt";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'updated_at') THEN
    ALTER TABLE reservations RENAME COLUMN updated_at TO "updatedAt";
  END IF;

  -- bookings table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'reservation_id') THEN
    ALTER TABLE bookings RENAME COLUMN reservation_id TO "reservationId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'traveler_id') THEN
    ALTER TABLE bookings RENAME COLUMN traveler_id TO "travelerId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'guide_id') THEN
    ALTER TABLE bookings RENAME COLUMN guide_id TO "guideId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'itinerary_note') THEN
    ALTER TABLE bookings RENAME COLUMN itinerary_note TO "itineraryNote";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'created_at') THEN
    ALTER TABLE bookings RENAME COLUMN created_at TO "createdAt";
  END IF;

  -- conversations table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'reservation_id') THEN
    ALTER TABLE conversations RENAME COLUMN reservation_id TO "reservationId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'participant_ids') THEN
    ALTER TABLE conversations RENAME COLUMN participant_ids TO "participantIds";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'created_at') THEN
    ALTER TABLE conversations RENAME COLUMN created_at TO "createdAt";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversations' AND column_name = 'last_message_at') THEN
    ALTER TABLE conversations RENAME COLUMN last_message_at TO "lastMessageAt";
  END IF;

  -- messages table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'conversation_id') THEN
    ALTER TABLE messages RENAME COLUMN conversation_id TO "conversationId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender_id') THEN
    ALTER TABLE messages RENAME COLUMN sender_id TO "senderId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'created_at') THEN
    ALTER TABLE messages RENAME COLUMN created_at TO "createdAt";
  END IF;

  -- reviews table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'subject_user_id') THEN
    ALTER TABLE reviews RENAME COLUMN subject_user_id TO "subjectUserId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'author_user_id') THEN
    ALTER TABLE reviews RENAME COLUMN author_user_id TO "authorUserId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'reservation_id') THEN
    ALTER TABLE reviews RENAME COLUMN reservation_id TO "reservationId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'response_text') THEN
    ALTER TABLE reviews RENAME COLUMN response_text TO "responseText";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'created_at') THEN
    ALTER TABLE reviews RENAME COLUMN created_at TO "createdAt";
  END IF;

  -- reports table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'target_id') THEN
    ALTER TABLE reports RENAME COLUMN target_id TO "targetId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'reporter_id') THEN
    ALTER TABLE reports RENAME COLUMN reporter_id TO "reporterId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'created_at') THEN
    ALTER TABLE reports RENAME COLUMN created_at TO "createdAt";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'resolved_by') THEN
    ALTER TABLE reports RENAME COLUMN resolved_by TO "resolvedBy";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'resolution_note') THEN
    ALTER TABLE reports RENAME COLUMN resolution_note TO "resolutionNote";
  END IF;
END $$;
