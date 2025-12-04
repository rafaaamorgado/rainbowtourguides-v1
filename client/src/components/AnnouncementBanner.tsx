import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  message: string;
  link: string | null;
  cta_text: string | null;
  banner_type: "info" | "success" | "warning" | "promo";
  is_active: boolean;
  priority: number;
  dismissible: boolean;
}

const DISMISSED_BANNERS_KEY = "dismissed_banners";

export default function AnnouncementBanner() {
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISSED_BANNERS_KEY);
      if (dismissed) {
        setDismissedBanners(JSON.parse(dismissed));
      }
    } catch (error) {
      console.error("Failed to load dismissed banners:", error);
    }
  }, []);

  const { data: banners } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
  });

  const activeBanner = banners
    ?.filter(b => !dismissedBanners.includes(b.id))
    ?.sort((a, b) => b.priority - a.priority)[0];

  if (!activeBanner) {
    return null;
  }

  const handleDismiss = () => {
    const newDismissed = [...dismissedBanners, activeBanner.id];
    setDismissedBanners(newDismissed);
    try {
      localStorage.setItem(DISMISSED_BANNERS_KEY, JSON.stringify(newDismissed));
    } catch (error) {
      console.error("Failed to save dismissed banner:", error);
    }
  };

  const bannerStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    promo: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-900",
  };

  const iconStyles = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    promo: "text-purple-500",
  };

  const icons = {
    info: "fa-info-circle",
    success: "fa-check-circle",
    warning: "fa-exclamation-triangle",
    promo: "fa-star",
  };

  return (
    <div className={`border-b ${bannerStyles[activeBanner.banner_type]} animate-in slide-in-from-top-2 duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <i className={`fas ${icons[activeBanner.banner_type]} ${iconStyles[activeBanner.banner_type]} text-lg flex-shrink-0`}></i>
            <p className="text-sm font-medium flex-1">
              {activeBanner.message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeBanner.link && activeBanner.cta_text && (
              <Link href={activeBanner.link}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-current text-current hover:bg-black/5"
                >
                  {activeBanner.cta_text}
                </Button>
              </Link>
            )}

            {activeBanner.dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-black/10 rounded transition-colors"
                aria-label="Dismiss banner"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
