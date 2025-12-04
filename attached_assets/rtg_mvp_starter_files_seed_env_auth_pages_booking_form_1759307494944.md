Below are copy‑paste ready files for the MVP. Each section starts with a **filepath** comment. Create these files in your Next.js repo (App Router) and adjust imports if needed.

---

## 1) `.env.sample` (pre‑filled for your Firebase project)

```dotenv
# filepath: .env.sample

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENV=local
NEXT_PUBLIC_GA_MEASUREMENT_ID=
SENTRY_DSN=

# Firebase (RainbowTourGuides)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_WEB_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rainbowtourguides-firebaseproj.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rainbowtourguides-firebaseproj
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rainbowtourguides-firebaseproj.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_EMULATORS=1

# Payments (planned)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Email
EMAIL_PROVIDER=resend
EMAIL_FROM=hello@rainbowtourguides.com
RESEND_API_KEY=
SENDGRID_API_KEY=
```

> Copy `.env.sample` → `.env.local` and fill `NEXT_PUBLIC_FIREBASE_API_KEY` with your real key.

---

## 2) `seed/cities.json`

```json
// filepath: seed/cities.json
[
  {
    "id": "barcelona",
    "name": "Barcelona",
    "slug": "barcelona",
    "country": "Spain",
    "timezone": "Europe/Madrid"
  },
  {
    "id": "paris",
    "name": "Paris",
    "slug": "paris",
    "country": "France",
    "timezone": "Europe/Paris"
  },
  {
    "id": "lisbon",
    "name": "Lisbon",
    "slug": "lisbon",
    "country": "Portugal",
    "timezone": "Europe/Lisbon"
  },
  {
    "id": "saigon",
    "name": "Ho Chi Minh City",
    "slug": "saigon",
    "country": "Vietnam",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  {
    "id": "bangkok",
    "name": "Bangkok",
    "slug": "bangkok",
    "country": "Thailand",
    "timezone": "Asia/Bangkok"
  }
]
```

---

## 3) `seed/guides.json` (10 sample guides, 2 per city)

