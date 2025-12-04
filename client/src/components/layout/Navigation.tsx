import { useState } from "react";
import { Link, useLocation } from "wouter";
import { getUser, clearUser } from "@/lib/auth";
import { supabaseSignOut } from "@/lib/supabaseAuth";
import { usePreferences, LANGUAGE_NAMES, CURRENCY_SYMBOLS, type Language, type Currency } from "@/lib/preferences";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";
import logoPath from "@assets/RAINBOW TOUR GUIDES V1 Short (2)_1759319454583.png";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const user = getUser();
  const { toast } = useToast();
  const { language, currency, setLanguage, setCurrency } = usePreferences();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    const { error } = await supabaseSignOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error,
        variant: "destructive",
      });
    } else {
      clearUser();
      setLocation("/");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  const openAuthModal = (tab: "signin" | "signup") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <nav className="sticky top-0 z-50 nav-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="flex items-center focus-ring rounded-lg" data-testid="link-home">
              <img src={logoPath} alt="Rainbow Tour Guides" className="h-8 sm:h-10 md:h-12 w-auto max-w-[200px] sm:max-w-[250px] md:max-w-xs object-contain" />
            </a>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/guides">
              <a className="text-sm font-medium hover:text-primary transition-colors focus-ring rounded px-2 py-1" data-testid="link-guides">
                Guides
              </a>
            </Link>
            <Link href="/cities">
              <a className="text-sm font-medium hover:text-primary transition-colors focus-ring rounded px-2 py-1" data-testid="link-cities">
                Cities
              </a>
            </Link>
            <Link href="/blog">
              <a className="text-sm font-medium hover:text-primary transition-colors focus-ring rounded px-2 py-1" data-testid="link-blog">
                Blog
              </a>
            </Link>
            <Link href="/become-guide">
              <a className="text-sm font-medium hover:text-primary transition-colors focus-ring rounded px-2 py-1" data-testid="link-become-guide">
                Become a Guide
              </a>
            </Link>
            <Link href="/help">
              <a className="text-sm font-medium hover:text-primary transition-colors focus-ring rounded px-2 py-1" data-testid="link-help">
                Help
              </a>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors focus-ring"
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} text-lg`}></i>
            </button>

            {/* Language/Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors focus-ring text-sm font-medium">
                  <i className="fas fa-globe"></i>
                  <span className="hidden sm:inline">{language.toUpperCase()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{currency}</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Language
                </div>
                {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{LANGUAGE_NAMES[lang]}</span>
                      {language === lang && <i className="fas fa-check text-primary"></i>}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Currency
                </div>
                {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((curr) => (
                  <DropdownMenuItem
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{curr} ({CURRENCY_SYMBOLS[curr]})</span>
                      {currency === curr && <i className="fas fa-check text-primary"></i>}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <Link href={user.role === "guide" ? "/dashboard/guide" : user.role === "admin" ? "/admin" : "/dashboard/traveler"}>
                  <a className="hidden sm:inline-flex items-center px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors focus-ring" data-testid="link-dashboard">
                    Dashboard
                  </a>
                </Link>
                <Button variant="outline" onClick={handleSignOut} data-testid="button-signout">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => openAuthModal("signin")}
                  className="hidden sm:inline-flex"
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => openAuthModal("signup")}
                  className="rainbow-gradient text-white hover:opacity-90"
                  data-testid="button-getstarted"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </nav>
  );
}
