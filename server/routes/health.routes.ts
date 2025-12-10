import type { Express } from "express";
import { storage } from "../supabase-storage";

export function registerHealthRoutes(app: Express) {
  // Basic health check
  app.get("/api/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Database health check with counts
  app.get("/api/health/db", async (_req, res) => {
    try {
      const [users, guides, cities] = await Promise.all([
        storage.listUsers(),
        storage.listAllGuides(),
        storage.listCities(),
      ]);

      res.json({
        status: "connected",
        supabaseUrl: process.env.VITE_SUPABASE_URL,
        counts: {
          users: users.length,
          guides: guides.length,
          cities: cities.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  });
}