```json
// filepath: seed/guides.json
[
  {
    "handle": "maria-barcelona-1",
    "displayName": "Maria Sánchez",
    "avatarUrl": "https://i.pravatar.cc/150?img=5",
    "city": "Barcelona",
    "citySlug": "barcelona",
    "country": "Spain",
    "timezone": "Europe/Madrid",
    "languages": ["Spanish", "English"],
    "themes": ["Architecture", "Food", "Neighborhoods"],
    "prices": {"h4": 140, "h6": 190, "h8": 240, "currency": "USD"},
    "maxGroupSize": 6,
    "ratingAvg": 4.9,
    "ratingCount": 21,
    "bio": "Local architect turned guide. I love sharing Gaudí gems and hidden tapas bars.",
    "photos": [
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e",
      "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
    ]
  },
  {
    "handle": "joao-barcelona-2",
    "displayName": "João Carvalho",
    "avatarUrl": "https://i.pravatar.cc/150?img=12",
    "city": "Barcelona",
    "citySlug": "barcelona",
    "country": "Spain",
    "timezone": "Europe/Madrid",
    "languages": ["Portuguese", "English", "Spanish"],
    "themes": ["Street Art", "Beaches", "Nightlife"],
    "prices": {"h4": 120, "h6": 170, "h8": 220, "currency": "USD"},
    "maxGroupSize": 4,
    "ratingAvg": 4.7,
    "ratingCount": 14,
    "bio": "Beach lover with a soft spot for Barceloneta and local street art.",
    "photos": [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
    ]
  },
  {
    "handle": "amelie-paris-1",
    "displayName": "Amélie Dubois",
    "avatarUrl": "https://i.pravatar.cc/150?img=47",
    "city": "Paris",
    "citySlug": "paris",
    "country": "France",
    "timezone": "Europe/Paris",
    "languages": ["French", "English"],
    "themes": ["Cafés", "History", "Fashion"],
    "prices": {"h4": 160, "h6": 210, "h8": 260, "currency": "USD"},
    "maxGroupSize": 5,
    "ratingAvg": 4.8,
    "ratingCount": 30,
    "bio": "From Montmartre to Le Marais—curated walks with pastry stops.",
    "photos": [
      "https://images.unsplash.com/photo-1526150902757-58a0f5fbc9cf",
      "https://images.unsplash.com/photo-1522097592-7937f8e1f45e",
      "https://images.unsplash.com/photo-1491555103944-7c647fd857e6"
    ]
  },
  {
    "handle": "luc-paris-2",
    "displayName": "Luc Martin",
    "avatarUrl": "https://i.pravatar.cc/150?img=40",
    "city": "Paris",
    "citySlug": "paris",
    "country": "France",
    "timezone": "Europe/Paris",
    "languages": ["French", "English", "Spanish"],
    "themes": ["Museums", "Riverside", "Photography"],
    "prices": {"h4": 150, "h6": 200, "h8": 250, "currency": "USD"},
    "maxGroupSize": 6,
    "ratingAvg": 4.6,
    "ratingCount": 18,
    "bio": "Former photojournalist—best Seine viewpoints and Louvre shortcuts.",
    "photos": [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    ]
  },
  {
    "handle": "ines-lisbon-1",
    "displayName": "Inês Rocha",
    "avatarUrl": "https://i.pravatar.cc/150?img=15",
    "city": "Lisbon",
    "citySlug": "lisbon",
    "country": "Portugal",
    "timezone": "Europe/Lisbon",
    "languages": ["Portuguese", "English", "Spanish"],
    "themes": ["Tiles", "Fado", "Viewpoints"],
    "prices": {"h4": 110, "h6": 160, "h8": 210, "currency": "USD"},
    "maxGroupSize": 6,
    "ratingAvg": 4.9,
    "ratingCount": 25,
    "bio": "Born and raised in Alfama—scenic hills and secret miradouros.",
    "photos": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
    ]
  },
  {
    "handle": "rafa-lisbon-2",
    "displayName": "Rafa Morgado",
    "avatarUrl": "https://i.pravatar.cc/150?img=32",
    "city": "Lisbon",
    "citySlug": "lisbon",
    "country": "Portugal",
    "timezone": "Europe/Lisbon",
    "languages": ["Portuguese", "English"],
    "themes": ["Food", "Streetcars", "Riverside"],
    "prices": {"h4": 120, "h6": 170, "h8": 220, "currency": "USD"},
    "maxGroupSize": 4,
    "ratingAvg": 4.7,
    "ratingCount": 10,
    "bio": "Gluten-free pastel de nata hunter and tram28 whisperer.",
    "photos": [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1541336032412-2048a678540d"
    ]
  },
  {
    "handle": "anh-saigon-1",
    "displayName": "Anh Nguyen",
    "avatarUrl": "https://i.pravatar.cc/150?img=8",
    "city": "Ho Chi Minh City",
    "citySlug": "saigon",
    "country": "Vietnam",
    "timezone": "Asia/Ho_Chi_Minh",
    "languages": ["Vietnamese", "English"],
    "themes": ["Street Food", "Markets", "History"],
    "prices": {"h4": 90, "h6": 130, "h8": 170, "currency": "USD"},
    "maxGroupSize": 6,
    "ratingAvg": 4.8,
    "ratingCount": 19,
    "bio": "District 1 native—pho diplomacy and motorbike etiquette included.",
    "photos": [
      "https://images.unsplash.com/photo-1558981285-6f0c94958bb6",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef"
    ]
  },
  {
    "handle": "linh-saigon-2",
    "displayName": "Linh Tran",
    "avatarUrl": "https://i.pravatar.cc/150?img=14",
    "city": "Ho Chi Minh City",
    "citySlug": "saigon",
    "country": "Vietnam",
    "timezone": "Asia/Ho_Chi_Minh",
    "languages": ["Vietnamese", "English", "French"],
    "themes": ["Coffee", "Colonial", "Rooftops"],
    "prices": {"h4": 100, "h6": 150, "h8": 200, "currency": "USD"},
    "maxGroupSize": 5,
    "ratingAvg": 4.6,
    "ratingCount": 9,
    "bio": "Third-wave coffee nerd guiding you through hidden cafes.",
    "photos": [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
    ]
  },
  {
    "handle": "narin-bangkok-1",
    "displayName": "Narin Chai",
    "avatarUrl": "https://i.pravatar.cc/150?img=58",
    "city": "Bangkok",
    "citySlug": "bangkok",
    "country": "Thailand",
    "timezone": "Asia/Bangkok",
    "languages": ["Thai", "English"],
    "themes": ["Temples", "Canals", "Night Markets"],
    "prices": {"h4": 95, "h6": 140, "h8": 185, "currency": "USD"},
    "maxGroupSize": 6,
    "ratingAvg": 4.7,
    "ratingCount": 22,
    "bio": "Canal boat routes and temple etiquette—skip the lines and the scams.",
    "photos": [
      "https://images.unsplash.com/photo-1506976785307-8732e854ad75",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c"
    ]
  },
  {
    "handle": "pim-bangkok-2",
    "displayName": "Pim Suksawat",
    "avatarUrl": "https://i.pravatar.cc/150?img=65",
    "city": "Bangkok",
    "citySlug": "bangkok",
    "country": "Thailand",
    "timezone": "Asia/Bangkok",
    "languages": ["Thai", "English", "Chinese"],
    "themes": ["Food", "Floating Markets", "Rooftops"],
    "prices": {"h4": 110, "h6": 160, "h8": 210, "currency": "USD"},
    "maxGroupSize": 4,
    "ratingAvg": 4.8,
    "ratingCount": 11,
    "bio": "Bangkok-born foodie with a weakness for mango sticky rice.",
    "photos": [
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"
    ]
  }
]
```

