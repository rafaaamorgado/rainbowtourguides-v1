import type { Express } from "express";

export function registerHealthRoutes(app: Express) {
  // Health check
  app.get("/api/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });
}
