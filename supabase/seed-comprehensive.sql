/*
  Rainbow Tour Guides - Comprehensive Seed Data
  
  This script populates the database with realistic demo data for the Rainbow Tour Guides platform.
  
  CITIES: 5 featured LGBTQ+ friendly destinations
  GUIDES: 10 diverse guides (2 per city) with rich profiles
  
  EXECUTION INSTRUCTIONS:
  1. Log into your Supabase dashboard at https://supabase.com/dashboard
  2. Navigate to your project (xbiymvxtgeblnryebxul)
  3. Go to SQL Editor
  4. Paste this entire script
  5. Click "Run" to execute
  
  NOTE: This script uses ON CONFLICT DO NOTHING to allow safe re-runs.
*/

-- ============================================================================
-- 1. CITIES (5 Featured LGBTQ+ Friendly Destinations)
-- ============================================================================
INSERT INTO cities (name, country_code, slug, timezone, lat, lng) VALUES
  ('Lisbon', 'PT', 'lisbon', 'Europe/Lisbon', 38.7223, -9.1393),
  ('Mexico City', 'MX', 'mexico-city', 'America/Mexico_City', 19.4326, -99.1332),
  ('Berlin', 'DE', 'berlin', 'Europe/Berlin', 52.5200, 13.4050),
  ('São Paulo', 'BR', 'sao-paulo', 'America/Sao_Paulo', -23.5505, -46.6333),
  ('Bangkok', 'TH', 'bangkok', 'Asia/Bangkok', 13.7563, 100.5018)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. USERS & GUIDE PROFILES (10 Guides, 2 per city)
-- ============================================================================

DO $$
DECLARE
  -- City IDs
  v_lisbon_id uuid := (SELECT id FROM cities WHERE slug = 'lisbon');
  v_mexico_id uuid := (SELECT id FROM cities WHERE slug = 'mexico-city');
  v_berlin_id uuid := (SELECT id FROM cities WHERE slug = 'berlin');
  v_saopaulo_id uuid := (SELECT id FROM cities WHERE slug = 'sao-paulo');
  v_bangkok_id uuid := (SELECT id FROM cities WHERE slug = 'bangkok');
  
  -- Guide UUIDs (deterministic for relationships)
  v_g1_id uuid := 'a1111111-1111-1111-1111-111111111111';
  v_g2_id uuid := 'a2222222-2222-2222-2222-222222222222';
  v_g3_id uuid := 'a3333333-3333-3333-3333-333333333333';
  v_g4_id uuid := 'a4444444-4444-4444-4444-444444444444';
  v_g5_id uuid := 'a5555555-5555-5555-5555-555555555555';
  v_g6_id uuid := 'a6666666-6666-6666-6666-666666666666';
  v_g7_id uuid := 'a7777777-7777-7777-7777-777777777777';
  v_g8_id uuid := 'a8888888-8888-8888-8888-888888888888';
  v_g9_id uuid := 'a9999999-9999-9999-9999-999999999999';
  v_g10_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  
  -- Traveler UUIDs (for reviews)
  v_t1_id uuid := 'b1111111-1111-1111-1111-111111111111';
  v_t2_id uuid := 'b2222222-2222-2222-2222-222222222222';
  v_t3_id uuid := 'b3333333-3333-3333-3333-333333333333';
  v_t4_id uuid := 'b4444444-4444-4444-4444-444444444444';