---

## 4) Firebase client helper (needed by Auth/Booking)

```ts
// filepath: src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
};

const app = getApps().length ? getApps()[0] : initializeApp(config);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 5) Auth pages scaffold (Next.js App Router + shadcn/ui)

```tsx
// filepath: app/(auth)/signin/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button"; // shadcn/ui
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function onGoogle() {
    setLoading(true); setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>
      <form onSubmit={onEmailSignIn} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading?"Signing in...":"Sign in"}</Button>
      </form>
      <div className="my-4 text-center text-sm text-muted-foreground">or</div>
      <Button variant="outline" className="w-full" onClick={onGoogle}>Continue with Google</Button>
      <p className="mt-6 text-sm">No account? <Link className="underline" href="/signup">Create one</Link></p>
    </div>
  );
}
```

```tsx
// filepath: app/(auth)/signup/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"traveler"|"guide">("traveler");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      // TODO: write role + basic profile doc to Firestore here
      router.push("/dashboard");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>
      <form onSubmit={onSignUp} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <div className="space-x-4">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" value="traveler" checked={role==='traveler'} onChange={()=>setRole('traveler')} /> Traveler
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="role" value="guide" checked={role==='guide'} onChange={()=>setRole('guide')} /> Local Guide
          </label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading?"Creating...":"Create account"}</Button>
      </form>
      <p className="mt-6 text-sm">Already have an account? <Link className="underline" href="/signin">Sign in</Link></p>
    </div>
  );
}
```

---

## 6) BookingForm component skeleton (multi‑day, min‑lead validation)

```tsx
// filepath: src/components/booking/BookingForm.tsx
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase";

type Session = { date: string; startTime: string; durationHours: 4|6|8 };

type Props = {
  guideId: string;
  guideTimezone: string;
  minLeadHours?: number; // default 24
  onSubmitted?: (reservationId: string) => void;
};

