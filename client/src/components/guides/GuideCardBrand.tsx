import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { GuideProfile } from "@shared/schema";
import { obfuscateName, getMinimumPrice, formatPriceRange } from "@/lib/privacy";
import { isAuthenticated } from "@/lib/auth";
import { MessageCircle, Phone, MapPin, Star, Languages } from "lucide-react";

interface GuideCardBrandProps {
  guide: GuideProfile;
  onMessage?: () => void;
  onCall?: () => void;
}

export default function GuideCardBrand({ guide, onMessage, onCall }: GuideCardBrandProps) {
  const isLoggedIn = isAuthenticated();
  const displayName = isLoggedIn ? guide.displayName : obfuscateName(guide.displayName);
  const minPrice = getMinimumPrice(guide.prices);
  const priceDisplay = isLoggedIn ? `$${minPrice}` : formatPriceRange(minPrice);

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-soft card-hover group">
      {/* Avatar and Name Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Large Avatar */}
          <Link href={`/guides/${guide.handle}`}>
            <a className="shrink-0">
              <img
                src={guide.avatarUrl || "https://i.pravatar.cc/120"}
                alt={displayName}
                className="w-20 h-20 rounded-full border-2 border-primary/20 group-hover:border-primary transition-brand object-cover"
              />
            </a>
          </Link>

          {/* Name and Location */}
          <div className="flex-1 min-w-0">
            <Link href={`/guides/${guide.handle}`}>
              <a className="block">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-brand line-clamp-1">
                  {displayName}
                </h3>
              </a>
            </Link>

            {/* Tagline */}
            {guide.tagline && (
              <p className="text-sm text-neutral-700 italic mt-1 line-clamp-2">
                "{guide.tagline}"
              </p>
            )}

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
              <MapPin className="w-4 h-4" />
              <span>{guide.city}, {guide.country}</span>
            </div>
          </div>

          {/* Verified Badge */}
          {guide.verified && (
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold border border-accent/20">
                <i className="fas fa-check-circle"></i>
                Verified
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4 text-sm">
          {/* Experience */}
          <div className="flex items-center gap-1.5">
            <i className="fas fa-briefcase text-primary"></i>
            <span className="font-medium">{guide.yearsExperience || 3}y</span>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-primary" />
            <span className="font-medium">{guide.languages.length}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold">{guide.ratingAvg.toFixed(1)}</span>
            <span className="text-muted-foreground">({guide.ratingCount})</span>
          </div>

          {/* Tours Badge (if available) */}
          <div className="ml-auto">
            <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              {guide.ratingCount || 0} tours
            </span>
          </div>
        </div>
      </div>

      {/* Themes/Specialties */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {guide.themes.slice(0, 3).map((theme) => (
            <span
              key={theme}
              className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground"
            >
              {theme}
            </span>
          ))}
          {guide.themes.length > 3 && (
            <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
              +{guide.themes.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Price and Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {/* Price */}
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">{isLoggedIn ? "From" : "Pricing"}</div>
            <div className="text-xl font-bold text-primary">{priceDisplay}</div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary text-primary hover:bg-primary/5 h-9 px-4"
              onClick={(e) => {
                e.preventDefault();
                onMessage?.();
              }}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Message
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-white h-9 px-4"
              onClick={(e) => {
                e.preventDefault();
                onCall?.();
              }}
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
