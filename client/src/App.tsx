import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider } from "@/lib/preferences";
import { ThemeProvider } from "@/lib/theme";
import MainNav from "@/components/layout/MainNav";
import MainFooter from "@/components/layout/MainFooter";
import CookieBanner from "@/components/CookieBanner";

// Eager-loaded pages (main user flows)
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Guides from "@/pages/Guides";
import Cities from "@/pages/Cities";
import CityDetail from "@/pages/CityDetail";
import GuideProfile from "@/pages/GuideProfile";
import DemoLogin from "@/pages/auth/DemoLogin";
import NotFound from "@/pages/not-found";

// Lazy-loaded pages (code-split for better performance)
// Dashboard pages
const TravelerDashboard = lazy(() => import("@/pages/dashboard/TravelerDashboard"));
const GuideDashboard = lazy(() => import("@/pages/dashboard/GuideDashboard"));
const ReservationDetail = lazy(() => import("@/pages/dashboard/ReservationDetail"));
const ProfileEdit = lazy(() => import("@/pages/dashboard/ProfileEdit"));

// Admin pages (only loaded for admins)
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

// Manager pages (only loaded for managers)
const ManagerDashboard = lazy(() => import("@/pages/manager/ManagerDashboard"));
const BlogManager = lazy(() => import("@/pages/manager/BlogManager"));

// Dev tools (only loaded in development)
const DevTools = lazy(() => import("@/pages/dev/DevTools"));

// Content pages (less frequently accessed)
const BecomeGuide = lazy(() => import("@/pages/BecomeGuide"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const Contact = lazy(() => import("@/pages/Contact"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));

// Loading component for lazy-loaded routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Eager-loaded routes (main flows) */}
      <Route path="/" component={Home} />
      <Route path="/guides" component={Guides} />
      <Route path="/cities" component={Cities} />
      <Route path="/explore" component={Explore} />
      <Route path="/cities/:slug" component={CityDetail} />
      <Route path="/guides/:handle" component={GuideProfile} />
      <Route path="/auth/demo-login" component={DemoLogin} />

      {/* Lazy-loaded routes wrapped in Suspense */}
      <Route path="/become-guide">
        <Suspense fallback={<PageLoader />}>
          <BecomeGuide />
        </Suspense>
      </Route>
      <Route path="/help">
        <Suspense fallback={<PageLoader />}>
          <HelpCenter />
        </Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<PageLoader />}>
          <Contact />
        </Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={<PageLoader />}>
          <About />
        </Suspense>
      </Route>
      <Route path="/blog">
        <Suspense fallback={<PageLoader />}>
          <Blog />
        </Suspense>
      </Route>
      <Route path="/blog/:slug">
        <Suspense fallback={<PageLoader />}>
          <BlogPost />
        </Suspense>
      </Route>
      <Route path="/privacy-policy">
        <Suspense fallback={<PageLoader />}>
          <PrivacyPolicy />
        </Suspense>
      </Route>
      <Route path="/terms-of-service">
        <Suspense fallback={<PageLoader />}>
          <TermsOfService />
        </Suspense>
      </Route>
      <Route path="/cookie-policy">
        <Suspense fallback={<PageLoader />}>
          <CookiePolicy />
        </Suspense>
      </Route>

      {/* Dashboard routes (lazy-loaded) */}
      <Route path="/dashboard/traveler">
        <Suspense fallback={<PageLoader />}>
          <TravelerDashboard />
        </Suspense>
      </Route>
      <Route path="/dashboard/guide">
        <Suspense fallback={<PageLoader />}>
          <GuideDashboard />
        </Suspense>
      </Route>
      <Route path="/dashboard/profile">
        <Suspense fallback={<PageLoader />}>
          <ProfileEdit />
        </Suspense>
      </Route>
      <Route path="/reservation/:id">
        <Suspense fallback={<PageLoader />}>
          <ReservationDetail />
        </Suspense>
      </Route>

      {/* Admin routes (lazy-loaded, only for admins) */}
      <Route path="/admin">
        <Suspense fallback={<PageLoader />}>
          <AdminDashboard />
        </Suspense>
      </Route>

      {/* Manager routes (lazy-loaded, only for managers) */}
      <Route path="/manager">
        <Suspense fallback={<PageLoader />}>
          <ManagerDashboard />
        </Suspense>
      </Route>
      <Route path="/manager/blog">
        <Suspense fallback={<PageLoader />}>
          <BlogManager />
        </Suspense>
      </Route>

      {/* Dev tools (lazy-loaded, dev only) */}
      <Route path="/dev/seed">
        <Suspense fallback={<PageLoader />}>
          <DevTools />
        </Suspense>
      </Route>
      <Route path="/dev/reset">
        <Suspense fallback={<PageLoader />}>
          <DevTools />
        </Suspense>
      </Route>

      {/* 404 page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PreferencesProvider>
          <TooltipProvider>


            {/* Main Layout Wrapper */}
            <div className="min-h-screen bg-neutral-50 flex flex-col">
              <MainNav />

              {/* Main Content Area */}
              <main className="flex-1">
                <Router />
              </main>

              <MainFooter />
            </div>

            <CookieBanner />
            <Toaster />
          </TooltipProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
