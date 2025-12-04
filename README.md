# Rainbow Tour Guides

LGBTQ+ friendly tour guide marketplace connecting travelers with local guides.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Express, Node.js
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.sample .env
   # Edit .env and add your Supabase credentials
   ```

   Required environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (default: localhost:5000,localhost:5173)
   - `NODE_ENV` - Set to `production` in production, `development` locally

3. **Run development server:**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

4. **Type checking:**
   ```bash
   npm run check
   # Currently: 25 non-critical errors remaining
   ```

5. **Build for production:**
   ```bash
   npm run build
   # Creates dist/ folder with optimized assets
   ```

6. **Start production server:**
   ```bash
   npm start
   ```

## Features

- Browse LGBTQ+ friendly tour guides
- City-based guide discovery
- Real-time booking system
- User dashboards for travelers and guides
- Review and rating system
- Responsive design with brand styling

## Brand Colors

- Primary Orange: `#F28E3D`
- Accent Purple: `#6C5CE7`
- Supporting: Teal, Pink, Lime

## Recent Improvements (December 2025)

✅ **Phase 1-3 Completed** - See `CLEANUP_SUMMARY.md` for details

- **TypeScript Errors**: Reduced from 79 to 25 (68% improvement)
- **Security**: Added helmet, CORS, rate limiting, environment guards
- **Dependencies**: Removed 7 unused packages (18 total with sub-dependencies)
- **Build**: Still passing (10.8s)

### Security Features
- HTTP security headers via Helmet
- CORS protection with origin whitelist
- Rate limiting (100 requests/15min in production)
- Dev-only endpoints protected in production

### Documentation
- `CODEBASE_AUDIT_AND_PLAN.md` - Comprehensive audit and roadmap (988 lines)
- `CLEANUP_SUMMARY.md` - Execution summary of completed work
- `Brand Style Guide For Rainbow Tour Guides.md` - Design reference

## Project Stats

- **Files**: 116 TypeScript/JavaScript files
- **Components**: 58 React components
- **Pages**: 31 page components
- **Dependencies**: 75 production packages
- **Build Time**: ~10.8 seconds
- **Bundle Size**: 890 KB JS (238 KB gzipped), 93 KB CSS
