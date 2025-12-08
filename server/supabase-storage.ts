import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type {
  User,
  InsertUser,
  TravelerProfile,
  GuideProfile,
  Availability,
  Reservation,
  Booking,
  Conversation,
  Message,
  Review,
  Report,
} from "@shared/schema";

export interface City {
  id: string;
  name: string;
  country_code: string;
  slug: string;
  lat: number | null;
  lng: number | null;
  timezone: string;
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  guide_id: string;
  start_time: string;
  duration_hours: 4 | 6 | 8;
  status: 'open' | 'pending' | 'booked' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getGuideByHandle(handle: string): Promise<GuideProfile | undefined>;
  getGuideByUid(uid: string): Promise<GuideProfile | undefined>;
  listGuidesByCity(citySlug: string): Promise<GuideProfile[]>;
  listAllGuides(): Promise<GuideProfile[]>;
  createGuide(guide: GuideProfile): Promise<GuideProfile>;
  updateGuide(uid: string, updates: Partial<GuideProfile>): Promise<GuideProfile | undefined>;
  getTravelerByUid(uid: string): Promise<TravelerProfile | undefined>;
  createTraveler(profile: TravelerProfile): Promise<TravelerProfile>;
  updateTraveler(uid: string, updates: Partial<TravelerProfile>): Promise<TravelerProfile | undefined>;
  getAvailability(uid: string): Promise<Availability | undefined>;
  createAvailability(avail: Availability): Promise<Availability>;
  createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation>;
  getReservation(id: string): Promise<Reservation | undefined>;
  updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | undefined>;
  listReservationsByTraveler(travelerId: string): Promise<Reservation[]>;
  listReservationsByGuide(guideId: string): Promise<Reservation[]>;
  listAllReservations(): Promise<Reservation[]>;
  createBooking(booking: Omit<Booking, "id">): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByReservation(reservationId: string): Promise<Booking | undefined>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;
  listAllBookings(): Promise<Booking[]>;
  createConversation(conversation: Omit<Conversation, "id">): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationByReservation(reservationId: string): Promise<Conversation | undefined>;
  listConversationsByUser(userId: string): Promise<Conversation[]>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  createMessage(message: Omit<Message, "id">): Promise<Message>;
  listMessagesByConversation(conversationId: string): Promise<Message[]>;
  createReview(review: Omit<Review, "id">): Promise<Review>;
  getReview(id: string): Promise<Review | undefined>;
  listReviewsBySubject(subjectUserId: string): Promise<Review[]>;
  listReviewsByAuthor(authorUserId: string): Promise<Review[]>;
  listAllReviews(): Promise<Review[]>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  createReport(report: Omit<Report, "id">): Promise<Report>;
  listReports(): Promise<Report[]>;
  updateReport(id: string, updates: Partial<Report>): Promise<Report | undefined>;

  // Cities
  listCities(): Promise<City[]>;
  getCityBySlug(slug: string): Promise<City | undefined>;
  getCityById(id: string): Promise<City | undefined>;
  createCity(city: Omit<City, "id">): Promise<City>;
  updateCity(id: string, updates: Partial<City>): Promise<City | undefined>;
  deleteCity(id: string): Promise<boolean>;

  // Availability Slots
  createSlot(slot: Omit<AvailabilitySlot, "id" | "created_at" | "updated_at">): Promise<AvailabilitySlot>;
  getSlot(id: string): Promise<AvailabilitySlot | undefined>;
  updateSlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined>;
  deleteSlot(id: string): Promise<boolean>;
  listSlotsByGuide(guideId: string, from?: string, to?: string, status?: string): Promise<AvailabilitySlot[]>;
  listOpenSlots(guideId: string, from?: string, to?: string, duration?: number): Promise<AvailabilitySlot[]>;

  // Blog
  getBlogCategories(): Promise<any[]>;
  getBlogCategoryById(id: string): Promise<any | undefined>;
  getBlogPosts(params?: { category?: string; search?: string; featured?: boolean }): Promise<any[]>;
  getBlogPostBySlug(slug: string): Promise<any | undefined>;
  incrementBlogPostViews(slug: string): Promise<void>;

  seed(data: any): Promise<void>;
  reset(): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    if (client) {
      this.client = client;
    } else {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }

