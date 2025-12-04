import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { getUser, clearUser } from "@/lib/auth";
import { supabaseSignOut } from "@/lib/supabaseAuth";
import { usePreferences, LANGUAGE_NAMES, CURRENCY_SYMBOLS, type Language, type Currency } from "@/lib/preferences";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";
import logoPath from "@assets/RAINBOW TOUR GUIDES V1 Short (2)_1759319454583.png";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";

export default function MainNav() {
  const [location, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = getUser();
  const { toast } = useToast();
  const { language, currency, setLanguage, setCurrency } = usePreferences();
  const { theme, toggleTheme } = useTheme();

  // Glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/guides", label: "Tour Guides" },
    { href: "/cities", label: "Destinations" },
    { href: "/blog", label: "Travel Tips" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav shadow-glass"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center focus-ring rounded-lg transition-brand hover:opacity-80">
                <img
                  src={logoPath}
                  alt="Rainbow Tour Guides"
                  className="h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[220px] object-contain"
                />
              </a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`text-sm font-medium transition-brand hover:text-primary focus-ring rounded px-3 py-2 ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle - Desktop only */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex p-2 rounded-lg hover:bg-primary/10 transition-brand focus-ring"
                aria-label="Toggle theme"
              >
                <i className={`fas ${theme === "dark" ? "fa-sun text-primary" : "fa-moon text-foreground"} text-lg`}></i>
              </button>

              {/* Language/Currency Selector - Desktop only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-brand focus-ring text-sm font-medium border border-border">
                    <i className="fas fa-globe text-primary"></i>
                    <span className="hidden md:inline">{language.toUpperCase()}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">{currency}</span>
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

              {/* Auth Buttons - Desktop */}
              {user ? (
                <div className="hidden lg:flex items-center gap-3">
                  <Link href={user.role === "guide" ? "/dashboard/guide" : user.role === "admin" ? "/admin" : "/dashboard/traveler"}>
                    <a className="inline-flex items-center px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-primary/10 transition-brand focus-ring">
                      Dashboard
                    </a>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="rounded-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal("signin")}
                    className="rounded-full hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => openAuthModal("signup")}
                    className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-soft"
                  >
                    Book Now
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-brand focus-ring">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-8">
                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-brand hover:bg-primary/10 ${
                              location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
                            }`}
                          >
                            {link.label}
                          </a>
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-border"></div>

                    {/* Mobile User Actions */}
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <Link href={user.role === "guide" ? "/dashboard/guide" : user.role === "admin" ? "/admin" : "/dashboard/traveler"}>
                          <a
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-primary/10 transition-brand"
                          >
                            Dashboard
                          </a>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 rounded-lg text-base font-medium hover:bg-destructive/10 text-destructive transition-brand text-left"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => openAuthModal("signin")}
                          variant="outline"
                          className="w-full rounded-full"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => openAuthModal("signup")}
                          className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
                        >
                          Book Now
                        </Button>
                      </div>
                    )}

                    <div className="h-px bg-border"></div>

                    {/* Mobile Settings */}
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition-brand"
                      >
                        <span className="text-sm font-medium">Theme</span>
                        <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} text-primary`}></i>
                      </button>

                      <div className="px-4 py-3 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium mb-2">Language</div>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as Language)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        >
                          {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
                            <option key={lang} value={lang}>
                              {LANGUAGE_NAMES[lang]}
                            </option>
                          ))}
                        </select>

                        <div className="text-sm font-medium mb-2 mt-4">Currency</div>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as Currency)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        >
                          {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((curr) => (
                            <option key={curr} value={curr}>
                              {curr} ({CURRENCY_SYMBOLS[curr]})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-20"></div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </>
  );
}
