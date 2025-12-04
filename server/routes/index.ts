import type { Express } from "express";
import { registerHealthRoutes } from "./health.routes";
import { registerDevRoutes } from "./dev.routes";

/**
 * Register all route modules
 * This approach splits routes into logical modules for better maintainability
 */
export function registerModularRoutes(app: Express) {
  // Core system routes
  registerHealthRoutes(app);

  // Development-only routes (seed, reset)
  registerDevRoutes(app);

  // Note: Additional routes (auth, guides, cities, etc.) are still in routes.ts
  // Future refactor: Move remaining routes to dedicated modules
}
