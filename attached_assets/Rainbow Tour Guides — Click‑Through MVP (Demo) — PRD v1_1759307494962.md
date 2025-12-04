# **Rainbow Tour Guides — Click‑Through MVP (Demo) — PRD v1**

**Project**: rainbowtourguides.com  
**Status**: Approved for build

**Purpose**: Produce a navigable, demo‑ready MVP you can click through **without integrating any external services** (no Firebase/Auth, no Stripe/PayPal, no email). All state is served by a **Mock Service Layer** inside the Next.js app. The data model and UI mirror the real product so we can swap in real adapters later with minimal rework.

**AI Working Agreement** (paste as system prompt for Replit Agent):  
Treat this PRD as canonical. Implement a **demo‑mode** Next.js app with a **mock backend** and seed data. Do not call external services. Build the flows end‑to‑end with in‑app persistence and feature flags so later we can replace the mock layer with Firebase/Stripe adapters. Always: produce `.env.sample`, `TASKLIST.md`, `CHANGELOG.md`, seed scripts, and minimal tests. Ask questions only if required; otherwise proceed.

---

## **0\) Scope & Goals**

* **In‑scope** (clickable today):  
  * Public pages: Landing, Explore, City `/cities/{slug}`, Guide profile `/guides/{handle}`  
  * Auth (demo): Sign up / Sign in using **DemoAuth** (localStorage) \+ role picker (Traveler or Guide)  
  * Traveler flow: request booking (4/6/8h), multi‑day sessions, itinerary note, meeting preference  
  * Guide flow: see **pending** requests → Accept/Decline; on **Accept** open **Conversation** thread  
  * Reviews: after admin toggles booking to "completed", each side can leave one review (mocked)  
  * Admin console (demo): tables for Users/Guides/Bookings/Reviews; verify/ban; mark completed; fake refund action; moderation  
  * Search/filters (client/SSR over seed): by duration, languages, themes, rating, "available on date"  
  * SEO basics: per‑page `<meta>`, `sitemap.xml` \+ `robots.txt` from seed  
* **Out‑of‑scope** (stubbed): real authentication, emails, payments, KYC, real‑time presence, App Check, Firestore rules.  
* **KPI for demo**: click-through of the core journey (Explore → Guide → Request → Guide Accept → Conversation) with believable data and visuals.

---

## **1\) Tech Stack (Demo Mode)**

* **Next.js 14** (App Router, TypeScript) \+ **Tailwind CSS** \+ **shadcn/ui**  
* **Mock Service Layer** (`src/mock/`)  
  * `db.json` persisted under `.tmp/mockdb.json` (file‑based) with graceful fallback to in‑memory store if FS is unavailable.  
  * **Repository functions** (`src/mock/repo/*`) for users, guides, availability, reservations/bookings, conversations/messages, reviews, reports.  
  * **Adapters**: `DataProvider` interface with two implementations: `MockProvider` (now) and `FirebaseProvider` (later). Keep method signatures consistent with future real API.  
* **Route Handlers (Next.js)** under `app/api/*` simulate REST endpoints. Client calls these via `fetch`. No external network calls.  
* **State**: React Query (or simple fetch hooks) for data fetching/mutation.  
* **Env flags**: `.env`  
  * `NEXT_PUBLIC_ENV=demo`  
  * `NEXT_PUBLIC_DEMO_MODE=1`

---

## **2\) Information Architecture & Pages**

**Public**

* `/` Landing (hero, city search, value props, CTA: Explore cities / Become a Guide)  
* `/explore` browse/filters  
* `/cities/{slug}` SSR list of guides for city; filters \+ sort  
* `/guides/{handle}` guide profile: photos, bio, languages, themes, prices (4/6/8), availability preview, reviews, CTA: Request booking  
* `/blog` (optional stub)  
* `/help`, `/legal/{tos|privacy|refund|community}`

**App (auth required, demo auth)**