BEGIN

  -- ============================================================================
  -- Insert Users
  -- ============================================================================
  INSERT INTO users (id, email, role, display_name, avatar_url, verified) VALUES
    -- Lisbon Guides
    (v_g1_id, 'miguel.lisbon@example.com', 'guide', 'Miguel Santos', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', true),
    (v_g2_id, 'ana.lisbon@example.com', 'guide', 'Ana Costa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', true),
    
    -- Mexico City Guides
    (v_g3_id, 'carlos.cdmx@example.com', 'guide', 'Carlos Rivera', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', true),
    (v_g4_id, 'sofia.cdmx@example.com', 'guide', 'Sofía Hernández', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', true),
    
    -- Berlin Guides
    (v_g5_id, 'hannah.berlin@example.com', 'guide', 'Hannah Müller', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', true),
    (v_g6_id, 'max.berlin@example.com', 'guide', 'Max Schmidt', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', true),
    
    -- São Paulo Guides
    (v_g7_id, 'lucas.sp@example.com', 'guide', 'Lucas Silva', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop', true),
    (v_g8_id, 'marina.sp@example.com', 'guide', 'Marina Oliveira', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', true),
    
    -- Bangkok Guides
    (v_g9_id, 'chai.bangkok@example.com', 'guide', 'Chaiwat S.', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop', true),
    (v_g10_id, 'ploy.bangkok@example.com', 'guide', 'Ploy Tanaka', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', true),
    
    -- Travelers (for reviews)
    (v_t1_id, 'jordan.traveler@example.com', 'traveler', 'Jordan Smith', 'https://i.pravatar.cc/150?img=1', true),
    (v_t2_id, 'casey.traveler@example.com', 'traveler', 'Casey Jones', 'https://i.pravatar.cc/150?img=2', true),
    (v_t3_id, 'alex.traveler@example.com', 'traveler', 'Alex Chen', 'https://i.pravatar.cc/150?img=3', true),
    (v_t4_id, 'sam.traveler@example.com', 'traveler', 'Sam Taylor', 'https://i.pravatar.cc/150?img=4', true)
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- Insert Guide Profiles
  -- ============================================================================
  INSERT INTO guide_profiles (
    uid, handle, display_name, avatar_url, city_id, city, city_slug, country, timezone,
    bio, tagline, languages, themes, photos, prices, base_rate_hour, max_group_size,
    rating_avg, rating_count, verified, account_status
  ) VALUES
    -- LISBON GUIDE 1: Miguel Santos (Nightlife Expert)
    (
      v_g1_id, 'miguel-lisbon-nightlife', 'Miguel Santos',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      v_lisbon_id, 'Lisbon', 'lisbon', 'Portugal', 'Europe/Lisbon',
      'Born and raised in Lisbon, I''ve been part of the LGBTQ+ nightlife scene for over 10 years. Let me show you the best queer bars, drag shows, and hidden gems in Bairro Alto and Príncipe Real. Safe, fun, and unforgettable nights guaranteed!',
      'Your Guide to Lisbon''s Queer Nightlife',
      '["English", "Portuguese", "Spanish"]'::jsonb,
      '["Nightlife", "LGBTQ+ Culture", "Drag Shows", "Safety"]'::jsonb,
      '["https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800", "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800"]'::jsonb,
      '{"h4": 140, "h6": 200, "h8": 250, "currency": "EUR"}'::jsonb,
      35, 6, 4.9, 23, true, 'active'
    ),
    
    -- LISBON GUIDE 2: Ana Costa (History & Art)
    (
      v_g2_id, 'ana-lisbon-history', 'Ana Costa',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      v_lisbon_id, 'Lisbon', 'lisbon', 'Portugal', 'Europe/Lisbon',
      'Art historian and LGBTQ+ activist. I offer walking tours through Lisbon''s historic neighborhoods, exploring queer history from the Age of Discovery to modern times. We''ll visit museums, street art, and finish with pastéis de nata!',
      'Queer History & Art in Lisbon',
      '["English", "Portuguese", "French"]'::jsonb,
      '["History", "Art", "Activism", "Walking Tours"]'::jsonb,
      '["https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800"]'::jsonb,
      '{"h4": 120, "h6": 170, "h8": 220, "currency": "EUR"}'::jsonb,
      30, 8, 5.0, 18, true, 'active'
    ),
    
    -- MEXICO CITY GUIDE 1: Carlos Rivera (Food & Culture)
    (
      v_g3_id, 'carlos-cdmx-foodie', 'Carlos Rivera',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      v_mexico_id, 'Mexico City', 'mexico-city', 'Mexico', 'America/Mexico_City',
      'Foodie and cultural guide specializing in LGBTQ+ friendly neighborhoods. We''ll explore Zona Rosa, Condesa, and Roma Norte, tasting authentic tacos, mezcal, and learning about Mexico''s vibrant queer culture. Vegetarian options available!',
      'Tacos, Mezcal & Queer Culture',
      '["English", "Spanish"]'::jsonb,
      '["Food", "Culture", "LGBTQ+ History", "Street Food"]'::jsonb,
      '["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"]'::jsonb,
      '{"h4": 160, "h6": 230, "h8": 290, "currency": "USD"}'::jsonb,
      40, 6, 4.8, 31, true, 'active'
    ),
    
    -- MEXICO CITY GUIDE 2: Sofía Hernández (Activism & Pride)
    (
      v_g4_id, 'sofia-cdmx-pride', 'Sofía Hernández',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      v_mexico_id, 'Mexico City', 'mexico-city', 'Mexico', 'America/Mexico_City',
      'LGBTQ+ rights activist and community organizer. Join me for a tour of Mexico City''s queer landmarks, from historic meeting places to modern pride centers. Learn about our struggles, victories, and the vibrant community we''ve built.',
      'Pride, Activism & Community',
      '["English", "Spanish", "Portuguese"]'::jsonb,
      '["Activism", "LGBTQ+ Rights", "Community", "History"]'::jsonb,
      '["https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"]'::jsonb,
      '{"h4": 140, "h6": 200, "h8": 250, "currency": "USD"}'::jsonb,
      35, 8, 4.9, 27, true, 'active'
    ),
    
    -- BERLIN GUIDE 1: Hannah Müller (Queer History)
    (
      v_g5_id, 'hannah-berlin-history', 'Hannah Müller',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      v_berlin_id, 'Berlin', 'berlin', 'Germany', 'Europe/Berlin',
      'Historian specializing in Berlin''s LGBTQ+ past. From the golden 1920s to the dark Nazi era, through the Cold War to today''s vibrant scene. We''ll visit memorials, historic sites, and discuss how Berlin became a queer haven.',
      'Berlin''s Queer History Uncovered',
      '["English", "German"]'::jsonb,
      '["History", "Activism", "Walking Tours", "Memorials"]'::jsonb,
      '["https://images.unsplash.com/photo-1560969184-10fe8719e654?w=800", "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800"]'::jsonb,
      '{"h4": 180, "h6": 260, "h8": 320, "currency": "EUR"}'::jsonb,
      45, 6, 5.0, 42, true, 'active'
    ),
    
    -- BERLIN GUIDE 2: Max Schmidt (Nightlife & Techno)
    (
      v_g6_id, 'max-berlin-nightlife', 'Max Schmidt',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      v_berlin_id, 'Berlin', 'berlin', 'Germany', 'Europe/Berlin',
      'DJ and nightlife expert. Experience Berlin''s legendary queer club scene! I''ll take you to the best techno clubs, gay bars, and underground parties. Learn club etiquette, skip the lines, and dance until sunrise. 18+ only.',
      'Berlin After Dark: Clubs & Techno',
      '["English", "German", "French"]'::jsonb,
      '["Nightlife", "Techno", "Clubs", "LGBTQ+ Scene"]'::jsonb,
      '["https://images.unsplash.com/photo-1571266028243-d220c6e15f95?w=800", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"]'::jsonb,
      '{"h4": 200, "h6": 280, "h8": 350, "currency": "EUR"}'::jsonb,
      50, 4, 4.7, 38, true, 'active'
    ),
    
    -- SÃO PAULO GUIDE 1: Lucas Silva (Nightlife)
    (
      v_g7_id, 'lucas-sp-nightlife', 'Lucas Silva',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
      v_saopaulo_id, 'São Paulo', 'sao-paulo', 'Brazil', 'America/Sao_Paulo',
      'Welcome to São Paulo''s incredible LGBTQ+ nightlife! I''ll show you the best of Frei Caneca, Augusta, and hidden gems. From samba bars to drag shows, experience the warmth and energy of Brazil''s queer community. Vamos!',
      'São Paulo Nights: Samba & Pride',
      '["English", "Portuguese", "Spanish"]'::jsonb,
      '["Nightlife", "Samba", "Drag Shows", "LGBTQ+ Culture"]'::jsonb,
      '["https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800", "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800"]'::jsonb,
      '{"h4": 150, "h6": 210, "h8": 270, "currency": "USD"}'::jsonb,
      38, 6, 4.8, 29, true, 'active'
    ),
    
    -- SÃO PAULO GUIDE 2: Marina Oliveira (Art & Culture)
    (
      v_g8_id, 'marina-sp-art', 'Marina Oliveira',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      v_saopaulo_id, 'São Paulo', 'sao-paulo', 'Brazil', 'America/Sao_Paulo',
      'Artist and cultural guide. Explore São Paulo''s vibrant street art, LGBTQ+ galleries, and creative spaces. We''ll visit Beco do Batman, MASP, and queer-owned cafés. Perfect for art lovers who want to see the city''s creative soul!',
      'Street Art & Queer Creativity',
      '["English", "Portuguese"]'::jsonb,
      '["Art", "Street Art", "Culture", "Photography"]'::jsonb,
      '["https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800", "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"]'::jsonb,
      '{"h4": 130, "h6": 185, "h8": 240, "currency": "USD"}'::jsonb,
      33, 8, 5.0, 21, true, 'active'
    ),
    
    -- BANGKOK GUIDE 1: Chaiwat S. (Nightlife)
    (
      v_g9_id, 'chai-bangkok-nightlife', 'Chaiwat S.',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop',
      v_bangkok_id, 'Bangkok', 'bangkok', 'Thailand', 'Asia/Bangkok',
      'Discover Bangkok''s legendary LGBTQ+ nightlife! From Silom Soi 2 to DJ Station, I''ll show you the best gay bars, cabaret shows, and rooftop parties. Experience Thai hospitality and the most welcoming queer scene in Southeast Asia!',
      'Bangkok After Dark',
      '["English", "Thai", "Japanese"]'::jsonb,
      '["Nightlife", "Cabaret", "LGBTQ+ Scene", "Party"]'::jsonb,
      '["https://images.unsplash.com/photo-1552596843-c4dc8d32095f?w=800", "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"]'::jsonb,
      '{"h4": 120, "h6": 170, "h8": 220, "currency": "USD"}'::jsonb,
      30, 6, 4.9, 35, true, 'active'
    ),
    
    -- BANGKOK GUIDE 2: Ploy Tanaka (Culture & Temples)
    (
      v_g10_id, 'ploy-bangkok-culture', 'Ploy Tanaka',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      v_bangkok_id, 'Bangkok', 'bangkok', 'Thailand', 'Asia/Bangkok',
      'Cultural guide and LGBTQ+ advocate. Explore Bangkok''s temples, markets, and hidden gems through a queer lens. Learn about kathoey culture, Thai acceptance, and the intersection of tradition and modern LGBTQ+ life. Respectful and insightful!',
      'Thai Culture & LGBTQ+ Perspectives',
      '["English", "Thai", "Mandarin"]'::jsonb,
      '["Culture", "Temples", "History", "LGBTQ+ Rights"]'::jsonb,
      '["https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800", "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800"]'::jsonb,
      '{"h4": 110, "h6": 155, "h8": 200, "currency": "USD"}'::jsonb,
      28, 8, 5.0, 26, true, 'active'
    )
  ON CONFLICT (uid) DO NOTHING;

  -- ============================================================================
  -- Insert Traveler Profiles
  -- ============================================================================
  INSERT INTO traveler_profiles (uid, display_name, avatar_url, home_country, preferred_language) VALUES
    (v_t1_id, 'Jordan Smith', 'https://i.pravatar.cc/150?img=1', 'Canada', 'English'),
    (v_t2_id, 'Casey Jones', 'https://i.pravatar.cc/150?img=2', 'UK', 'English'),
    (v_t3_id, 'Alex Chen', 'https://i.pravatar.cc/150?img=3', 'USA', 'English'),
    (v_t4_id, 'Sam Taylor', 'https://i.pravatar.cc/150?img=4', 'Australia', 'English')
  ON CONFLICT (uid) DO NOTHING;

  -- ============================================================================
  -- 3. AVAILABILITY SLOTS (Future dates for booking)
  -- ============================================================================
  INSERT INTO availability_slots (guide_id, start_time, duration_hours, status) VALUES
    -- Lisbon guides
    (v_g1_id, NOW() + INTERVAL '2 days' + INTERVAL '20 hours', 4, 'open'),
    (v_g1_id, NOW() + INTERVAL '5 days' + INTERVAL '20 hours', 6, 'open'),
    (v_g2_id, NOW() + INTERVAL '3 days' + INTERVAL '10 hours', 4, 'open'),
    (v_g2_id, NOW() + INTERVAL '7 days' + INTERVAL '14 hours', 4, 'open'),
    
    -- Mexico City guides
    (v_g3_id, NOW() + INTERVAL '1 day' + INTERVAL '18 hours', 4, 'open'),
    (v_g3_id, NOW() + INTERVAL '4 days' + INTERVAL '18 hours', 6, 'open'),
    (v_g4_id, NOW() + INTERVAL '2 days' + INTERVAL '15 hours', 4, 'open'),
    (v_g4_id, NOW() + INTERVAL '6 days' + INTERVAL '15 hours', 4, 'open'),
    
    -- Berlin guides
    (v_g5_id, NOW() + INTERVAL '3 days' + INTERVAL '11 hours', 4, 'open'),
    (v_g5_id, NOW() + INTERVAL '8 days' + INTERVAL '11 hours', 6, 'open'),
    (v_g6_id, NOW() + INTERVAL '1 day' + INTERVAL '22 hours', 6, 'open'),
    (v_g6_id, NOW() + INTERVAL '5 days' + INTERVAL '22 hours', 8, 'open'),
    
    -- São Paulo guides
    (v_g7_id, NOW() + INTERVAL '2 days' + INTERVAL '21 hours', 4, 'open'),
    (v_g7_id, NOW() + INTERVAL '6 days' + INTERVAL '21 hours', 6, 'open'),
    (v_g8_id, NOW() + INTERVAL '4 days' + INTERVAL '13 hours', 4, 'open'),
    (v_g8_id, NOW() + INTERVAL '9 days' + INTERVAL '13 hours', 4, 'open'),
    
    -- Bangkok guides
    (v_g9_id, NOW() + INTERVAL '1 day' + INTERVAL '19 hours', 4, 'open'),
    (v_g9_id, NOW() + INTERVAL '5 days' + INTERVAL '19 hours', 6, 'open'),
    (v_g10_id, NOW() + INTERVAL '3 days' + INTERVAL '9 hours', 4, 'open'),
    (v_g10_id, NOW() + INTERVAL '7 days' + INTERVAL '9 hours', 4, 'open')
  ON CONFLICT DO NOTHING;

  -- ============================================================================
  -- 4. SAMPLE REVIEWS (Past completed tours)
  -- ============================================================================
  
  -- Create some past reservations for reviews
  INSERT INTO reservations (id, traveler_id, guide_id, status, total, currency) VALUES
    ('r1111111-1111-1111-1111-111111111111', v_t1_id, v_g1_id, 'completed', 14000, 'EUR'),
    ('r2222222-2222-2222-2222-222222222222', v_t2_id, v_g5_id, 'completed', 18000, 'EUR'),
    ('r3333333-3333-3333-3333-333333333333', v_t3_id, v_g3_id, 'completed', 16000, 'USD'),
    ('r4444444-4444-4444-4444-444444444444', v_t4_id, v_g9_id, 'completed', 12000, 'USD'),
    ('r5555555-5555-5555-5555-555555555555', v_t1_id, v_g2_id, 'completed', 12000, 'EUR'),
    ('r6666666-6666-6666-6666-666666666666', v_t2_id, v_g8_id, 'completed', 13000, 'USD'),
    ('r7777777-7777-7777-7777-777777777777', v_t3_id, v_g6_id, 'completed', 20000, 'EUR'),
    ('r8888888-8888-8888-8888-888888888888', v_t4_id, v_g10_id, 'completed', 11000, 'USD')
  ON CONFLICT (id) DO NOTHING;

  -- Insert reviews
  INSERT INTO reviews (subject_user_id, author_user_id, reservation_id, rating, text, status, created_at) VALUES
    (v_g1_id, v_t1_id, 'r1111111-1111-1111-1111-111111111111', 5, 
     'Miguel was absolutely fantastic! He showed us the best queer bars in Lisbon and made us feel so welcome. His knowledge of the local scene is incredible. Highly recommend!', 
     'published', NOW() - INTERVAL '10 days'),
    
    (v_g5_id, v_t2_id, 'r2222222-2222-2222-2222-222222222222', 5, 
     'Hannah''s tour was deeply moving and educational. Learning about Berlin''s LGBTQ+ history from someone so passionate was unforgettable. A must-do for anyone visiting Berlin!', 
     'published', NOW() - INTERVAL '15 days'),
    
    (v_g3_id, v_t3_id, 'r3333333-3333-3333-3333-333333333333', 5, 
     'Carlos is a foodie''s dream guide! The tacos were amazing, the mezcal was perfect, and the stories about Mexico City''s queer culture were fascinating. Best tour ever!', 
     'published', NOW() - INTERVAL '8 days'),
    
    (v_g9_id, v_t4_id, 'r4444444-4444-4444-4444-444444444444', 5, 
     'Chai knows everyone and everywhere in Bangkok! The nightlife tour was epic - great bars, amazing drag shows, and felt completely safe the whole time. 10/10!', 
     'published', NOW() - INTERVAL '12 days'),
    
    (v_g2_id, v_t1_id, 'r5555555-5555-5555-5555-555555555555', 5, 
     'Ana''s art and history tour was beautiful. She has such deep knowledge and passion for Lisbon''s queer heritage. The pastéis de nata at the end were the perfect finish!', 
     'published', NOW() - INTERVAL '20 days'),
    
    (v_g8_id, v_t2_id, 'r6666666-6666-6666-6666-666666666666', 5, 
     'Marina opened my eyes to São Paulo''s incredible street art scene. Her connections in the queer art community made this tour so special and authentic. Loved it!', 
     'published', NOW() - INTERVAL '18 days'),
    
    (v_g6_id, v_t3_id, 'r7777777-7777-7777-7777-777777777777', 4, 
     'Max''s nightlife tour was wild! Got into clubs I never would have found on my own. Only 4 stars because it was VERY late night - but that''s Berlin for you!', 
     'published', NOW() - INTERVAL '25 days'),
    
    (v_g10_id, v_t4_id, 'r8888888-8888-8888-8888-888888888888', 5, 
     'Ploy''s cultural tour was so insightful. Learning about kathoey culture and Thai LGBTQ+ history was eye-opening. She''s respectful, knowledgeable, and wonderful!', 
     'published', NOW() - INTERVAL '14 days')
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- 5. MARKETING CONTENT (Optional)
-- ============================================================================

INSERT INTO announcement_banners (message, link, cta_text, banner_type, is_active, priority) VALUES 
  ('🏳️‍🌈 Welcome to Rainbow Tour Guides! Discover authentic LGBTQ+ experiences worldwide.', '/guides', 'Browse Guides', 'info', true, 100)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after executing the seed to verify data was inserted:

-- SELECT COUNT(*) as city_count FROM cities;
-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as guide_count FROM guide_profiles;
-- SELECT COUNT(*) as review_count FROM reviews;
-- SELECT COUNT(*) as slot_count FROM availability_slots;

-- Expected results:
-- city_count: 5
-- user_count: 14 (10 guides + 4 travelers)
-- guide_count: 10
-- review_count: 8
-- slot_count: 20
