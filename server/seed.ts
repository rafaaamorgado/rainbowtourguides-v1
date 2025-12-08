import { SupabaseStorage } from "./supabase-storage";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import type { GuideProfile, City } from "@shared/schema";

async function getAuthenticatedStorage(email: string, role: string, displayName: string, avatarUrl: string | null) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
  const authClient = createClient(supabaseUrl, supabaseKey);

  // 1. Sign Up or Sign In
  let userId: string;
  let sessionToken: string;

  const { data: signUpData, error: signUpError } = await authClient.auth.signUp({
    email,
    password: 'password123',
  });

  if (signUpError) {
    if (signUpError.message && (signUpError.message.includes("already registered") || signUpError.message.includes("User already registered"))) {
      const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
        email,
        password: 'password123'
      });
      if (signInError) throw signInError;
      userId = signInData.user!.id;
      sessionToken = signInData.session!.access_token;
    } else {
      throw signUpError;
    }
  } else if (signUpData.user) {
    userId = signUpData.user.id;
    sessionToken = signUpData.session?.access_token || "";
    if (!sessionToken && !signUpData.session) {
      // Auto-confirm might be off, or session not returned. Try Sign In.
      const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
        email,
        password: 'password123'
      });
      if (signInError) {
        console.warn(`Could not sign in after sign up for ${email}. Email verification might be required.`);
        throw signInError;
      }
      sessionToken = signInData.session!.access_token;
    }
  } else {
    throw new Error(`Failed to sign up user ${email}`);
  }

  const sessionClient = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${sessionToken}` } }
  });

  const userStorage = new SupabaseStorage(sessionClient);

  // 2. Ensure public.users record exists
  const existing = await userStorage.getUser(userId).catch(() => undefined);
  if (!existing) {
    await userStorage.createUser({
      id: userId,
      email,
      role: role as any,
      displayName,
      avatarUrl
    } as any);
  }

  return { storage: userStorage, userId };
}

export async function seedDatabase() {
  console.log("🌱 Seeding database (Authenticated)...");

  // 1. Admin
  const { storage: adminStorage } = await getAuthenticatedStorage("seed_admin@demo.com", "admin", "Seed Admin", "https://i.pravatar.cc/150?img=33");

  // Cities
  const citiesPath = join(process.cwd(), "seed", "cities.json");
  const cities: City[] = JSON.parse(readFileSync(citiesPath, "utf-8"));
  const cityMap = new Map<string, string>();

  console.log("Creating Cities...");
  for (const city of cities) {
    const { id, ...cityData } = city as any;
    try {
      const created = await adminStorage.createCity(cityData);
      cityMap.set(created.slug, created.id);
    } catch (e: any) {
      console.error(`Failed to create city ${city.name}: ${e.message}`);
    }
  }
  console.log(`✅ Seeded/Updated ${cities.length} cities`);

  // Travelers
  const { storage: travelerStorage, userId: travelerId } = await getAuthenticatedStorage("seed_traveler@demo.com", "traveler", "Seed Traveler", "https://i.pravatar.cc/150?img=20");

  // Note: createTraveler uses "upsert" equivalent? No, createTraveler uses insert.
  // We should check if profile exists or assume create fails if exists.
  // Better to use getTravelerByUid check.
  const existingTraveler = await travelerStorage.getTravelerByUid(travelerId);
  if (!existingTraveler) {
    await travelerStorage.createTraveler({
      uid: travelerId,
      displayName: "Seed Traveler",
      avatarUrl: "https://i.pravatar.cc/150?img=20",
      homeCountry: "United States",
      preferredLanguage: "English",
      bio: "Love exploring new cities and meeting local guides!",
      ratingAvg: 5,
      ratingCount: 3,
    });
  }

  // Guides
  const guidesPath = join(process.cwd(), "seed", "guides.json");
  const guidesData: any[] = JSON.parse(readFileSync(guidesPath, "utf-8"));
  const guides: GuideProfile[] = [];

  console.log("Creating Guides...");
  for (const g of guidesData) {
    const email = `seed_${g.handle}@example.com`;
    const { storage: guideStorage, userId: guideId } = await getAuthenticatedStorage(email, "guide", g.displayName, g.avatarUrl);

    // Check existing
    // We upgraded createGuide to upsert. Safe to call.
    const guideProfile: GuideProfile = {
      uid: guideId,
      handle: g.handle,
      displayName: g.displayName,
      avatarUrl: g.avatarUrl,
      city: g.city,
      citySlug: g.citySlug,
      cityId: cityMap.get(g.citySlug) || null,
      tagline: "Passion for showing my city",
      yearsExperience: 3,
      baseRateHour: "30.00",
      country: g.country,
      timezone: g.timezone,
      bio: g.bio,
      languages: g.languages,
      themes: g.themes,
      photos: g.photos,
      prices: g.prices,
      maxGroupSize: g.maxGroupSize,
      ratingAvg: g.ratingAvg,
      ratingCount: g.ratingCount,
      verified: true,
      socialLinks: {},
      onboardingStep: 5,
      meetupPref: { type: "guide_default", defaultLocation: "City Center" },
    };

    try {
      await guideStorage.createGuide(guideProfile);
      guides.push(guideProfile);

      // Availability (Assuming createAvailability uses insert, need check/catch)
      // createAvailability usually just inserts. Should we check?
      // Or just let it fail if unique violation?
      // Let's wrap in try/catch or check.
      const avail = await guideStorage.getAvailability(guideId);
      if (!avail) {
        await guideStorage.createAvailability({
          uid: guideId,
          weekly: {
            monday: ["10:00", "14:00"],
            tuesday: ["10:00", "14:00"],
            wednesday: ["10:00", "14:00"],
            thursday: ["10:00", "14:00"],
            friday: ["10:00", "14:00"],
            saturday: ["09:00", "13:00"],
            sunday: ["09:00", "13:00"],
          },
          blackouts: [],
          leadHoursMin: 24,
        });
      }
    } catch (e: any) {
      console.error(`Failed to seed guide ${g.handle}: ${e.message}`);
    }
  }

  // Reviews using travelerStorage
  const reviewTexts = [
    "Absolutely fantastic experience!",
    "Best tour guide experience ever!",
    "Highly recommended!",
    "Amazing tour!",
    "Wonderful experience.",
  ];

  console.log("Creating Reviews...");
  for (const guide of guides) {
    // Create a booking/reservation if needed for review policy?
    // Policy: "Travelers can review guides they have booked".
    // Is there such a policy?
    // create_rainbow_schema: CREATE POLICY "Travelers can create reviews" ... (reservation_id exists in reservations where traveler_id = auth.uid())
    // So yes, I MUST create a reservation first!

    const reservation = await travelerStorage.createReservation({
      travelerId: travelerId,
      guideId: guide.uid,
      status: "completed",
      currency: "USD",
      subtotal: 100,
      travelerFeePct: 10,
      platformCommissionPct: 20,
      platformCommissionMinUsd: 10,
      total: 120,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    try {
      // createReview (Using insert, might duplicate if ran twice, but reservation is new every time)
      await travelerStorage.createReview({
        subjectUserId: guide.uid,
        authorUserId: travelerId,
        reservationId: reservation.id,
        rating: 5,
        text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        responseText: null,
        responseAt: null,
        originalText: null,
        editedAt: null,
        status: "published",
        createdAt: new Date()
      });
    } catch (e: any) {
      console.warn("Review creation failed:", e.message);
    }
  }

  console.log("✅ Database seeded successfully!");
}
