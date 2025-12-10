# 🚀 SIMPLIFIED SETUP - Start Here!

## Current Situation

✅ Your database **already has some tables** (3 tables found)  
✅ Some migrations were already applied  
❌ Running the full migrations again causes "policy already exists" errors

## The Simple Solution

**Skip the migrations entirely** and just run the seed script. Here's why this works:
- The seed script uses `ON CONFLICT DO NOTHING` - it's safe to run multiple times
- Your migrations already disabled RLS for demo mode
- The seed script will create any missing data

---

## Step-by-Step Instructions

### Step 1: Check What Tables Exist

In Supabase SQL Editor, run this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**You should see at least:** `cities`, `users`, `guide_profiles`, and others.

---

### Step 2: Clear Existing Data (Optional but Recommended)

This ensures a clean slate. Run this in SQL Editor:

```sql
-- Delete in correct order (respects foreign keys)
DELETE FROM reviews;
DELETE FROM availability_slots;
DELETE FROM reservations;
DELETE FROM bookings;
DELETE FROM guide_profiles;
DELETE FROM traveler_profiles;
DELETE FROM users;
DELETE FROM cities;
```

**Expected result:** "Success. X rows affected" (or 0 if tables were empty)

---

### Step 3: Run the Seed Script

1. In SQL Editor, click **"New query"**
2. Open: `supabase/seed-comprehensive.sql`
3. **Select All** (Cmd+A) and **Copy** (Cmd+C)
4. **Paste** into SQL Editor
5. Click **"Run"**
6. Wait 5-10 seconds

**Expected result:** "Success. No rows returned" (this is normal!)

---

### Step 4: Verify Data Was Inserted

Run this verification query:

```sql
SELECT 
  (SELECT COUNT(*) FROM cities) as cities,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM guide_profiles) as guides,
  (SELECT COUNT(*) FROM reviews) as reviews,
  (SELECT COUNT(*) FROM availability_slots) as slots;
```

**Expected results:**
- cities: **5**
- users: **14**
- guides: **10**
- reviews: **8**
- slots: **20**

---

### Step 5: Test Your Application

With your dev server running (`npm run dev`), test these endpoints:

**Health Check:**
```bash
curl http://localhost:5001/api/health/db | jq
```

Should show:
```json
{
  "status": "connected",
  "counts": {
    "users": 14,
    "guides": 10,
    "cities": 5
  }
}
```

**Frontend Pages:**
- Homepage: http://localhost:5001/
- Guides: http://localhost:5001/guides
- Cities: http://localhost:5001/cities
- Individual guide: http://localhost:5001/guides/miguel-lisbon-nightlife

---

## Troubleshooting

### Error: "relation X does not exist"

**Solution:** Some tables are missing. Run this to create missing tables:

```sql
-- Create cities table if missing
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code text NOT NULL,
  slug text UNIQUE NOT NULL,
  timezone text NOT NULL,
  lat numeric,
  lng numeric,
  created_at timestamptz DEFAULT now()
);

-- Create availability_slots if missing
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL,
  start_time timestamptz NOT NULL,
  duration_hours integer NOT NULL CHECK (duration_hours IN (4, 6, 8)),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'booked', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Disable RLS for demo
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots DISABLE ROW LEVEL SECURITY;
```

Then retry Step 3 (run seed script).

### Error: "duplicate key value violates unique constraint"

**Solution:** Data already exists. Either:
- Skip to Step 4 (verify data)
- Or run Step 2 (clear data) then Step 3 (seed again)

### Frontend shows no data

**Checklist:**
1. ✅ Verify data in Supabase (Step 4 query shows counts > 0)
2. ✅ Check health endpoint shows correct counts
3. ✅ Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
4. ✅ Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
5. ✅ Check browser console for errors (F12)

---

## What This Seeds

### 5 Cities
- 🇵🇹 Lisbon, Portugal
- 🇲🇽 Mexico City, Mexico
- 🇩🇪 Berlin, Germany
- 🇧🇷 São Paulo, Brazil
- 🇹🇭 Bangkok, Thailand

### 10 LGBTQ+ Guides (2 per city)
Each with realistic bios, photos, languages, specialties, and pricing ($28-$50/hr)

### 20 Availability Slots
Future dates for booking (2 per guide)

### 8 Sample Reviews
5-star reviews from travelers

### 4 Traveler Profiles
For review authors

---

## Summary

**TL;DR:**
1. Clear data (optional): `DELETE FROM reviews; DELETE FROM availability_slots; ...`
2. Run seed: Copy/paste `seed-comprehensive.sql` → Run
3. Verify: Check counts query shows 5 cities, 10 guides, etc.
4. Test: Visit http://localhost:5001/guides

That's it! 🎉
