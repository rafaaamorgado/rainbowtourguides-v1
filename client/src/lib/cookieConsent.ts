export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CONSENT_KEY = "rtg_cookie_consent";
const CONSENT_VERSION = "1.0";

export interface ConsentData {
  version: string;
  timestamp: number;
  preferences: CookiePreferences;
}

export function getDefaultPreferences(): CookiePreferences {
  return {
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  };
}

export function hasConsented(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return !!stored;
  } catch {
    return false;
  }
}

export function getConsent(): ConsentData | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setConsent(preferences: CookiePreferences): void {
  try {
    const data: ConsentData = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      preferences,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));

    // Apply preferences immediately
    applyPreferences(preferences);
  } catch (error) {
    console.error("Failed to save cookie preferences:", error);
  }
}

export function acceptAllCookies(): void {
  setConsent({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

export function rejectAllCookies(): void {
  setConsent(getDefaultPreferences());
}

export function clearConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch (error) {
    console.error("Failed to clear consent:", error);
  }
}

function applyPreferences(preferences: CookiePreferences): void {
  // Initialize or remove Google Analytics based on consent
  if (preferences.analytics) {
    initializeGoogleAnalytics();
  } else {
    removeGoogleAnalytics();
  }

  // Initialize or remove marketing cookies
  if (preferences.marketing) {
    initializeMarketingTools();
  } else {
    removeMarketingTools();
  }
}

function initializeGoogleAnalytics(): void {
  // Check if GA is already loaded
  if (typeof window.gtag === 'function') return;

  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) return;

  // Create script tag for Google Analytics
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });
}

function removeGoogleAnalytics(): void {
  // Remove GA scripts
  const scripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
  scripts.forEach(script => script.remove());

  // Clear dataLayer
  if (window.dataLayer) {
    window.dataLayer = [];
  }

  // Remove gtag function
  if (typeof window.gtag === 'function') {
    (window as any).gtag = undefined;
  }

  // Remove GA cookies
  const gaCookies = document.cookie.split(";").filter(cookie =>
    cookie.trim().startsWith("_ga") || cookie.trim().startsWith("_gid")
  );
  gaCookies.forEach(cookie => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

function initializeMarketingTools(): void {
  // Placeholder for marketing tools initialization
  // Add Facebook Pixel, LinkedIn Insight Tag, etc. as needed
  console.log("Marketing tools initialized");
}

function removeMarketingTools(): void {
  // Placeholder for marketing tools removal
  // Remove marketing pixels and clear their cookies
  console.log("Marketing tools removed");
}

// Type declarations for global window properties
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
