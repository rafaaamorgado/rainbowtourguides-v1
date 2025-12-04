import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { hasConsented, acceptAllCookies, rejectAllCookies } from "@/lib/cookieConsent";
import CookieSettings from "@/components/CookieSettings";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const alreadyConsented = hasConsented();
    setShowBanner(!alreadyConsented);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  const handleSettingsSaved = () => {
    setShowSettings(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <i className="fas fa-cookie-bite text-3xl text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
                  <p className="text-sm text-muted-foreground max-w-3xl">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies.{" "}
                    <a href="/cookie-policy" className="text-primary hover:underline" target="_blank">
                      Learn more about our cookie policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="w-full sm:w-auto"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                onClick={handleCustomize}
                className="w-full sm:w-auto"
              >
                <i className="fas fa-cog mr-2"></i>
                Customize
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="rainbow-gradient text-white hover:opacity-90 w-full sm:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CookieSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSaved}
      />
    </>
  );
}
