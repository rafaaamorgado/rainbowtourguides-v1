import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, uuid, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Note: This schema is for type definitions only in demo mode
// Actual storage uses in-memory/file-based mock

export type Role = 'traveler' | 'guide' | 'admin' | 'support' | 'moderator';

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email"),
  role: text("role").$type<Role>().notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  status: text("status").$type<'active' | 'suspended'>(),
  verified: boolean("verified"),
  bannedUntil: timestamp("banned_until"),
  createdAt: timestamp("created_at"),
});

export const travelerProfiles = pgTable("traveler_profiles", {
  uid: varchar("uid").primaryKey(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  homeCountry: text("home_country"),
  preferredLanguage: text("preferred_language"),
  bio: text("bio"),
  ratingAvg: integer("rating_avg").default(0),
  ratingCount: integer("rating_count").default(0),
});

export const guideProfiles = pgTable("guide_profiles", {
  uid: varchar("uid").primaryKey(),
  handle: text("handle").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  city: text("city").notNull(),
  citySlug: text("city_slug").notNull(),
  cityId: varchar("city_id"),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
  bio: text("bio").notNull(),
  tagline: text("tagline"),
  yearsExperience: integer("years_experience"),
  languages: jsonb("languages").$type<string[]>().notNull(),
  themes: jsonb("themes").$type<string[]>().notNull(),
  photos: jsonb("photos").$type<string[]>().notNull(),
  prices: jsonb("prices").$type<{ h4: number; h6: number; h8: number; currency: string }>().notNull(),
  baseRateHour: numeric("base_rate_hour"),
  maxGroupSize: integer("max_group_size").notNull(),
  ratingAvg: integer("rating_avg").notNull(),
  ratingCount: integer("rating_count").notNull(),
  verified: boolean("verified"),
  meetupPref: jsonb("meetup_pref").$type<{ type: string; defaultLocation?: string }>(),
  socialLinks: jsonb("social_links").$type<{
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
    linkedin?: string;
    tiktok?: string;
  }>(),
  onboardingStep: integer("onboarding_step"),
});

export const availability = pgTable("availability", {
  uid: varchar("uid").primaryKey(),
  weekly: jsonb("weekly").$type<Record<string, string[]>>().notNull(),
  blackouts: jsonb("blackouts").$type<string[]>().notNull(),
  leadHoursMin: integer("lead_hours_min").notNull(),
});

export type BookingStatus = 'pending' | 'accepted' | 'cancelled' | 'completed' | 'refunded';

export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey(),
  travelerId: varchar("traveler_id").notNull(),
  guideId: varchar("guide_id").notNull(),
  status: text("status").$type<BookingStatus>().notNull(),
  currency: text("currency").notNull(),
  subtotal: integer("subtotal").notNull(),
  travelerFeePct: integer("traveler_fee_pct").notNull(),
  platformCommissionPct: integer("platform_commission_pct").notNull(),
  platformCommissionMinUsd: integer("platform_commission_min_usd").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey(),
  reservationId: varchar("reservation_id").notNull(),
  travelerId: varchar("traveler_id").notNull(),
  guideId: varchar("guide_id").notNull(),
  sessions: jsonb("sessions").$type<Array<{ date: string; startTime: string; durationHours: 4 | 6 | 8 }>>().notNull(),
  meeting: jsonb("meeting").$type<{ type: string; address?: string | null }>().notNull(),
  itineraryNote: text("itinerary_note"),
  status: text("status").$type<Exclude<BookingStatus, 'refunded'>>().notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey(),
  reservationId: varchar("reservation_id").notNull(),
  participantIds: jsonb("participant_ids").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  lastMessageAt: timestamp("last_message_at"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey(),
  conversationId: varchar("conversation_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey(),
  subjectUserId: varchar("subject_user_id").notNull(),
  authorUserId: varchar("author_user_id").notNull(),
  reservationId: varchar("reservation_id").notNull(),
  rating: integer("rating").$type<1 | 2 | 3 | 4 | 5>().notNull(),
  text: text("text").notNull(),
  responseText: text("response_text"),
  responseAt: timestamp("response_at"),
  originalText: text("original_text"),
  editedAt: timestamp("edited_at"),
  status: text("status").$type<'published' | 'hidden' | 'reported'>().notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey(),
  type: text("type").$type<'profile' | 'review' | 'message'>().notNull(),
  targetId: varchar("target_id").notNull(),
  reason: text("reason").notNull(),
  reporterId: varchar("reporter_id").notNull(),
  status: text("status").$type<'open' | 'closed'>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  resolvedBy: varchar("resolved_by"),
  resolutionNote: text("resolution_note"),
});

// Type exports
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type TravelerProfile = typeof travelerProfiles.$inferSelect;
export type GuideProfile = typeof guideProfiles.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Report = typeof reports.$inferSelect;

// Cities table (from 20251123230000 migration)
export const cities = pgTable("cities", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  countryCode: text("country_code").notNull(),
  country: text("country"),
  timezone: text("timezone").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: timestamp("created_at"),
});

// City type
export type City = typeof cities.$inferSelect;

// Legacy City interface for backward compatibility
export interface CityLegacy {
  id: string;
  name: string;
  slug: string;
  country: string;
  timezone: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
}
