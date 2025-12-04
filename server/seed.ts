import { storage } from "./supabase-storage";
import { readFileSync } from "fs";
import { join } from "path";
import type { GuideProfile, City } from "@shared/schema";
import { randomUUID } from "crypto";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Load cities
  const citiesPath = join(process.cwd(), "seed", "cities.json");
  const cities: City[] = JSON.parse(readFileSync(citiesPath, "utf-8"));

  // Load guides
  const guidesPath = join(process.cwd(), "seed", "guides.json");
  const guidesData: any[] = JSON.parse(readFileSync(guidesPath, "utf-8"));

  // Create demo users
  const demoTraveler = await storage.createUser({
    email: "traveler@demo.com",
    role: "traveler",
    displayName: "Demo Traveler",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
  });

  const demoGuide = await storage.createUser({
    email: "guide@demo.com",
    role: "guide",
    displayName: "Demo Guide",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  });

  const demoAdmin = await storage.createUser({
    email: "admin@demo.com",
    role: "admin",
    displayName: "Demo Admin",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
  });

  // Create traveler profile
  await storage.createTraveler({
    uid: demoTraveler.id,
    displayName: demoTraveler.displayName,
    avatarUrl: demoTraveler.avatarUrl || null,
    homeCountry: "United States",
    preferredLanguage: "English",
    bio: "Love exploring new cities and meeting local guides!",
    ratingAvg: 5,
    ratingCount: 3,
  });

  // Create guide profiles and users
  const guides: GuideProfile[] = [];
  for (const g of guidesData) {
    const user = await storage.createUser({
      email: `${g.handle}@example.com`,
      role: "guide",
      displayName: g.displayName,
      avatarUrl: g.avatarUrl,
    });

    const guide: GuideProfile = {
      uid: user.id,
      handle: g.handle,
      displayName: g.displayName,
      avatarUrl: g.avatarUrl,
      city: g.city,
      citySlug: g.citySlug,
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
      meetupPref: { type: "guide_default", defaultLocation: "City Center" },
    };

    await storage.createGuide(guide);
    guides.push(guide);

    // Create availability for each guide
    await storage.createAvailability({
      uid: user.id,
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

  // Generate reviews for guides
  const reviewTexts = [
    "Absolutely fantastic experience! Our guide was knowledgeable, friendly, and showed us hidden gems we would never have found on our own.",
    "Best tour guide experience ever! Deep local knowledge and made us feel completely welcome throughout the tour.",
    "Highly recommended! The guide was professional, accommodating, and really understood what we were looking for.",
    "Amazing tour! Our guide went above and beyond to make our experience memorable and safe.",
    "Wonderful experience from start to finish. The guide's insights into the local LGBTQ+ scene were invaluable.",
  ];

  // Create reviews for guides (using demo traveler as author)
  for (const guide of guides) {
    const reviewCount = Math.floor(Math.random() * 3) + 2; // 2-4 reviews per guide
    for (let i = 0; i < reviewCount; i++) {
      // Create a mock reservation first
      const mockReservation = await storage.createReservation({
        travelerId: demoTraveler.id,
        guideId: guide.uid,
        status: "completed",
        currency: "USD",
        subtotal: 140,
        travelerFeePct: 10,
        platformCommissionPct: 25,
        platformCommissionMinUsd: 25,
        total: 154,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      });

      await storage.createReview({
        subjectUserId: guide.uid,
        authorUserId: demoTraveler.id,
        reservationId: mockReservation.id,
        rating: (Math.floor(Math.random() * 2) + 4) as 4 | 5, // 4 or 5 stars
        text: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        responseText: null,
        responseAt: null,
        originalText: null,
        editedAt: null,
        status: "published",
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
      });
    }
  }

  // Create a sample pending reservation for demo
  const sampleGuide = guides[0];
  const reservation = await storage.createReservation({
    travelerId: demoTraveler.id,
    guideId: sampleGuide.uid,
    status: "pending",
    currency: "USD",
    subtotal: 140,
    travelerFeePct: 10,
    platformCommissionPct: 25,
    platformCommissionMinUsd: 25,
    total: 154,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await storage.createBooking({
    reservationId: reservation.id,
    travelerId: demoTraveler.id,
    guideId: sampleGuide.uid,
    sessions: [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        startTime: "10:00",
        durationHours: 4,
      },
    ],
    meeting: { type: "guide_default" },
    itineraryNote: "Looking forward to exploring the architecture!",
    status: "pending",
    createdAt: new Date(),
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${cities.length} cities`);
  console.log(`   - ${guides.length} guides`);
  console.log(`   - 3 demo users (traveler, guide, admin)`);
  console.log(`   - Sample reviews and bookings created`);
}
