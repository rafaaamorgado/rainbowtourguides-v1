import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import NewsletterSignup from "@/components/NewsletterSignup";
import logoPath from "@assets/RAINBOW TOUR GUIDES V1 Short (2)_1759319454583.png";

export default function Footer() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");

  const openAuthModal = (tab: "signin" | "signup") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <footer className="bg-foreground text-background py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="mb-12 pb-12 border-b border-background/20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background/5 rounded-2xl p-8 backdrop-blur-sm border border-background/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <i className="fas fa-suitcase text-primary text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold">Join as Traveler</h3>
              </div>
              <p className="text-background/80 mb-6">
                Discover authentic experiences with LGBTQ+ friendly local guides in cities worldwide.
              </p>
              <Button
                onClick={() => openAuthModal("signup")}
                className="w-full sm:w-auto rainbow-gradient text-white hover:opacity-90"
              >
                Get Started
              </Button>
            </div>

            <div className="bg-background/5 rounded-2xl p-8 backdrop-blur-sm border border-background/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <i className="fas fa-map-marked-alt text-accent text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold">Join as Guide</h3>
              </div>
              <p className="text-background/80 mb-6">
                Share your city with travelers and create meaningful connections while earning income.
              </p>
              <Link href="/become-guide">
                <a className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border-2 border-background/30 hover:border-background/50 rounded-lg text-sm font-semibold transition-colors">
                  Learn More
                </a>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src={logoPath} alt="Rainbow Tour Guides" className="h-10 sm:h-12 w-auto max-w-xs object-contain" />
            </div>
            <p className="text-background/80 mb-6 max-w-sm">
              Connecting LGBTQ+ travelers with local guides for authentic, safe, and inclusive city experiences worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors focus-ring" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors focus-ring" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors focus-ring" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/explore"><a className="hover:text-background transition-colors focus-ring rounded">Cities</a></Link></li>
              <li><Link href="/explore"><a className="hover:text-background transition-colors focus-ring rounded">Guides</a></Link></li>
              <li><a href="#cities" className="hover:text-background transition-colors focus-ring rounded">Experiences</a></li>
              <li><Link href="/help"><a className="hover:text-background transition-colors focus-ring rounded">How it Works</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/about"><a className="hover:text-background transition-colors focus-ring rounded">About Us</a></Link></li>
              <li><Link href="/become-guide"><a className="hover:text-background transition-colors focus-ring rounded">Become a Guide</a></Link></li>
              <li><a href="#" className="hover:text-background transition-colors focus-ring rounded">Blog</a></li>
              <li><a href="#" className="hover:text-background transition-colors focus-ring rounded">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-background/80">
              <li><Link href="/help"><a className="hover:text-background transition-colors focus-ring rounded">Help Center</a></Link></li>
              <li><Link href="/help"><a className="hover:text-background transition-colors focus-ring rounded">Safety</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-background transition-colors focus-ring rounded">Contact Us</a></Link></li>
              <li><Link href="/help"><a className="hover:text-background transition-colors focus-ring rounded">Trust & Safety</a></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <NewsletterSignup />
          </div>
        </div>

        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © 2024 Rainbow Tour Guides. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-background/60">
              <Link href="/privacy-policy"><a className="hover:text-background transition-colors focus-ring rounded">Privacy Policy</a></Link>
              <Link href="/terms-of-service"><a className="hover:text-background transition-colors focus-ring rounded">Terms of Service</a></Link>
              <Link href="/cookie-policy"><a className="hover:text-background transition-colors focus-ring rounded">Cookie Policy</a></Link>
              <Link href="/help"><a className="hover:text-background transition-colors focus-ring rounded">Community Guidelines</a></Link>
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