* `/dashboard` role‑aware landing  
* `/dashboard/traveler` bookings (pending/accepted/past), messages, profile  
* `/dashboard/guide` requests/accepted calendar, messages, profile editor, availability  
* `/reservation/{id}` detail \+ conversation thread

**Admin (demo)**

* `/admin` overview  
* `/admin/users`, `/admin/guides`, `/admin/bookings`, `/admin/reviews`, `/admin/reports`

**Utilities**

* `/api/healthz` (200 OK)  
* `/dev/seed` (dev only) write seed data to mockdb

---

## **3\) UX & Visual System**

* Keep the preview site’s feel: inclusive, modern, rainbow accents.  
* **Fonts**: Inter (UI), Source Serif Pro (headings).  
* **Components**: Nav, Footer, CitySearch, GuideCard, AvailabilityPreview, BookingForm, ChatThread, ReviewList, RoleGate, EmptyState, Spinner.  
* **Accessibility**: WCAG‑AA contrast, keyboard navigable, visible focus ring, `aria-*` labels.

---

## **4\) Data Model (TypeScript Interfaces)**

```ts
// src/types.ts
export type Role = 'traveler'|'guide'|'admin'|'support'|'moderator';
export interface User { id: string; email?: string; role: Role; displayName: string; avatarUrl?: string; }
export interface TravelerProfile { uid: string; displayName: string; avatarUrl?: string; homeCountry?: string; preferredLanguage?: string; bio?: string; ratingAvg?: number; ratingCount?: number; }
export interface GuideProfile {
  uid: string; handle: string; displayName: string; avatarUrl?: string; city: string; citySlug: string; country: string; timezone: string;
  bio: string; languages: string[]; themes: string[]; photos: string[];
  prices: { h4:number; h6:number; h8:number; currency:'USD'|'EUR'|'LOCAL' };
  maxGroupSize: number; ratingAvg: number; ratingCount: number; verified?: boolean;
  meetupPref: { type:'guide_default'|'traveler_accommodation'; defaultLocation?: string };
}
export interface Availability { uid: string; weekly: Record<string,string[]>; blackouts: string[]; leadHoursMin: number; }
export type BookingStatus = 'pending'|'accepted'|'cancelled'|'completed'|'refunded';
export interface Reservation { id: string; travelerId: string; guideId: string; status: BookingStatus; currency: string; subtotal: number; travelerFeePct: number; platformCommissionPct: number; platformCommissionMinUsd: number; total: number; createdAt: string; updatedAt: string; }
export interface BookingSession { date: string; startTime: string; durationHours: 4|6|8; }
export interface Booking { id: string; reservationId: string; travelerId: string; guideId: string; sessions: BookingSession[]; meeting: { type:string; address?: string|null }; itineraryNote?: string; status: Exclude<BookingStatus,'refunded'>; createdAt: string; }
export interface Conversation { id: string; reservationId: string; participantIds: string[]; createdAt: string; lastMessageAt?: string; }
export interface Message { id: string; senderId: string; text: string; createdAt: string; }
export interface Review { id: string; subjectUserId: string; authorUserId: string; reservationId: string; rating: 1|2|3|4|5; text: string; responseText?: string; status: 'published'|'hidden'|'reported'; createdAt: string; }
export interface Report { id: string; type: 'profile'|'review'|'message'; targetId: string; reason: string; reporterId: string; status: 'open'|'closed'; createdAt: string; resolvedBy?: string; resolutionNote?: string; }
```

---

## **5\) Mock Service Layer**

* **Storage file**: `.tmp/mockdb.json` with shape `{ users, travelerProfiles, guideProfiles, availability, reservations, bookings, conversations, messages, reviews, reports }`.  
* **Repo functions** (`src/mock/repo/*.ts`): `listCities()`, `listGuidesByCity(slug, filters)`, `getGuide(handle)`, `createReservation(...)`, `respondReservation(...)`, `getUserReservations(uid)`, `getGuideRequests(uid)`, `createConversation(...)`, `postMessage(...)`, `createReview(...)`, `moderateReview(...)`, etc.  
* **API routes**: `app/api/*.ts` call repo functions and return JSON. All operations mutate `.tmp/mockdb.json` for persistence during the session.  
* **Auth (DemoAuth)**: `/api/auth/login` accepts `{role, displayName}` and returns a fake user with `id` (uuid). Client stores it in `localStorage`. A `RoleGate` component protects routes client‑side. (For demo only, not secure.)

