/*
  Rainbow Tour Guides - Seed Data
  
  This script seeds the database with realistic demo data.
  
  NOTE ON AUTH:
  This script inserts into `public.users` and related tables.
  In a real Supabase project, `auth.users` is managed by GoTrue.
  - For LOCAL development (`supabase start`), this seed usually runs with superuser privileges and can insert into strictly protected tables if configured, 
    but effectively we are seeding the SITE CONTENT (Profiles, Cities, Slots).
  - The `id`s used here are deterministic UUIDs to allow relationships to work.
  - If you need to log in as these users, you must create Auth users with these specific UUIDs 
    or just use the data for "Anonymous/Public" view testing.

  NOTE ON TOURS:
  The current schema does not have a dedicated `tours` table. 
  "Tours" are modeled as "Guides" offering "Availability Slots".
  Each Guide Profile functionally represents a unique "Tour Experience" (e.g. "Berlin Nightlife" is the Guide).
*/

-- ============================================================================
-- 1. CITIES (Queer-friendly destinations)
-- ============================================================================
INSERT INTO cities (name, country_code, slug, timezone, lat, lng) VALUES
  ('Rio de Janeiro', 'BR', 'rio-de-janeiro', 'America/Sao_Paulo', -22.9068, -43.1729),
  ('Berlin', 'DE', 'berlin', 'Europe/Berlin', 52.5200, 13.4050),
  ('San Francisco', 'US', 'san-francisco', 'America/Los_Angeles', 37.7749, -122.4194),
  ('Bangkok', 'TH', 'bangkok', 'Asia/Bangkok', 13.7563, 100.5018),
  ('Barcelona', 'ES', 'barcelona', 'Europe/Madrid', 41.3851, 2.1734),
  ('Cape Town', 'ZA', 'cape-town', 'Africa/Johannesburg', -33.9249, 18.4241)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. USERS & PROFILES (Guides)
-- ============================================================================
-- Helper UUIDs for deterministic seeding
-- Guide 1: Rio (Nightlife)
-- Guide 2: Berlin (History)
-- Guide 3: SF (Food)
-- Guide 4: Bangkok (Culture)
-- Guide 5: Barcelona (Art)

DO $$
DECLARE
  v_rio_id uuid := (SELECT id FROM cities WHERE slug = 'rio-de-janeiro');
  v_berlin_id uuid := (SELECT id FROM cities WHERE slug = 'berlin');
  v_sf_id uuid := (SELECT id FROM cities WHERE slug = 'san-francisco');
  v_bkk_id uuid := (SELECT id FROM cities WHERE slug = 'bangkok');
  v_bcn_id uuid := (SELECT id FROM cities WHERE slug = 'barcelona');
  
  -- Guide UUIDs
  v_g1_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  v_g2_id uuid := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
  v_g3_id uuid := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
  v_g4_id uuid := 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';
  v_g5_id uuid := 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15';
  
  -- Traveler UUIDs
  v_t1_id uuid := 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16';
  v_t2_id uuid := '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17';

