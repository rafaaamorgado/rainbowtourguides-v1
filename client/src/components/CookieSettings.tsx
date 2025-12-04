import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getConsent, setConsent, getDefaultPreferences, type CookiePreferences } from "@/lib/cookieConsent";

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CookieSettings({ isOpen, onClose, onSave }: CookieSettingsProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences());

  useEffect(() => {
    if (isOpen) {
      const currentConsent = getConsent();
      if (currentConsent) {
        setPreferences(currentConsent.preferences);
      } else {
        setPreferences(getDefaultPreferences());
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    setConsent(preferences);
    onSave();
  };

  const handleToggle = (category: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cookie Settings</DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="essential" className="text-base font-semibold">
                  Essential Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Required for the website to function properly. These cookies enable core functionality such as security,
                  network management, and accessibility. They cannot be disabled.
                </p>
              </div>
              <Switch
                id="essential"
                checked={true}
                disabled={true}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-1">
              Examples: Authentication, session management, security tokens
            </div>
          </div>

          <Separator />

          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="analytics" className="text-base font-semibold">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us understand how visitors interact with our website by collecting and reporting information
                  anonymously. This helps us improve our services.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) => handleToggle("analytics", checked)}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-1">
              Examples: Google Analytics, page views, user behavior tracking
            </div>
          </div>

          <Separator />

          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="marketing" className="text-base font-semibold">
                  Marketing Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Used to track visitors across websites to display relevant and engaging advertisements. May be set
                  through our site by advertising partners.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) => handleToggle("marketing", checked)}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-1">
              Examples: Facebook Pixel, LinkedIn Insight Tag, remarketing
            </div>
          </div>

          <Separator />

          {/* Preferences Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="preferences" className="text-base font-semibold">
                  Preference Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable the website to remember information that changes the way it behaves or looks, such as your
                  preferred language or the region you're in.
                </p>
              </div>
              <Switch
                id="preferences"
                checked={preferences.preferences}
                onCheckedChange={(checked) => handleToggle("preferences", checked)}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground pl-1">
              Examples: Language settings, region preferences, display settings
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <i className="fas fa-info-circle mr-2"></i>
          For more information about the cookies we use and your choices, please visit our{" "}
          <a href="/cookie-policy" className="text-primary hover:underline" target="_blank">
            Cookie Policy
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-primary hover:underline" target="_blank">
            Privacy Policy
          </a>
          .
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="rainbow-gradient text-white hover:opacity-90">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
