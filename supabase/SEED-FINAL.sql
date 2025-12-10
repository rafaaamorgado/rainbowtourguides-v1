/*
  Rainbow Tour Guides - CORRECTED Seed Data
  
  This script uses the CORRECT camelCase column names that match the database schema.
  
  Run this in Supabase SQL Editor after the migrations have been applied.
*/

-- ============================================================================
-- 1. CITIES
-- ============================================================================
INSERT INTO cities (name, country_code, slug, timezone, lat, lng) VALUES
  ('Lisbon', 'PT', 'lisbon', 'Europe/Lisbon', 38.7223, -9.1393),
  ('Mexico City', 'MX', 'mexico-city', 'America/Mexico_City', 19.4326, -99.1332),
  ('Berlin', 'DE', 'berlin', 'Europe/Berlin', 52.5200, 13.4050),
  ('São Paulo', 'BR', 'sao-paulo', 'America/Sao_Paulo', -23.5505, -46.6333),
  ('Bangkok', 'TH', 'bangkok', 'Asia/Bangkok', 13.7563, 100.5018)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. USERS (using camelCase column names)
-- ============================================================================
INSERT INTO users (id, email, role, "displayName", "avatarUrl", verified) VALUES
  -- Guides
  ('a1111111-1111-1111-1111-111111111111', 'miguel@example.com', 'guide', 'Miguel Santos', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', true),
  ('a2222222-2222-2222-2222-222222222222', 'ana@example.com', 'guide', 'Ana Costa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', true),
  ('a3333333-3333-3333-3333-333333333333', 'carlos@example.com', 'guide', 'Carlos Rivera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', true),
  ('a4444444-4444-4444-4444-444444444444', 'sofia@example.com', 'guide', 'Sofía Hernández', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', true),
  ('a5555555-5555-5555-5555-555555555555', 'hannah@example.com', 'guide', 'Hannah Müller', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', true),
  ('a6666666-6666-6666-6666-666666666666', 'max@example.com', 'guide', 'Max Schmidt', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', true),
  ('a7777777-7777-7777-7777-777777777777', 'lucas@example.com', 'guide', 'Lucas Silva', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', true),
  ('a8888888-8888-8888-8888-888888888888', 'marina@example.com', 'guide', 'Marina Oliveira', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', true),
  ('a9999999-9999-9999-9999-999999999999', 'chai@example.com', 'guide', 'Chaiwat S.', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ploy@example.com', 'guide', 'Ploy Tanaka', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', true),
  -- Travelers
  ('b1111111-1111-1111-1111-111111111111', 'jordan@example.com', 'traveler', 'Jordan Smith', 'https://i.pravatar.cc/150?img=1', true),
  ('b2222222-2222-2222-2222-222222222222', 'casey@example.com', 'traveler', 'Casey Jones', 'https://i.pravatar.cc/150?img=2', true),
  ('b3333333-3333-3333-3333-333333333333', 'alex@example.com', 'traveler', 'Alex Chen', 'https://i.pravatar.cc/150?img=3', true),
  ('b4444444-4444-4444-4444-444444444444', 'sam@example.com', 'traveler', 'Sam Taylor', 'https://i.pravatar.cc/150?img=4', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. GUIDE PROFILES (using camelCase column names)
-- ============================================================================
INSERT INTO guide_profiles (
  uid, handle, "displayName", "avatarUrl", city, "citySlug", country, timezone,
  bio, tagline, languages, themes, photos, prices, "maxGroupSize",
  "ratingAvg", "ratingCount", verified
) VALUES
  -- Lisbon Guide 1
  (
    'a1111111-1111-1111-1111-111111111111', 'miguel-lisbon', 'Miguel Santos',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'Lisbon', 'lisbon', 'Portugal', 'Europe/Lisbon',
    'Born and raised in Lisbon. Let me show you the best queer bars and hidden gems in Bairro Alto!',
    'Your Guide to Lisbon Nightlife',
    '["English", "Portuguese", "Spanish"]'::jsonb,
    '["Nightlife", "LGBTQ+ Culture", "Drag Shows"]'::jsonb,
    '["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800"]'::jsonb,
    '{"h4": 140, "h6": 200, "h8": 250, "currency": "EUR"}'::jsonb,
    6, 4.9, 23, true
  ),
  -- Lisbon Guide 2
  (
    'a2222222-2222-2222-2222-222222222222', 'ana-lisbon', 'Ana Costa',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    'Lisbon', 'lisbon', 'Portugal', 'Europe/Lisbon',
    'Art historian and LGBTQ+ activist. Walking tours through historic neighborhoods.',
    'Queer History & Art in Lisbon',
    '["English", "Portuguese", "French"]'::jsonb,
    '["History", "Art", "Activism"]'::jsonb,
    '["https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800"]'::jsonb,
    '{"h4": 120, "h6": 170, "h8": 220, "currency": "EUR"}'::jsonb,
    8, 5.0, 18, true
  ),
  -- Mexico City Guide 1
  (
    'a3333333-3333-3333-3333-333333333333', 'carlos-cdmx', 'Carlos Rivera',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'Mexico City', 'mexico-city', 'Mexico', 'America/Mexico_City',
    'Foodie guide specializing in LGBTQ+ neighborhoods. Tacos, mezcal, and culture!',
    'Tacos & Queer Culture',
    '["English", "Spanish"]'::jsonb,
    '["Food", "Culture", "Street Food"]'::jsonb,
    '["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800"]'::jsonb,
    '{"h4": 160, "h6": 230, "h8": 290, "currency": "USD"}'::jsonb,
    6, 4.8, 31, true
  ),
  -- Mexico City Guide 2
  (
    'a4444444-4444-4444-4444-444444444444', 'sofia-cdmx', 'Sofía Hernández',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'Mexico City', 'mexico-city', 'Mexico', 'America/Mexico_City',
    'LGBTQ+ rights activist. Tours of queer landmarks and pride centers.',
    'Pride & Activism',
    '["English", "Spanish", "Portuguese"]'::jsonb,
    '["Activism", "LGBTQ+ Rights", "History"]'::jsonb,
    '["https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800"]'::jsonb,
    '{"h4": 140, "h6": 200, "h8": 250, "currency": "USD"}'::jsonb,
    8, 4.9, 27, true
  ),
  -- Berlin Guide 1
  (
    'a5555555-5555-5555-5555-555555555555', 'hannah-berlin', 'Hannah Müller',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    'Berlin', 'berlin', 'Germany', 'Europe/Berlin',
    'Historian specializing in Berlin''s LGBTQ+ past. From the 1920s to today.',
    'Berlin Queer History',
    '["English", "German"]'::jsonb,
    '["History", "Activism", "Walking Tours"]'::jsonb,
    '["https://images.unsplash.com/photo-1560969184-10fe8719e654?w=800"]'::jsonb,
    '{"h4": 180, "h6": 260, "h8": 320, "currency": "EUR"}'::jsonb,
    6, 5.0, 42, true
  ),
  -- Berlin Guide 2
  (
    'a6666666-6666-6666-6666-666666666666', 'max-berlin', 'Max Schmidt',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    'Berlin', 'berlin', 'Germany', 'Europe/Berlin',
    'DJ and nightlife expert. Experience Berlin''s legendary queer club scene!',
    'Berlin After Dark',
    '["English", "German", "French"]'::jsonb,
    '["Nightlife", "Techno", "Clubs"]'::jsonb,
    '["https://images.unsplash.com/photo-1571266028243-d220c6e15f95?w=800"]'::jsonb,
    '{"h4": 200, "h6": 280, "h8": 350, "currency": "EUR"}'::jsonb,
    4, 4.7, 38, true
  ),
  -- São Paulo Guide 1
  (
    'a7777777-7777-7777-7777-777777777777', 'lucas-sp', 'Lucas Silva',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
    'São Paulo', 'sao-paulo', 'Brazil', 'America/Sao_Paulo',
    'São Paulo LGBTQ+ nightlife! Samba, drag shows, and hidden gems.',
    'São Paulo Nights',
    '["English", "Portuguese", "Spanish"]'::jsonb,
    '["Nightlife", "Samba", "Drag Shows"]'::jsonb,
    '["https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800"]'::jsonb,
    '{"h4": 150, "h6": 210, "h8": 270, "currency": "USD"}'::jsonb,
    6, 4.8, 29, true
  ),
  -- São Paulo Guide 2
  (
    'a8888888-8888-8888-8888-888888888888', 'marina-sp', 'Marina Oliveira',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    'São Paulo', 'sao-paulo', 'Brazil', 'America/Sao_Paulo',
    'Artist and cultural guide. Street art, galleries, and queer-owned cafés.',
    'Street Art & Culture',
    '["English", "Portuguese"]'::jsonb,
    '["Art", "Street Art", "Culture"]'::jsonb,
    '["https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800"]'::jsonb,
    '{"h4": 130, "h6": 185, "h8": 240, "currency": "USD"}'::jsonb,
    8, 5.0, 21, true
  ),
  -- Bangkok Guide 1
  (
    'a9999999-9999-9999-9999-999999999999', 'chai-bangkok', 'Chaiwat S.',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop',
    'Bangkok', 'bangkok', 'Thailand', 'Asia/Bangkok',
    'Bangkok LGBTQ+ nightlife! Silom Soi 2, cabaret shows, and rooftop parties.',
    'Bangkok After Dark',
    '["English", "Thai", "Japanese"]'::jsonb,
    '["Nightlife", "Cabaret", "Party"]'::jsonb,
    '["https://images.unsplash.com/photo-1552596843-c4dc8d32095f?w=800"]'::jsonb,
    '{"h4": 120, "h6": 170, "h8": 220, "currency": "USD"}'::jsonb,
    6, 4.9, 35, true
  ),
  -- Bangkok Guide 2
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ploy-bangkok', 'Ploy Tanaka',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    'Bangkok', 'bangkok', 'Thailand', 'Asia/Bangkok',
    'Cultural guide. Temples, markets, and Thai LGBTQ+ perspectives.',
    'Thai Culture & LGBTQ+',
    '["English", "Thai", "Mandarin"]'::jsonb,
    '["Culture", "Temples", "History"]'::jsonb,
    '["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"]'::jsonb,
    '{"h4": 110, "h6": 155, "h8": 200, "currency": "USD"}'::jsonb,
    8, 5.0, 26, true
  )
ON CONFLICT (uid) DO NOTHING;

-- ============================================================================
-- 4. TRAVELER PROFILES
-- ============================================================================
INSERT INTO traveler_profiles (uid, "displayName", "avatarUrl", "homeCountry", "preferredLanguage") VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Jordan Smith', 'https://i.pravatar.cc/150?img=1', 'Canada', 'English'),
  ('b2222222-2222-2222-2222-222222222222', 'Casey Jones', 'https://i.pravatar.cc/150?img=2', 'UK', 'English'),
  ('b3333333-3333-3333-3333-333333333333', 'Alex Chen', 'https://i.pravatar.cc/150?img=3', 'USA', 'English'),
  ('b4444444-4444-4444-4444-444444444444', 'Sam Taylor', 'https://i.pravatar.cc/150?img=4', 'Australia', 'English')
ON CONFLICT (uid) DO NOTHING;

-- ============================================================================
-- 5. AVAILABILITY SLOTS
-- ============================================================================
INSERT INTO availability_slots (guide_id, start_time, duration_hours, status) VALUES
  ('a1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 days', 4, 'open'),
  ('a1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '5 days', 6, 'open'),
  ('a2222222-2222-2222-2222-222222222222', NOW() + INTERVAL '3 days', 4, 'open'),
  ('a3333333-3333-3333-3333-333333333333', NOW() + INTERVAL '1 day', 4, 'open'),
  ('a4444444-4444-4444-4444-444444444444', NOW() + INTERVAL '2 days', 4, 'open'),
  ('a5555555-5555-5555-5555-555555555555', NOW() + INTERVAL '3 days', 4, 'open'),
  ('a6666666-6666-6666-6666-666666666666', NOW() + INTERVAL '1 day', 6, 'open'),
  ('a7777777-7777-7777-7777-777777777777', NOW() + INTERVAL '2 days', 4, 'open'),
  ('a8888888-8888-8888-8888-888888888888', NOW() + INTERVAL '4 days', 4, 'open'),
  ('a9999999-9999-9999-9999-999999999999', NOW() + INTERVAL '1 day', 4, 'open'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() + INTERVAL '3 days', 4, 'open')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. RESERVATIONS (for reviews)
-- ============================================================================
INSERT INTO reservations (id, "travelerId", "guideId", status, total, currency) VALUES
  ('r1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'completed', 14000, 'EUR'),
  ('r2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', 'completed', 18000, 'EUR'),
  ('r3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'completed', 16000, 'USD'),
  ('r4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 'a9999999-9999-9999-9999-999999999999', 'completed', 12000, 'USD')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. REVIEWS
-- ============================================================================
INSERT INTO reviews ("subjectUserId", "authorUserId", "reservationId", rating, text, status, "createdAt") VALUES
  ('a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 5, 
   'Miguel was fantastic! Best queer bars in Lisbon. Highly recommend!', 'published', NOW() - INTERVAL '10 days'),
  ('a5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'r2222222-2222-2222-2222-222222222222', 5, 
   'Hannah''s Berlin history tour was deeply moving and educational.', 'published', NOW() - INTERVAL '15 days'),
  ('a3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'r3333333-3333-3333-3333-333333333333', 5, 
   'Carlos is a foodie dream guide! Amazing tacos and mezcal.', 'published', NOW() - INTERVAL '8 days'),
  ('a9999999-9999-9999-9999-999999999999', 'b4444444-4444-4444-4444-444444444444', 'r4444444-4444-4444-4444-444444444444', 5, 
   'Chai knows everyone in Bangkok! Epic nightlife tour.', 'published', NOW() - INTERVAL '12 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY
-- ============================================================================
SELECT 
  (SELECT COUNT(*) FROM cities) as cities,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM guide_profiles) as guides,
  (SELECT COUNT(*) FROM traveler_profiles) as travelers,
  (SELECT COUNT(*) FROM availability_slots) as slots,
  (SELECT COUNT(*) FROM reviews) as reviews;

-- Expected: cities=5, users=14, guides=10, travelers=4, slots=11, reviews=4