---

## **6\) Features & Acceptance Criteria**

### **6.1 Discovery & City pages**

* City typeahead and landing grid.  
* Filters: duration, languages, themes, rating, available on date.  
  **AC**: City page loads SSR from seed; filters work client‑side; empty state shows suggestions.

### **6.2 Guide profile**

* Photos gallery; about; languages; themes; prices; availability preview (read‑only); reviews list.  
  **AC**: CTA opens BookingForm with the guide selected.

### **6.3 Booking request (demo)**

* Multi‑day sessions; 24h lead‑time validation (client) using guide timezone; itinerary note; meeting preference.  
* On submit: create `reservation(pending)` \+ `booking(pending)`; show confirmation page.  
  **AC**: Data is visible in Traveler Dashboard (Pending tab).

### **6.4 Guide response (demo)**

* Guide Dashboard shows pending requests; Accept or Decline. Accept → reservation `accepted`, creates **Conversation**.  
  **AC**: Conversation thread opens; traveler sees it in Dashboard. Decline → status `cancelled`.

### **6.5 Messaging (demo)**

* Text only; participants can send/read; timestamps; no attachments.  
  **AC**: Message appears instantly and persists in `.tmp/mockdb.json`.

### **6.6 Reviews (demo)**

* Admin marks reservation `completed`. Then each side can post one review; owner can respond; users can report.  
  **AC**: Review displays on guide profile; report sets status `reported` and appears in admin moderation queue.

### **6.7 Admin console (demo)**

* Tables for Users/Guides/Bookings/Reviews/Reports; actions write to `auditLogs` (optional) or console.  
  **AC**: Protected by RoleGate; in demo, a toggle on `/admin` lets you assume `admin`.

### **6.8 SEO & Sitemap**

* `robots.txt` allowing public pages, disallowing `/admin`, `/api`, `/dashboard`.  
* `sitemap.xml` includes seed cities and guide profile URLs.

---

## **7\) Non‑Functional**

* **Performance**: LCP \< 2.5s with seeded content; Next/Image for photos; static generation for city pages with ISR.  
* **Accessibility**: keyboard nav, aria labels, focus states; forms have labels and error text.  
* **Reliability**: healthcheck `/api/healthz`; graceful fallback to in‑memory store if file write fails.  
* **Privacy**: demo banner stating “Demo build — no real accounts or payments.”

---

## **8\) Seed Data**

* Use the existing `seed/cities.json` and `seed/guides.json` (10 guides across 5 cities).  
* Generate 3 sample reviews per guide (randomized ratings, plausible text).  
* Provide two demo users: **Traveler Demo** and **Guide Demo**.

---

## **9\) File/Folder Expectations**

```
app/
  (public pages)
  (auth)/signin, (auth)/demo-login
  (dashboard)/traveler, (dashboard)/guide
  reservation/[id]/page.tsx
  admin/*
  api/
    healthz/route.ts
    auth/login/route.ts
    cities/[slug]/guides/route.ts
    guides/[handle]/route.ts
    bookings/request/route.ts
    bookings/[id]/respond/route.ts
    conversations/[id]/messages/route.ts
public/
  robots.txt, sitemap.xml (or generated)
src/
  types.ts
  mock/
    db.ts (load/save .tmp/mockdb.json)
    repo/*.ts
  components/
    CitySearch, GuideCard, BookingForm, ChatThread, RoleGate, ...
  lib/
    currency.ts, date.ts, seed.ts
.tmp/mockdb.json (created at runtime)
seed/cities.json, seed/guides.json
.env.sample, TASKLIST.md, CHANGELOG.md
```

