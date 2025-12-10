# 🌈 Supabase Database Setup - Complete Instructions

## Overview

Your Rainbow Tour Guides database needs to be set up in two steps:
1. **Apply Migrations** (create the database schema)
2. **Seed Data** (populate with sample data)

> [!IMPORTANT]
> **You encountered an error because migrations haven't been applied yet.**
> Follow the steps below in order.

## Step 1: Apply Database Migrations

### Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in with your credentials
3. Select your project: `xbiymvxtgeblnryebxul`

### Run Migrations

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button (top right)
3. Open the file: [migrations-consolidated.sql](file:///Users/rafaaa.morgado/Projects/rainbowtourguides-v1/supabase/migrations-consolidated.sql)
4. **Select All** (Cmd+A / Ctrl+A) and **Copy** (Cmd+C / Ctrl+C)
5. **Paste** into the Supabase SQL Editor
6. Click **"Run"** (or press Cmd+Enter / Ctrl+Enter)
7. Wait for execution to complete (may take 10-15 seconds)
8. You should see "Success. No rows returned"

### Verify Migrations Applied

Run this query in the SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see tables including: `cities`, `users`, `guide_profiles`, `reviews`, `availability_slots`, etc.

## Step 2: Seed the Database

### Run Seed Script

1. In SQL Editor, click **"New query"** again
2. Open the file: [seed-comprehensive.sql](file:///Users/rafaaa.morgado/Projects/rainbowtourguides-v1/supabase/seed-comprehensive.sql)
3. **Select All** (Cmd+A / Ctrl+A) and **Copy** (Cmd+C / Ctrl+C)
4. Return to Supabase SQL Editor
5. **Paste** the entire script into the editor

### Step 4: Execute the Script

1. Click the **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
2. Wait for execution to complete (should take 2-5 seconds)
3. You should see a success message

### Step 5: Verify Data Was Inserted

In the same SQL Editor, run these verification queries:

```sql
SELECT COUNT(*) as city_count FROM cities;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as guide_count FROM guide_profiles;
SELECT COUNT(*) as review_count FROM reviews;
SELECT COUNT(*) as slot_count FROM availability_slots;
```

**Expected Results:**
- `city_count`: 5
- `user_count`: 14 (10 guides + 4 travelers)
- `guide_count`: 10
- `review_count`: 8
- `slot_count`: 20

## Verification in Your Application

### Test the Health Endpoint

Your dev server should be running. Open a new terminal and run:

```bash
curl http://localhost:5001/api/health/db | jq
```

You should see:
```json
{
  "status": "connected",
  "supabaseUrl": "https://xbiymvxtgeblnryebxul.supabase.co",
  "counts": {
    "users": 14,
    "guides": 10,
    "cities": 5
  }
}
```

### Test the Frontend Pages

1. **Homepage**: http://localhost:5001/
   - Should show 5 featured cities
   - Should show featured guides

2. **Guides Page**: http://localhost:5001/guides
   - Should list all 10 guides
   - Search should work
   - Filters should work (by city, rating)

3. **Cities Page**: http://localhost:5001/cities
   - Should show 5 cities
   - Each city should show guide count

4. **Individual Guide**: http://localhost:5001/guides/miguel-lisbon-nightlife
   - Should show Miguel's profile
   - Should show reviews
   - Should show availability calendar

## Troubleshooting

### Issue: "Permission denied" or RLS error

**Solution**: The migrations should have already disabled RLS for demo mode. If you still see errors, run:

```sql
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE guide_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
```

### Issue: "Duplicate key value violates unique constraint"

**Solution**: Data already exists. To reset and re-seed:

```sql
-- Clear existing data (in this order)
DELETE FROM reviews;
DELETE FROM availability_slots;
DELETE FROM reservations;
DELETE FROM guide_profiles;
DELETE FROM traveler_profiles;
DELETE FROM users;
DELETE FROM cities;

-- Then re-run the seed script
```

### Issue: Frontend still shows no data

**Checklist:**
1. ✅ Verify data exists in Supabase (run verification queries)
2. ✅ Check health endpoint shows correct counts
3. ✅ Restart dev server: `npm run dev`
4. ✅ Clear browser cache and refresh
5. ✅ Check browser console for errors (F12)

## Sample Guide Profiles

Here's what you'll see after seeding:

### Lisbon
- **Miguel Santos** (@miguel-lisbon-nightlife) - Nightlife expert, €35/hr
- **Ana Costa** (@ana-lisbon-history) - History & art tours, €30/hr

### Mexico City
- **Carlos Rivera** (@carlos-cdmx-foodie) - Food & culture, $40/hr
- **Sofía Hernández** (@sofia-cdmx-pride) - Activism & pride, $35/hr

### Berlin
- **Hannah Müller** (@hannah-berlin-history) - Queer history, €45/hr
- **Max Schmidt** (@max-berlin-nightlife) - Nightlife & techno, €50/hr

### São Paulo
- **Lucas Silva** (@lucas-sp-nightlife) - Nightlife & samba, $38/hr
- **Marina Oliveira** (@marina-sp-art) - Street art, $33/hr

### Bangkok
- **Chaiwat S.** (@chai-bangkok-nightlife) - Nightlife tours, $30/hr
- **Ploy Tanaka** (@ploy-bangkok-culture) - Culture & temples, $28/hr

## Next Steps

After successful seeding:

1. ✅ Browse the guides page and test filters
2. ✅ Click on individual guide profiles
3. ✅ Test the search functionality
4. ✅ Verify reviews are displaying
5. ✅ Check that availability slots show up

If everything looks good, your Supabase integration is complete! 🎉
