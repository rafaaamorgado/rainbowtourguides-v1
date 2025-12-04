import type { Express } from "express";
import { storage } from "../supabase-storage";
import { seedDatabase } from "../seed";

export function registerDevRoutes(app: Express) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Seed endpoint (dev only)
  app.post("/api/seed", async (_req, res) => {
    if (isProduction) {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reset endpoint (dev only)
  app.post("/api/reset", async (_req, res) => {
    if (isProduction) {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      await storage.reset();
      await seedDatabase();
      res.json({ message: "Database reset and reseeded successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
