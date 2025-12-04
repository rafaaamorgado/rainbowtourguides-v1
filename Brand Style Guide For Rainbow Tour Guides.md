# Brand Style Guide – Rainbow Tour Guides

# **Brand Style Guide – Rainbow Tour Guides**

*A comprehensive design, UI, UX, and development system for building a modern, cinematic, adventure-focused travel platform using React, Next.js, TypeScript, TailwindCSS, shadcn/ui, and optional DaisyUI/MUI components.*

---

## **1. Brand Essence**

### **1.1 Brand Identity Keywords**

> warm, cinematic, adventurous, trustworthy, human, modern, glassy, minimal, premium, calm, mobile-first, clean, airy
> 

These keywords drive all UI design, copy tone, layout decisions, color choices, and component styling.

### **1.2 Visual North Star**

Inspired by the reference screenshots, the brand aesthetic is defined by:

- Heroic scenic photography
- Clean white layouts with high whitespace
- Glassmorphism elements (Apple liquid glass style)
- Soft shadows, rounded geometry, calm typography
- Clear information hierarchy
- Highly responsive mobile-first layouts
- Friendly, human-centered components (guide cards, messaging UI)

---

## **2. Core Experience**

### **2.1 Primary Website Types**

1. **Marketing Website**
    - Hero section + booking widget
    - Tour packages
    - Documentation/photos/videos
    - Testimonials
    - “How it Works” steps
    - Email capture + footer
2. **Booking Flow**
    - Destination/date picker
    - Package selector
    - Add-ons (photographer/transport/etc.)
    - Payment confirmation
3. **Guide Discovery & Messaging**
    - Guide cards
    - Guide profiles
    - Chat interface
    - Voice/Video call UI (optional)

---

## **3. Layout & Composition System**

### **3.1 Grid & Structure**

| Element | Setting |
| --- | --- |
| Max Width | **1200–1280px** |
| Grid | **12-column responsive grid** |
| Page Padding | `px-4` mobile, `px-6` tablet, `px-10` desktop |
| Section Spacing | `py-16` mobile, `py-24` desktop |
| Card Spacing | `p-4` mobile, `p-6` desktop |

### **3.2 Spacing Scale (Tailwind-Friendly)**

Use these spacing increments for consistency:

```
4, 6, 8, 12, 16, 20, 24, 32, 40, 48

```

### **3.3 Visual Rhythm**

- Heavy whitespace around titles
- Alternating light/dark sections
- Card-first organization
- Carousels with rounded corners
- Sticky components (nav, booking bar) use glass surfaces

---

## **4. Color System**

### **4.1 Core Palette**

| Token | Hex | Usage |
| --- | --- | --- |
| `primary-500` | **#F28E3D** | Main CTA, highlights |
| `primary-600` | **#E0671D** | Hover, active |
| `accent-500` | **#6C5CE7** | Secondary CTA, filters, brand flourish |
| `neutral-50` | **#F9FAFB** | Background |
| `neutral-200` | **#E5E7EB** | Borders, dividers |
| `neutral-700` | **#374151** | Body text secondary |
| `neutral-800` | **#1F2933** | Dark panels |
| `neutral-900` | **#111827** | Primary text |
| `glass-white` | White @ 0.8 opacity + blur | Nav, booking bar |

### **4.2 Semantic Colors**

- `success-500` – #10B981
- `warning-500` – #F59E0B
- `danger-500` – #EF4444
- `info-500` – #3B82F6

### **4.3 Tailwind Config Extension**

```tsx
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#FFF5EB',
        100: '#FFE7D3',
        300: '#F8B066',
        500: '#F28E3D',
        600: '#E0671D',
        700: '#B14C15',
      },
      accent: {
        500: '#6C5CE7',
      },
      neutral: {
        50: '#F9FAFB',
        200: '#E5E7EB',
        700: '#374151',
        800: '#1F2933',
        900: '#111827',
      },
      success: { 500: '#10B981' },
      warning: { 500: '#F59E0B' },
      danger: { 500: '#EF4444' },
      info: { 500: '#3B82F6' },
    },
    borderRadius: {
      lg: '1rem',
      xl: '1.5rem',
      '2xl': '2rem',
      full: '9999px',
    },
    boxShadow: {
      soft: '0 18px 45px rgba(15,23,42,0.15)',
      glass: '0 18px 55px rgba(15,23,42,0.25)',
    },
    backdropBlur: {
      glass: '18px',
    },
    maxWidth: {
      content: '1200px',
    },
  },
}

```

---

## **5. Typography System**

### **5.1 Typeface Families**

- **Primary Sans**: Inter *(UI, layout, buttons, forms)*
- **Display Serif**: DM Serif Display *(highlighted words in hero titles)*

