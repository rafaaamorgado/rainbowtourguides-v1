import { memo } from "react";
import { Link } from "wouter";
import type { GuideProfile } from "@shared/schema";
import { obfuscateName, getMinimumPrice, formatPriceRange } from "@/lib/privacy";
import { isAuthenticated } from "@/lib/auth";

interface GuideCardProps {
  guide: GuideProfile;
}

function GuideCard({ guide }: GuideCardProps) {
  const isLoggedIn = isAuthenticated();
  const displayName = isLoggedIn ? guide.displayName : obfuscateName(guide.displayName);
  const minPrice = getMinimumPrice(guide.prices);
  const priceDisplay = isLoggedIn ? `$${minPrice}` : formatPriceRange(minPrice);

  return (
    <Link href={`/guides/${guide.handle}`}>
      <a className="group block bg-card rounded-2xl overflow-hidden border border-border card-hover shadow-soft focus-ring" data-testid={`card-guide-${guide.handle}`}>
        <div className="relative">
          <img
            src={guide.avatarUrl || "https://i.pravatar.cc/400"}
            alt={`${displayName} profile`}
            className="w-full h-64 object-cover group-hover:scale-105 transition-brand"
            style={{ transitionDuration: '500ms' }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {guide.verified && (
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                <i className="fas fa-badge-check text-accent"></i>
                Verified
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{displayName}</h3>
          <p className="text-sm text-muted-foreground mb-3">{guide.city}, {guide.country}</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-500 text-sm">
              {"⭐".repeat(Math.floor(guide.ratingAvg))}
            </div>
            <span className="text-sm font-medium">{guide.ratingAvg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({guide.ratingCount})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {guide.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                {theme}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{isLoggedIn ? "Starting at" : "Pricing"}</span>
              <span className="font-semibold">{priceDisplay}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default memo(GuideCard);