      this.client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }

  async seed(data: any): Promise<void> {
    // Note: This is intentionally empty for now
    // The seed functionality is handled by the seedDatabase function in seed.ts
    // which calls individual storage methods with proper error handling
  }

  async reset(): Promise<void> {
    // Delete in order to respect foreign key constraints
    const tables = [
      "messages",
      "conversations",
      "bookings",
      "reservations",
      "reports",
      "reviews",
      "availability",
      "guide_profiles",
      "traveler_profiles",
      "users",
      "cities"
    ];

    for (const table of tables) {
      const { error } = await this.client.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) {
        console.error(`Error clearing ${table}:`, error);
      }
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting user:", error);
      return undefined;
    }

    return data || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }

    return data || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.client
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      console.error("Full error creating user:", JSON.stringify(error, null, 2));
      console.error("User data:", JSON.stringify(user, null, 2));
      throw new Error(`Error creating user: ${error.message} (${error.code}) - ${error.details || error.hint}`);
    }

    return data;
  }

  async listUsers(): Promise<User[]> {
    const { data, error } = await this.client.from("users").select("*");

    if (error) {
      console.error("Error listing users:", error);
      return [];
    }

    return data || [];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const { data, error } = await this.client
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating user:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Guides
  async getGuideByHandle(handle: string): Promise<GuideProfile | undefined> {
    const { data, error } = await this.client
      .from("guide_profiles")
      .select("*")
      .eq("handle", handle)
      .maybeSingle();

    if (error) {
      console.error("Error getting guide by handle:", error);
      return undefined;
    }

    return data || undefined;
  }

  async getGuideByUid(uid: string): Promise<GuideProfile | undefined> {
    const { data, error } = await this.client
      .from("guide_profiles")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) {
      console.error("Error getting guide by uid:", error);
      return undefined;
    }

    return data || undefined;
  }

  async listGuidesByCity(citySlug: string): Promise<GuideProfile[]> {
    const { data, error } = await this.client
      .from("guide_profiles")
      .select("*")
      .eq("city_slug", citySlug);

    if (error) {
      console.error("Error listing guides by city:", error);
      return [];
    }

    return data || [];
  }

  async listAllGuides(): Promise<GuideProfile[]> {
    const { data, error } = await this.client.from("guide_profiles").select("*");

    if (error) {
      console.error("Error listing all guides:", error);
      return [];
    }

    return data || [];
  }

  async createGuide(guide: GuideProfile): Promise<GuideProfile> {
    const { data, error } = await this.client
      .from("guide_profiles")
      .upsert(guide)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating guide: ${error.message}`);
    }

    return data;
  }

  async updateGuide(uid: string, updates: Partial<GuideProfile>): Promise<GuideProfile | undefined> {
    const { data, error } = await this.client
      .from("guide_profiles")
      .update(updates)
      .eq("uid", uid)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating guide:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Travelers
  async getTravelerByUid(uid: string): Promise<TravelerProfile | undefined> {
    const { data, error } = await this.client
      .from("traveler_profiles")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) {
      console.error("Error getting traveler by uid:", error);
      return undefined;
    }

    return data || undefined;
  }

  async createTraveler(profile: TravelerProfile): Promise<TravelerProfile> {
    const { data, error } = await this.client
      .from("traveler_profiles")
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating traveler: ${error.message}`);
    }

    return data;
  }

  async updateTraveler(uid: string, updates: Partial<TravelerProfile>): Promise<TravelerProfile | undefined> {
    const { data, error } = await this.client
      .from("traveler_profiles")
      .update(updates)
      .eq("uid", uid)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating traveler:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Availability
  async getAvailability(uid: string): Promise<Availability | undefined> {
    const { data, error } = await this.client
      .from("availability")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) {
      console.error("Error getting availability:", error);
      return undefined;
    }

    return data || undefined;
  }

  async createAvailability(avail: Availability): Promise<Availability> {
    const { data, error } = await this.client
      .from("availability")
      .insert(avail)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating availability: ${error.message}`);
    }

    return data;
  }

  // Reservations
  async createReservation(reservation: Omit<Reservation, "id">): Promise<Reservation> {
    const { data, error } = await this.client
      .from("reservations")
      .insert(reservation)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating reservation: ${error.message}`);
    }

    return data;
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    const { data, error } = await this.client
      .from("reservations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting reservation:", error);
      return undefined;
    }

    return data || undefined;
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | undefined> {
    const { data, error } = await this.client
      .from("reservations")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating reservation:", error);
      return undefined;
    }

    return data || undefined;
  }

  async listReservationsByTraveler(travelerId: string): Promise<Reservation[]> {
    const { data, error } = await this.client
      .from("reservations")
      .select("*")
      .eq("traveler_id", travelerId);

    if (error) {
      console.error("Error listing reservations by traveler:", error);
      return [];
    }

    return data || [];
  }

  async listReservationsByGuide(guideId: string): Promise<Reservation[]> {
    const { data, error } = await this.client
      .from("reservations")
      .select("*")
      .eq("guide_id", guideId);

    if (error) {
      console.error("Error listing reservations by guide:", error);
      return [];
    }

    return data || [];
  }

  async listAllReservations(): Promise<Reservation[]> {
    const { data, error } = await this.client.from("reservations").select("*");

    if (error) {
      console.error("Error listing all reservations:", error);
      return [];
    }

    return data || [];
  }

  // Bookings
  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const { data, error } = await this.client
      .from("bookings")
      .insert(booking)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }

    return data;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const { data, error } = await this.client
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting booking:", error);
      return undefined;
    }

    return data || undefined;
  }

  async getBookingByReservation(reservationId: string): Promise<Booking | undefined> {
    const { data, error } = await this.client
      .from("bookings")
      .select("*")
      .eq("reservation_id", reservationId)
      .maybeSingle();

    if (error) {
      console.error("Error getting booking by reservation:", error);
      return undefined;
    }

    return data || undefined;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const { data, error } = await this.client
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating booking:", error);
      return undefined;
    }

    return data || undefined;
  }

  async listAllBookings(): Promise<Booking[]> {
    const { data, error } = await this.client.from("bookings").select("*");

    if (error) {
      console.error("Error listing all bookings:", error);
      return [];
    }

    return data || [];
  }

  // Conversations
  async createConversation(conversation: Omit<Conversation, "id">): Promise<Conversation> {
    const { data, error } = await this.client
      .from("conversations")
      .insert(conversation)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating conversation: ${error.message}`);
    }

    return data;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting conversation:", error);
      return undefined;
    }

    return data || undefined;
  }

  async getConversationByReservation(reservationId: string): Promise<Conversation | undefined> {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .eq("reservation_id", reservationId)
      .maybeSingle();

    if (error) {
      console.error("Error getting conversation by reservation:", error);
      return undefined;
    }

    return data || undefined;
  }

  async listConversationsByUser(userId: string): Promise<Conversation[]> {
    const { data, error } = await this.client
      .from("conversations")
      .select("*")
      .contains("participant_ids", [userId]);

    if (error) {
      console.error("Error listing conversations by user:", error);
      return [];
    }

    return data || [];
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const { data, error } = await this.client
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating conversation:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Messages
  async createMessage(message: Omit<Message, "id">): Promise<Message> {
    const { data, error } = await this.client
      .from("messages")
      .insert(message)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating message: ${error.message}`);
    }

    // Update conversation lastMessageAt
    await this.updateConversation(message.conversationId, {
      lastMessageAt: message.createdAt,
    });

    return data;
  }

  async listMessagesByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error listing messages:", error);
      return [];
    }

    return data || [];
  }

  // Reviews
  async createReview(review: Omit<Review, "id">): Promise<Review> {
    // Remove fields that might not exist in the DB schema if migrations aren't fully applied
    const { editedAt, responseAt, originalText, ...safeReview } = review as any;

    const { data, error } = await this.client
      .from("reviews")
      .insert(safeReview)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating review: ${error.message}`);
    }

    return data;
  }

  async getReview(id: string): Promise<Review | undefined> {
    const { data, error } = await this.client
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting review:", error);
      return undefined;
    }

    return data || undefined;
  }

  async listReviewsBySubject(subjectUserId: string): Promise<Review[]> {
    const { data, error } = await this.client
      .from("reviews")
      .select("*")
      .eq("subject_user_id", subjectUserId)
      .eq("status", "published");

    if (error) {
      console.error("Error listing reviews by subject:", error);
      return [];
    }

    return data || [];
  }

  async listReviewsByAuthor(authorUserId: string): Promise<Review[]> {
    const { data, error } = await this.client
      .from("reviews")
      .select("*")
      .eq("author_user_id", authorUserId);

    if (error) {
      console.error("Error listing reviews by author:", error);
      return [];
    }

    return data || [];
  }

  async listAllReviews(): Promise<Review[]> {
    const { data, error } = await this.client.from("reviews").select("*");

    if (error) {
      console.error("Error listing all reviews:", error);
      return [];
    }

    return data || [];
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const { data, error } = await this.client
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating review:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Reports
  async createReport(report: Omit<Report, "id">): Promise<Report> {
    const { data, error } = await this.client
      .from("reports")
      .insert(report)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating report: ${error.message}`);
    }

    return data;
  }

  async listReports(): Promise<Report[]> {
    const { data, error } = await this.client.from("reports").select("*");

    if (error) {
      console.error("Error listing reports:", error);
      return [];
    }

    return data || [];
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<Report | undefined> {
    const { data, error } = await this.client
      .from("reports")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating report:", error);
      return undefined;
    }

    return data || undefined;
  }

  // Cities
  async listCities(): Promise<City[]> {
    const { data, error } = await this.client
      .from("cities")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error listing cities:", error);
      return [];
    }

    return data || [];
  }

  async getCityBySlug(slug: string): Promise<City | undefined> {
    const { data, error } = await this.client
      .from("cities")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error getting city by slug:", error);
      return undefined;
    }

    return data || undefined;
  }

  async getCityById(id: string): Promise<City | undefined> {
    const { data, error } = await this.client
      .from("cities")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting city by id:", error);
      return undefined;
    }

    return data || undefined;
  }

  async createCity(city: Omit<City, "id" | "created_at">): Promise<City> {
    const { data, error } = await this.client
      .from("cities")
      .upsert(city, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating city: ${error.message}`);
    }

    return data;
  }

  async updateCity(id: string, updates: Partial<City>): Promise<City | undefined> {
    const { data, error } = await this.client
      .from("cities")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating city:", error);
      return undefined;
    }

    return data || undefined;
  }

  async deleteCity(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("cities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting city:", error);
      return false;
    }

    return true;
  }

  // Availability Slots
  async createSlot(slot: Omit<AvailabilitySlot, "id" | "created_at" | "updated_at">): Promise<AvailabilitySlot> {
    const { data, error } = await this.client
      .from("availability_slots")
      .insert(slot)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating slot: ${error.message}`);
    }

    return data;
  }

  async getSlot(id: string): Promise<AvailabilitySlot | undefined> {
    const { data, error } = await this.client
      .from("availability_slots")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting slot:", error);
      return undefined;
    }

    return data || undefined;
  }

  async updateSlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined> {
    const { data, error } = await this.client
      .from("availability_slots")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating slot:", error);
      return undefined;
    }

    return data || undefined;
  }

  async deleteSlot(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("availability_slots")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting slot:", error);
      return false;
    }

    return true;
  }

  async listSlotsByGuide(guideId: string, from?: string, to?: string, status?: string): Promise<AvailabilitySlot[]> {
    let query = this.client
      .from("availability_slots")
      .select("*")
      .eq("guide_id", guideId);

    if (from) {
      query = query.gte("start_time", from);
    }

    if (to) {
      query = query.lte("start_time", to);
    }

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("start_time");

    const { data, error } = await query;

    if (error) {
      console.error("Error listing slots by guide:", error);
      return [];
    }

    return data || [];
  }

  async listOpenSlots(guideId: string, from?: string, to?: string, duration?: number): Promise<AvailabilitySlot[]> {
    let query = this.client
      .from("availability_slots")
      .select("*")
      .eq("guide_id", guideId)
      .eq("status", "open");

    if (from) {
      query = query.gte("start_time", from);
    }

    if (to) {
      query = query.lte("start_time", to);
    }

    if (duration) {
      query = query.eq("duration_hours", duration);
    }

    query = query.order("start_time");

    const { data, error } = await query;

    if (error) {
      console.error("Error listing open slots:", error);
      return [];
    }

    return data || [];
  }

  async getBlogCategories() {
    const { data, error } = await this.client
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error listing blog categories:", error);
      throw new Error(error.message);
    }

    return data || [];
  }

  async getBlogCategoryById(id: string) {
    const { data, error } = await this.client
      .from("blog_categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error getting blog category:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async getBlogPosts(params?: { category?: string; search?: string; featured?: boolean }) {
    let query = this.client
      .from("blog_posts")
      .select("*")
      .eq("status", "published");

    if (params?.category) {
      query = query.eq("category_id", params.category);
    }

    if (params?.featured !== undefined) {
      query = query.eq("featured", params.featured);
    }

    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,excerpt.ilike.%${params.search}%`);
    }

    const { data, error } = await query.order("published_at", { ascending: false });

    if (error) {
      console.error("Error listing blog posts:", error);
      throw new Error(error.message);
    }

    return data || [];
  }

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await this.client
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("Error getting blog post:", error);
      throw new Error(error.message);
    }

    return data;
  }

  async incrementBlogPostViews(slug: string) {
    const { error } = await this.client.rpc("increment_blog_post_views", {
      post_slug: slug,
    });

    if (error) {
      console.error("Error incrementing blog post views:", error);
    }
  }
}

let storageInstance: IStorage | null = null;

export function getStorage(): IStorage {
  if (!storageInstance) {
    storageInstance = new SupabaseStorage();
  }
  return storageInstance;
}

export const storage = new Proxy({} as IStorage, {
  get(_target, prop) {
    const instance = getStorage();
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});
