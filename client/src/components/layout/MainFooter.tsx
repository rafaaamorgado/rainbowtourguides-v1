import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthModal from "@/components/AuthModal";
import logoPath from "@assets/RAINBOW TOUR GUIDES V1 Short (2)_1759319454583.png";
import { useToast } from "@/hooks/use-toast";

export default function MainFooter() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const openAuthModal = (tab: "signin" | "signup") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter",
        });
        setEmail("");
      } else {
        const data = await response.json();
        toast({
          title: "Subscription failed",
          description: data.error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-50 py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Section: Newsletter & CTA */}
        <div className="grid lg:grid-cols-2 gap-12 pb-16 mb-16 border-b border-white/10">
          {/* Left: Newsletter */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-display">
              Book Your Tour Today!
            </h2>
            <p className="text-neutral-200 text-lg mb-8 max-w-md">
              Subscribe to receive exclusive travel tips, destination guides, and special offers from LGBTQ+ friendly local guides worldwide.
            </p>

            {/* Newsletter Form - Pill Shape */}
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-6 rounded-full border-white/20 bg-white/5 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary"
                  disabled={isSubscribing}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubscribing}
                className="h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft transition-brand"
              >
                {isSubscribing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right: CTA Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-brand">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <i className="fas fa-suitcase text-primary text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Join as Traveler</h3>
              <p className="text-neutral-300 text-sm mb-4">
                Discover authentic LGBTQ+ friendly experiences worldwide.
              </p>
              <Button
                onClick={() => openAuthModal("signup")}
                variant="outline"
                className="w-full rounded-full border-white/30 hover:border-white/50 hover:bg-white/5"
              >
                Get Started
              </Button>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-brand">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <i className="fas fa-map-marked-alt text-accent text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Become a Guide</h3>
              <p className="text-neutral-300 text-sm mb-4">
                Share your city and earn income on your schedule.
              </p>
              <Link href="/become-guide">
                <a className="inline-flex items-center justify-center w-full px-6 py-2.5 border border-white/30 hover:border-white/50 hover:bg-white/5 rounded-full text-sm font-semibold transition-brand">
                  Learn More
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <img
                src={logoPath}
                alt="Rainbow Tour Guides"
                className="h-12 w-auto max-w-xs object-contain brightness-0 invert"
              />
            </div>
            <p className="text-neutral-300 mb-6 max-w-sm leading-relaxed">
              Connecting LGBTQ+ travelers with verified local guides for authentic, safe, and inclusive city experiences in 50+ destinations worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-brand focus-ring"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-brand focus-ring"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-brand focus-ring"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-brand focus-ring"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <Link href="/">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/guides">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Tour Guides
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/cities">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Destinations
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Travel Tips
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    About Us
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <Link href="/help">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Help Center
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Contact Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/become-guide">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Become a Guide
                  </a>
                </Link>
              </li>
              <li>
                <a href="mailto:hello@rainbowtourguides.com" className="hover:text-primary transition-brand focus-ring rounded inline-block">
                  hello@rainbowtourguides.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-neutral-300">
              <li>
                <Link href="/privacy-policy">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Cookie Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <a className="hover:text-primary transition-brand focus-ring rounded inline-block">
                    Community Guidelines
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-400">
            <p>
              © {new Date().getFullYear()} Rainbow Tour Guides. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <i className="fas fa-heart text-primary"></i>
              <span>Made with pride for the LGBTQ+ community</span>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </footer>
  );
}