export default function BookingForm({ guideId, guideTimezone, minLeadHours = 24, onSubmitted }: Props) {
  const [duration, setDuration] = useState<4|6|8>(4);
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [startTime, setStartTime] = useState(""); // HH:mm
  const [sessions, setSessions] = useState<Session[]>([]);
  const [itinerary, setItinerary] = useState("");
  const [meetingPref, setMeetingPref] = useState<"guide_default"|"traveler_accommodation">("guide_default");
  const [travelerAddress, setTravelerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  function addSession() {
    if (!date || !startTime) return;
    const s: Session = { date, startTime, durationHours: duration };
    setSessions(prev => [...prev, s]);
    setDate(""); setStartTime("");
  }

  function removeSession(idx: number) {
    setSessions(prev => prev.filter((_, i) => i !== idx));
  }

  function isLeadTimeOK(d: string, t: string) {
    // Minimal check in local timezone; server should re‑validate
    const start = new Date(`${d}T${t}:00`);
    const now = new Date();
    const diffH = (start.getTime() - now.getTime()) / (1000*60*60);
    return diffH >= minLeadHours;
    // TODO: guideTimezone-aware check on server
  }

  async function submit() {
    try {
      setLoading(true); setError(null);
      const user = auth.currentUser;
      if (!user) throw new Error("Please sign in to request a booking.");
      if (sessions.length === 0) throw new Error("Add at least one session.");
      if (!sessions.every(s => isLeadTimeOK(s.date, s.startTime))) throw new Error(`Sessions must be at least ${minLeadHours}h in advance.`);

      const reservation = {
        travelerId: user.uid,
        guideId,
        status: "pending",
        currency: "USD", // display only in MVP
        travelerFeePct: 0.10,
        platformCommissionPct: 0.25,
        platformCommissionMinUsd: 25,
        total: 0, // server will compute later
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const resRef = await addDoc(collection(db, "reservations"), reservation);
      await addDoc(collection(db, "bookings"), {
        reservationId: resRef.id,
        travelerId: user.uid,
        guideId,
        sessions, // denormalized for MVP; could be 1 doc per session too
        meeting: { type: meetingPref, address: travelerAddress || null },
        itineraryNote: itinerary.substring(0, 500),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      onSubmitted?.(resRef.id);
      setSessions([]); setItinerary(""); setTravelerAddress("");
      alert("Booking request sent! The guide will review and accept/decline.");
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Duration</label>
        <select className="border rounded px-3 py-2" value={duration} onChange={e=>setDuration(Number(e.target.value) as 4|6|8)}>
          <option value={4}>4 hours</option>
          <option value={6}>6 hours</option>
          <option value={8}>8 hours</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Start time</label>
          <input type="time" className="w-full border rounded px-3 py-2" value={startTime} onChange={e=>setStartTime(e.target.value)} />
        </div>
      </div>
      <button type="button" className="border rounded px-3 py-2" onClick={addSession}>Add session</button>

      {sessions.length > 0 && (
        <div className="rounded border p-3">
          <div className="font-medium mb-2">Sessions</div>
          <ul className="space-y-1">
            {sessions.map((s, i) => (
              <li key={`${s.date}-${s.startTime}-${i}`} className="flex items-center justify-between text-sm">
                <span>{s.date} at {s.startTime} • {s.durationHours}h</span>
                <button className="underline" onClick={()=>removeSession(i)}>remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Meeting preference</label>
        <select className="border rounded px-3 py-2" value={meetingPref} onChange={e=>setMeetingPref(e.target.value as any)}>
          <option value="guide_default">Guide's default meetup</option>
          <option value="traveler_accommodation">Traveler accommodation (enter address)</option>
        </select>
      </div>
      {meetingPref === "traveler_accommodation" && (
        <input className="w-full border rounded px-3 py-2" placeholder="Accommodation address" value={travelerAddress} onChange={e=>setTravelerAddress(e.target.value)} />
      )}

      <div>
        <label className="block text-sm mb-1">Itinerary note (optional, 500 chars)</label>
        <textarea className="w-full border rounded px-3 py-2" rows={4} value={itinerary} onChange={e=>setItinerary(e.target.value)} maxLength={500} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button disabled={loading} onClick={submit} className="w-full rounded-xl bg-black text-white py-2 hover:opacity-90">
        {loading ? "Sending..." : "Request booking"}
      </button>
    </div>
  );
}
```

---

## 7) Health check route (for Replit deployment)

```ts
// filepath: app/api/healthz/route.ts
export async function GET() {
  return new Response("ok", { status: 200 });
}
```

---

### Notes
- Auth pages assume shadcn `Button` exists; if not, swap to a plain `<button>`.
- BookingForm writes to `reservations` + `bookings` as described in the PRD. A server function should later re‑validate availability and compute totals.
- Seed JSON is safe to import into a dev‑only script to populate `guideProfiles`, `availability`, and `reviews`.