BEGIN

  -- Insert Users
  INSERT INTO users (id, email, role, display_name) VALUES
    (v_g1_id, 'lucas.rio@example.com', 'guide', 'Lucas Silva'),
    (v_g2_id, 'hannah.berlin@example.com', 'guide', 'Hannah Muller'),
    (v_g3_id, 'alex.sf@example.com', 'guide', 'Alex Chen'),
    (v_g4_id, 'chai.bkk@example.com', 'guide', 'Chaiwat S.'),
    (v_g5_id, 'sofia.bcn@example.com', 'guide', 'Sofia Garcia'),
    (v_t1_id, 'traveler1@example.com', 'traveler', 'Jordan Smith'),
    (v_t2_id, 'traveler2@example.com', 'traveler', 'Casey Jones')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Guide Profiles
  INSERT INTO guide_profiles (
    uid, handle, display_name, city_id, city, city_slug, country, timezone, bio, tagline,
    languages, themes, photos, prices, verified, account_status
  ) VALUES
    (
      v_g1_id, 'lucas-rio-nightlife', 'Lucas Silva', v_rio_id, 'Rio de Janeiro', 'rio-de-janeiro', 'Brazil', 'America/Sao_Paulo',
      'Experience the vibrant LGBTQ+ nightlife of Rio with a local! I create safe, fun, and authentic nights out in Ipanema and Copacabana.',
      'Your Local Rio Nightlife Companion',
      '["English", "Portuguese", "Spanish"]'::jsonb,
      '["Nightlife", "Culture", "Safety"]'::jsonb,
      '["https://images.unsplash.com/photo-1596486060132-723f46f34531?auto=format&fit=crop&q=80"]'::jsonb,
      '{"h4": 150}'::jsonb,
      true, 'active'
    ),
    (
      v_g2_id, 'hannah-berlin-history', 'Hannah Muller', v_berlin_id, 'Berlin', 'berlin', 'Germany', 'Europe/Berlin',
      'Historian and queer activist. Join me to explore the rich and complex LGBTQ+ history of Berlin, from the 1920s to today.',
      'Queer History of Berlin Uncovered',
      '["English", "German"]'::jsonb,
      '["History", "Activism", "Walking Tour"]'::jsonb,
      '["https://images.unsplash.com/photo-1560969184-10fe8719e654?auto=format&fit=crop&q=80"]'::jsonb,
      '{"h4": 120}'::jsonb,
      true, 'active'
    ),
    (
      v_g3_id, 'alex-sf-foodie', 'Alex Chen', v_sf_id, 'San Francisco', 'san-francisco', 'USA', 'America/Los_Angeles',
      'Foodie tour through the Castro and Mission. We eat, we drink, we talk about the history of the neighborhood.',
      'Castro Culinary & History Walk',
      '["English", "Mandarin"]'::jsonb,
      '["Food", "History", "Walking Tour"]'::jsonb,
      '["https://images.unsplash.com/photo-1549646440-f1c572c80332?auto=format&fit=crop&q=80"]'::jsonb,
      '{"h4": 180}'::jsonb,
      true, 'active'
    ),
    (
      v_g4_id, 'chai-bkk-night', 'Chaiwat S.', v_bkk_id, 'Bangkok', 'bangkok', 'Thailand', 'Asia/Bangkok',
      'Discover Silom Soi 2 and the best drag shows in town. I know where the best parties are!',
      'Bangkok After Dark',
      '["English", "Thai"]'::jsonb,
      '["Nightlife", "Drag", "Party"]'::jsonb,
      '["https://images.unsplash.com/photo-1552596843-c4dc8d32095f?auto=format&fit=crop&q=80"]'::jsonb,
      '{"h4": 100}'::jsonb,
      true, 'active'
    ),
    (
      v_g5_id, 'sofia-bcn-art', 'Sofia Garcia', v_bcn_id, 'Barcelona', 'barcelona', 'Spain', 'Europe/Madrid',
      'Artistic soul showing you the Gaudi architecture through a queer lens. We end with tapas!',
      'Gaudi & Tapas with Sofia',
      '["English", "Spanish", "Catalan"]'::jsonb,
      '["Art", "Architecture", "Food"]'::jsonb,
      '["https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80"]'::jsonb,
      '{"h4": 140}'::jsonb,
      true, 'active'
    )
  ON CONFLICT (uid) DO NOTHING;

  -- Insert Traveler Profiles
  INSERT INTO traveler_profiles (uid, display_name, home_country, preferred_language) VALUES
    (v_t1_id, 'Jordan Smith', 'Canada', 'English'),
    (v_t2_id, 'Casey Jones', 'UK', 'English')
  ON CONFLICT (uid) DO NOTHING;


  -- ============================================================================
  -- 3. AVAILABILITY SLOTS (Future & Past)
  -- ============================================================================
  
  INSERT INTO availability_slots (id, guide_id, start_time, duration_hours, status) VALUES
    -- Guide 1 (Rio) - Future
    (gen_random_uuid(), v_g1_id, NOW() + INTERVAL '2 days' + INTERVAL '20 hours', 4, 'open'),
    (gen_random_uuid(), v_g1_id, NOW() + INTERVAL '5 days' + INTERVAL '20 hours', 4, 'open'),
    
    -- Guide 2 (Berlin) - Future
    (gen_random_uuid(), v_g2_id, NOW() + INTERVAL '3 days' + INTERVAL '10 hours', 4, 'open'),
    
    -- Guide 3 (SF) - Past (Completed)
    ('11111111-1111-1111-1111-111111111111', v_g3_id, NOW() - INTERVAL '10 days' + INTERVAL '12 hours', 4, 'booked'),
    
    -- Guide 5 (Barcelona) - Past (Completed)
    ('22222222-2222-2222-2222-222222222222', v_g5_id, NOW() - INTERVAL '5 days' + INTERVAL '16 hours', 4, 'booked')
  ON CONFLICT DO NOTHING;


  -- ============================================================================
  -- 4. RESERVATIONS & BOOKINGS
  -- ============================================================================
  
  -- Booking 1: Past SF Tour (Completed)
  INSERT INTO reservations (id, traveler_id, guide_id, status, total, currency) VALUES
    ('33333333-3333-3333-3333-333333333333', v_t1_id, v_g3_id, 'completed', 18000, 'USD')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO bookings (reservation_id, traveler_id, guide_id, status, slot_id, tour_status) VALUES
    ('33333333-3333-3333-3333-333333333333', v_t1_id, v_g3_id, 'completed', '11111111-1111-1111-1111-111111111111', 'completed')
  ON CONFLICT DO NOTHING;

  -- Booking 2: Past Barcelona Tour (Completed)
  INSERT INTO reservations (id, traveler_id, guide_id, status, total, currency) VALUES
    ('44444444-4444-4444-4444-444444444444', v_t2_id, v_g5_id, 'completed', 14000, 'USD')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO bookings (reservation_id, traveler_id, guide_id, status, slot_id, tour_status) VALUES
    ('44444444-4444-4444-4444-444444444444', v_t2_id, v_g5_id, 'completed', '22222222-2222-2222-2222-222222222222', 'completed')
  ON CONFLICT DO NOTHING;


  -- ============================================================================
  -- 5. REVIEWS
  -- ============================================================================
  
  INSERT INTO reviews (subject_user_id, author_user_id, reservation_id, rating, text, status) VALUES
    (v_g3_id, v_t1_id, '33333333-3333-3333-3333-333333333333', 5, 'Alex was amazing! The food was incredible and I learned so much about the neighborhood.', 'published'),
    (v_g5_id, v_t2_id, '44444444-4444-4444-4444-444444444444', 5, 'Sofia is so knowledgeable. Highly recommended!', 'published')
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- 6. MARKETING (Banners & Blog)
-- ============================================================================

INSERT INTO announcement_banners (message, link, cta_text, banner_type, is_active, priority) VALUES 
  ('🏳️‍🌈 Pride Month 2025 is coming! Book your guides early.', '/guides', 'Find Guides', 'promo', true, 100)
ON CONFLICT DO NOTHING;

INSERT INTO blog_categories (slug, name) VALUES ('travel-tips', 'Travel Tips') ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_posts (slug, title, body, status, category_id, author_id) 
SELECT 
  'safe-travel-tips-2025', 
  'Safe Travel Tips for LGBTQ+ Travelers in 2025', 
  'Here are the top tips for staying safe while exploring the world...', 
  'published',
  (SELECT id FROM blog_categories WHERE slug = 'travel-tips'),
  (SELECT id FROM users WHERE role = 'guide' LIMIT 1)
ON CONFLICT (slug, locale) DO NOTHING;