### **5.2 Type Hierarchy**

| Level | Size | Weight | Notes |
| --- | --- | --- | --- |
| H1 | 48–64px | `extrabold` | Hero |
| H2 | 32–40px | `bold` | Section titles |
| H3 | 24–28px | `semibold` | Card titles, subheads |
| Body L | 18px | `normal` | Descriptive text |
| Body M | 16px | — | Paragraph copy |
| Caption | 13–14px | `medium` | Tags, labels |

### **5.3 Styling Rules**

- Consistent left-aligned long-form; centered for hero & section headers
- Highlight key nouns in serif (`Sunrise Tour`, `Adventure`)
- Always maintain high contrast: dark text on light, white text on dark/glass

---

## **6. Surfaces — Light, Dark & Glass**

### **6.1 Light Surfaces**

```
bg-neutral-50
border-neutral-200/60
shadow-soft

```

### **6.2 Dark Surfaces (Footers, Packages)**

```
bg-neutral-900
text-neutral-50
border-neutral-800

```

### **6.3 Glassmorphism (Apple-Style Liquid Glass)**

Use for:

- Navbar on scroll
- Booking bar
- Floating CTAs

```html
<div class="bg-white/80 backdrop-blur-glass border border-white/40 shadow-glass rounded-2xl">

```

---

## **7. Component System**

Below is a canonical list of components used across the site.

### **7.1 Navigation**

### **Desktop**

- Transparent over hero
- Becomes glass + blurred when scrolling
- Right-aligned CTA “Book Now”

### **Mobile**

- Hamburger menu
- Full-screen sheet using shadcn/ui `Sheet`

---

### **7.2 Hero Section**

**Structure:**

1. **Left Column**
    - Label chip (e.g., “Experience the Magic of East Java”)
    - H1 with serif accent
    - Subtext (max width ~520px)
    - Avatars + people joined
    - Primary CTA (solid)
    - Secondary CTA (ghost)
2. **Right Column**
    - Carousel of cards with rounded geometry (2xl)

---

### **7.3 Booking Bar**

Floating, glass, 4–5 fields:

- Destination select
- Arrival
- Departure
- Guests
- CTA “Book Now”

Responsive:

- Desktop → horizontal
- Mobile → stacked

---

### **7.4 Tour Package Carousel**

- Filter pills (chips) for type: Trekking, Jeep, etc.
- Horizontal scroll with snap points
- Cards with:
    - Large image
    - Short description
    - Arrow button

---

### **7.5 Pricing Section**

Dark background with 3–4 asymmetrical cards:

- Price
- Package name
- Key bullet points
- CTA

The center card is featured with white background + elevation.

---

### **7.6 “How to Book” Steps**

4 columns:

```
01. Choose Package
02. Confirm Availability
03. Make Reservation
04. Receive Confirmation

```

Minimalist grid with plenty of whitespace.

---

### **7.7 Documentation Section**

- Testimonial card
- Chips for inclusions
- Video card + photo card
- Light, calm layout

---

### **7.8 Footer**

Dark section with:

- Email subscription bar (rounded pill with border)
- Navigation columns
- Social icons (outline style)

---

## **8. Guide & Messaging App System**

### **8.1 Guide Cards**

- Avatar large
- Stats row (experience, country flag, rating)
- Buttons: Message / Call

### **8.2 Guide Profile**

- Header with background image
- Centered circular avatar
- “Send Message” and “Call Now” buttons
- Tips / bio section

### **8.3 Chat Interface**

- User messages: right-aligned, primary color
- Guide messages: left, white border
- Input bar: pill-shaped with icons

Use subtle haptic behavior when possible.

---

## **9. Motion System**

### **9.1 Transitions**

- `transition-all duration-300`
- Curved easing: cubic-bezier(0.16, 1, 0.3, 1)

### **9.2 Buttons**

- Hover: elevate + slight upshift
- Pressed: reduced shadow + slight downward shift

### **9.3 Cards**

- Hover scale: `scale-[1.02]`
- Shadow softening/intensification

### **9.4 Carousels**

- Natural momentum scrolling
- Snap on mobile

---

## **10. Component Libraries**

### **shadcn/ui (Primary Choice)**

Use for:

- Button
- Card
- Tabs
- Dialog
- Input
- Select
- Sheet
- Tooltip
- Badge

All shadcn components must be re-themed using brand Tailwind tokens.

### **DaisyUI (Optional)**

Use only for:

- Carousels
- Steps

Override DaisyUI colors to match brand palette.

### **Material UI (Optional)**

Use for:

- Admin/dashboard tools
- Never for public-facing landing pages

---