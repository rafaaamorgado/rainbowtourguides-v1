import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./supabase-storage";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";
import { registerModularRoutes } from "./routes/index";

/**
 * Main route registration function
 *
 * NOTE: This file is large (1,181 lines) and should be further refactored.
 * Health and dev routes have been extracted to server/routes/
 * TODO: Extract remaining routes (auth, guides, cities, etc.) to dedicated modules
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Register modular routes (health, dev)
  registerModularRoutes(app);

  // Auth endpoints
  app.get("/api/auth/demo-users", async (_req, res) => {
    try {
      const users = await storage.listUsers();
      const demoUsers = {
        travelers: users.filter(u => u.role === "traveler"),
        guides: users.filter(u => u.role === "guide"),
        admins: users.filter(u => u.role === "admin"),
      };
      res.json(demoUsers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/demo-login", async (req, res) => {
    const schema = z.object({
      role: z.enum(["traveler", "guide", "admin"]),
      displayName: z.string().min(1).optional(),
      userId: z.string().optional(),
    });

    try {
      const { role, displayName, userId } = schema.parse(req.body);
      
      let user;
      if (userId) {
        // Login as existing user
        user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
      } else {
        // Create new user
        if (!displayName) {
          return res.status(400).json({ error: "Display name required for new users" });
        }
        user = await storage.createUser({
          email: `demo-${Date.now()}@example.com`,
          role,
          displayName,
          avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        });

        // Create profile based on role
        if (role === "traveler") {
          await storage.createTraveler({
            uid: user.id,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            homeCountry: null,
            preferredLanguage: null,
            bio: null,
            ratingAvg: null,
            ratingCount: null,
          });
        }
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Cities
  app.get("/api/cities", async (_req, res) => {
    try {
      const cities = await storage.listCities();
      res.json(cities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cities/:slug", async (req, res) => {
    try {
      const city = await storage.getCityBySlug(req.params.slug);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      // Include guide count for this city
      const guides = await storage.listGuidesByCity(req.params.slug);
      res.json({ ...city, guideCount: guides.length, guides });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Guides
  app.get("/api/guides", async (req, res) => {
    try {
      const { citySlug } = req.query;
      let guides;

      if (citySlug) {
        guides = await storage.listGuidesByCity(citySlug as string);
      } else {
        guides = await storage.listAllGuides();
      }

      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/guides/:handle", async (req, res) => {
    try {
      const guide = await storage.getGuideByHandle(req.params.handle);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }
      res.json(guide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Availability Slots
  app.post("/api/guides/availability", async (req, res) => {
    const schema = z.object({
      guideId: z.string(),
      startTime: z.string(),
      durationHours: z.union([z.literal(4), z.literal(6), z.literal(8)]),
    });

    try {
      const data = schema.parse(req.body);

      // Validate guide exists
      const guide = await storage.getGuideByUid(data.guideId);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // Validate start time is in the future
      const startTime = new Date(data.startTime);
      if (startTime < new Date()) {
        return res.status(400).json({ error: "Start time must be in the future" });
      }

      // Check for overlapping slots
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + data.durationHours);

      const existingSlots = await storage.listSlotsByGuide(
        data.guideId,
        startTime.toISOString(),
        endTime.toISOString()
      );

      if (existingSlots.length > 0) {
        return res.status(400).json({ error: "Slot overlaps with existing slot" });
      }

      // Create slot
      const slot = await storage.createSlot({
        guide_id: data.guideId,
        start_time: data.startTime,
        duration_hours: data.durationHours,
        status: "open",
      });

      res.json(slot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/availability", async (req, res) => {
    try {
      const { guideId, from, to, duration, status } = req.query;

      if (!guideId) {
        return res.status(400).json({ error: "guideId is required" });
      }

      let slots;
      if (status === "open" || !status) {
        slots = await storage.listOpenSlots(
          guideId as string,
          from as string | undefined,
          to as string | undefined,
          duration ? parseInt(duration as string) : undefined
        );
      } else {
        slots = await storage.listSlotsByGuide(
          guideId as string,
          from as string | undefined,
          to as string | undefined,
          status as string | undefined
        );
      }

      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/availability/:id", async (req, res) => {
    try {
      const slot = await storage.getSlot(req.params.id);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.json(slot);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/availability/:id", async (req, res) => {
    const schema = z.object({
      status: z.enum(["open", "pending", "booked", "closed"]).optional(),
      startTime: z.string().optional(),
      durationHours: z.union([z.literal(4), z.literal(6), z.literal(8)]).optional(),
    });

    try {
      const updates = schema.parse(req.body);
      const updateData: any = {};

      if (updates.status) updateData.status = updates.status;
      if (updates.startTime) updateData.start_time = updates.startTime;
      if (updates.durationHours) updateData.duration_hours = updates.durationHours;

      const slot = await storage.updateSlot(req.params.id, updateData);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.json(slot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/availability/:id", async (req, res) => {
    try {
      const success = await storage.deleteSlot(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Slot not found" });
      }
      res.json({ message: "Slot deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reviews
  app.get("/api/reviews/guide/:guideUid", async (req, res) => {
    try {
      const reviews = await storage.listReviewsBySubject(req.params.guideUid);
      const published = reviews.filter((r) => r.status === "published");
      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reviews", async (_req, res) => {
    try {
      const reviews = await storage.listAllReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reviews/author/:authorUid", async (req, res) => {
    try {
      const reviews = await storage.listReviewsByAuthor(req.params.authorUid);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    const schema = z.object({
      subjectUserId: z.string(),
      authorUserId: z.string(),
      reservationId: z.string(),
      rating: z.number().min(1).max(5),
      text: z.string().min(1).max(500),
      status: z.enum(["published", "hidden", "reported"]).optional(),
    });

    try {
      const data = schema.parse(req.body);
      const review = await storage.createReview({
        ...data,
        rating: data.rating as 1 | 2 | 3 | 4 | 5,
        status: data.status || "published",
        responseText: null,
        responseAt: null,
        originalText: null,
        editedAt: null,
        createdAt: new Date(),
      });
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/reviews/:id", async (req, res) => {
    const schema = z.object({
      rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
      text: z.string().min(1).max(500).optional(),
      responseText: z.string().max(500).optional(),
      responseAt: z.string().optional(),
      editedAt: z.string().optional(),
      originalText: z.string().optional(),
      status: z.enum(["published", "hidden", "reported"]).optional(),
    });

    try {
      const updates = schema.parse(req.body);
      const updateData: any = { ...updates };
      if (updates.responseAt) updateData.responseAt = new Date(updates.responseAt);
      if (updates.editedAt) updateData.editedAt = new Date(updates.editedAt);

      const review = await storage.updateReview(req.params.id, updateData);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reports
  app.get("/api/reports", async (_req, res) => {
    try {
      const reports = await storage.listReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reports", async (req, res) => {
    const schema = z.object({
      type: z.enum(["profile", "review", "message"]),
      targetId: z.string(),
      reason: z.string().min(1),
      reporterId: z.string(),
      status: z.enum(["open", "closed"]).optional(),
    });

    try {
      const data = schema.parse(req.body);
      const report = await storage.createReport({
        ...data,
        status: data.status || "open",
        createdAt: new Date(),
        resolvedBy: null,
        resolutionNote: null,
      });
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reservations
  app.post("/api/reservations", async (req, res) => {
    const schema = z.object({
      travelerId: z.string(),
      guideId: z.string(),
      slotId: z.string().optional(), // Optional slot ID for slot-based booking
      sessions: z.array(
        z.object({
          date: z.string(),
          startTime: z.string(),
          durationHours: z.union([z.literal(4), z.literal(6), z.literal(8)]),
        })
      ),
      meeting: z.object({
        type: z.string(),
        address: z.string().optional().nullable(),
      }),
      itineraryNote: z.string().optional(),
    });

    try {
      const data = schema.parse(req.body);
      const guide = await storage.getGuideByUid(data.guideId);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // If slot-based booking, validate and reserve the slot
      if (data.slotId) {
        const slot = await storage.getSlot(data.slotId);
        if (!slot) {
          return res.status(404).json({ error: "Slot not found" });
        }
        if (slot.status !== "open") {
          return res.status(400).json({ error: "Slot is no longer available" });
        }
        if (slot.guide_id !== data.guideId) {
          return res.status(400).json({ error: "Slot does not belong to this guide" });
        }

        // Reserve the slot (set to pending)
        await storage.updateSlot(data.slotId, { status: "pending" });
      }

      // Calculate total using base_rate_hour if available
      const durationHours = data.sessions[0].durationHours;
      let subtotal: number;
      let currency = "USD";

      if (guide.base_rate_hour) {
        // New pricing model
        const baseRate = guide.base_rate_hour;
        let hourlyTotal = baseRate * durationHours;

        // Apply discounts
        if (durationHours === 6) {
          hourlyTotal = hourlyTotal * 0.95; // 5% discount
        } else if (durationHours === 8) {
          hourlyTotal = hourlyTotal * 0.9; // 10% discount
        }

        subtotal = Math.round(hourlyTotal);
      } else {
        // Legacy pricing model
        const priceKey = `h${durationHours}` as "h4" | "h6" | "h8";
        subtotal = guide.prices[priceKey] * data.sessions.length;
        currency = guide.prices.currency || "USD";
      }

      const travelerFee = Math.round(subtotal * 0.1);
      const total = subtotal + travelerFee;

      const reservation = await storage.createReservation({
        travelerId: data.travelerId,
        guideId: data.guideId,
        status: "pending",
        currency,
        subtotal,
        travelerFeePct: 10,
        platformCommissionPct: 25,
        platformCommissionMinUsd: 25,
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const booking = await storage.createBooking({
        reservationId: reservation.id,
        travelerId: data.travelerId,
        guideId: data.guideId,
        sessions: data.sessions as Array<{ date: string; startTime: string; durationHours: 4 | 6 | 8 }>,
        meeting: { ...data.meeting, address: data.meeting.address || null },
        itineraryNote: data.itineraryNote || null,
        status: "pending",
        createdAt: new Date(),
      });

      res.json({ reservation, booking, slotReserved: !!data.slotId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/reservations/traveler/:travelerId", async (req, res) => {
    try {
      const reservations = await storage.listReservationsByTraveler(req.params.travelerId);
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reservations/guide/:guideId", async (req, res) => {
    try {
      const reservations = await storage.listReservationsByGuide(req.params.guideId);
      res.json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    const schema = z.object({
      status: z.enum(["pending", "accepted", "cancelled", "completed", "refunded"]),
    });

    try {
      const { status } = schema.parse(req.body);
      const reservation = await storage.updateReservation(req.params.id, { status, updatedAt: new Date() });

      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      // If accepted, create conversation
      if (status === "accepted") {
        const existing = await storage.getConversationByReservation(reservation.id);
        if (!existing) {
          await storage.createConversation({
            reservationId: reservation.id,
            participantIds: [reservation.travelerId, reservation.guideId],
            createdAt: new Date(),
            lastMessageAt: null,
          });
        }

        // Update booking status
        const booking = await storage.getBookingByReservation(reservation.id);
        if (booking) {
          await storage.updateBooking(booking.id, { status: "accepted" });
        }
      }

      res.json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Conversations
  app.get("/api/conversations/user/:userId", async (req, res) => {
    try {
      const conversations = await storage.listConversationsByUser(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.listMessagesByConversation(req.params.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    const schema = z.object({
      senderId: z.string(),
      text: z.string().min(1),
    });

    try {
      const { senderId, text } = schema.parse(req.body);
      const message = await storage.createMessage({
        conversationId: req.params.id,
        senderId,
        text,
        createdAt: new Date(),
      });
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Travelers endpoint (for client queries)
  app.get("/api/travelers", async (_req, res) => {
    try {
      const travelers = await storage.listUsers();
      const travelerProfiles = travelers.filter(u => u.role === "traveler").map(async u => {
        const profile = await storage.getTravelerByUid(u.id);
        return profile;
      });
      const resolvedProfiles = await Promise.all(travelerProfiles);
      res.json(resolvedProfiles.filter(p => p !== undefined));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Bookings endpoint (for client queries)
  app.get("/api/bookings", async (_req, res) => {
    try {
      const bookings = await storage.listAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin endpoints
  app.get("/api/admin/users", async (_req, res) => {
    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/guides", async (_req, res) => {
    try {
      const guides = await storage.listAllGuides();
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/bookings", async (_req, res) => {
    try {
      const bookings = await storage.listAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/reviews", async (_req, res) => {
    try {
      const reviews = await storage.listAllReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/reviews/:id", async (req, res) => {
    const schema = z.object({
      status: z.enum(["published", "hidden", "reported"]),
    });

    try {
      const { status } = schema.parse(req.body);
      const review = await storage.updateReview(req.params.id, { status });
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/reports", async (_req, res) => {
    try {
      const reports = await storage.listReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // City management endpoints (admin only)
  app.post("/api/admin/cities", async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        country_code: z.string().length(2),
        slug: z.string().min(1),
        lat: z.number().optional(),
        lng: z.number().optional(),
        timezone: z.string().default("UTC"),
      });

      const data = schema.parse(req.body);
      const city = await storage.createCity(data);
      res.json(city);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/cities/:id", async (req, res) => {
    try {
      const updates = req.body;
      const city = await storage.updateCity(req.params.id, updates);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/cities/:id", async (req, res) => {
    try {
      const success = await storage.deleteCity(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile update endpoints
  app.patch("/api/guides/:uid", async (req, res) => {
    try {
      const updates = req.body;
      let guide = await storage.getGuideByUid(req.params.uid);
      
      if (!guide) {
        // Create guide profile if it doesn't exist
        const user = await storage.getUser(req.params.uid);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        guide = await storage.createGuide({
          uid: req.params.uid,
          handle: `guide-${req.params.uid.slice(0, 8)}`,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl || null,
          city: updates.city || "Barcelona",
          citySlug: updates.citySlug || "barcelona",
          country: updates.country || "Spain",
          timezone: updates.timezone || "Europe/Madrid",
          bio: updates.bio || "",
          languages: updates.languages || ["English"],
          themes: updates.themes || ["General Tours"],
          prices: updates.prices || { h4: 100, h6: 140, h8: 180, currency: "USD" },
          photos: updates.photos || [],
          ratingAvg: 0,
          ratingCount: 0,
          maxGroupSize: updates.maxGroupSize || 6,
          verified: null,
          meetupPref: null,
        });
      } else {
        // Update existing guide
        guide = await storage.updateGuide(req.params.uid, updates);
      }
      
      res.json(guide);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/travelers/:uid", async (req, res) => {
    try {
      const updates = req.body;
      let traveler = await storage.getTravelerByUid(req.params.uid);
      
      if (!traveler) {
        // Create traveler profile if it doesn't exist
        const user = await storage.getUser(req.params.uid);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        traveler = await storage.createTraveler({
          uid: req.params.uid,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl || null,
          homeCountry: updates.homeCountry || null,
          preferredLanguage: null,
          bio: null,
          ratingAvg: null,
          ratingCount: null,
        });
      } else {
        // Update existing traveler
        traveler = await storage.updateTraveler(req.params.uid, updates);
      }
      
      res.json(traveler);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    const schema = z.object({
      name: z.string().min(1, "Name is required").max(100),
      email: z.string().email("Valid email is required"),
      subject: z.string().min(1, "Subject is required").max(200),
      message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
      gdprConsent: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
      userId: z.string().optional(),
    });

    try {
      const data = schema.parse(req.body);

      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration missing");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: submission, error } = await supabase
        .from("contact_submissions")
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          gdpr_consent: data.gdprConsent,
          user_id: data.userId || null,
          status: "new",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating contact submission:", error);
        return res.status(500).json({ error: "Failed to submit contact form" });
      }

      res.json({
        success: true,
        submissionId: submission.id,
        message: "Your message has been received. We'll get back to you soon!"
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ error: error.message || "Failed to submit contact form" });
    }
  });

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    const schema = z.object({
      email: z.string().email("Valid email is required"),
      gdprConsent: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
    });

    try {
      const data = schema.parse(req.body);

      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration missing");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Check if email already exists
      const { data: existing } = await supabase
        .from("newsletter_subscriptions")
        .select("id, status")
        .eq("email", data.email)
        .maybeSingle();

      if (existing) {
        if (existing.status === "confirmed") {
          return res.status(400).json({ error: "Email already subscribed" });
        } else if (existing.status === "pending") {
          return res.json({
            success: true,
            message: "Confirmation email has been sent. Please check your inbox.",
          });
        }
      }

      // Create new subscription
      const { data: subscription, error } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email: data.email,
          status: "pending",
          ip_address: req.ip || req.socket.remoteAddress,
          user_agent: req.headers["user-agent"],
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating newsletter subscription:", error);
        return res.status(500).json({ error: "Failed to subscribe to newsletter" });
      }

      // In production, send confirmation email here
      console.log(`Newsletter confirmation link: ${req.protocol}://${req.get('host')}/api/newsletter/confirm/${subscription.token}`);

      res.json({
        success: true,
        message: "Please check your email to confirm your subscription.",
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: error.message || "Failed to subscribe" });
    }
  });

  // Get active announcement banners
  app.get("/api/banners", async (req, res) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration missing");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: banners, error } = await supabase
        .from("announcement_banners")
        .select("*")
        .eq("is_active", true)
        .order("priority", { ascending: false });

      if (error) {
        console.error("Error fetching banners:", error);
        return res.status(500).json({ error: "Failed to fetch banners" });
      }

      res.json(banners || []);
    } catch (error: any) {
      console.error("Banners error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch banners" });
    }
  });

  // Newsletter confirmation
  app.get("/api/newsletter/confirm/:token", async (req, res) => {
    try {
      const { token } = req.params;

      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase configuration missing");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Find subscription by token
      const { data: subscription, error: findError } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (findError || !subscription) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Invalid Link</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>Invalid Confirmation Link</h1>
              <p>This confirmation link is invalid or has expired.</p>
              <a href="/" style="color: #3b82f6;">Return to homepage</a>
            </body>
          </html>
        `);
      }

      if (subscription.status === "confirmed") {
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head><title>Already Confirmed</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>Already Subscribed</h1>
              <p>Your email is already confirmed for our newsletter.</p>
              <a href="/" style="color: #3b82f6;">Return to homepage</a>
            </body>
          </html>
        `);
      }

      // Update subscription status
      const { error: updateError } = await supabase
        .from("newsletter_subscriptions")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);

      if (updateError) {
        console.error("Error confirming subscription:", updateError);
        return res.status(500).send("Failed to confirm subscription");
      }

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Subscription Confirmed</title>
            <style>
              body {
                font-family: sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .container {
                background: white;
                color: #333;
                padding: 40px;
                border-radius: 16px;
                max-width: 500px;
                margin: 0 auto;
              }
              h1 { color: #667eea; margin-bottom: 20px; }
              p { margin: 20px 0; }
              a {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 Subscription Confirmed!</h1>
              <p>Thank you for subscribing to Rainbow Tour Guides newsletter.</p>
              <p>You'll receive updates about new destinations, LGBTQ+ travel tips, and exclusive offers.</p>
              <a href="/">Return to Rainbow Tour Guides</a>
            </div>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Newsletter confirmation error:", error);
      res.status(500).send("An error occurred");
    }
  });

  // Blog endpoints
  app.get("/api/blog/categories", async (_req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blog/categories/:id", async (req, res) => {
    try {
      const category = await storage.getBlogCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { category, search, featured, limit } = req.query;
      let posts = await storage.getBlogPosts({
        category: category as string | undefined,
        search: search as string | undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined
      });

      if (limit) {
        posts = posts.slice(0, parseInt(limit as string));
      }

      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await storage.incrementBlogPostViews(post.id);

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
