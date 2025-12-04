import { memo } from "react";
import { Link } from "wouter";
import type { City } from "@shared/schema";

interface CityCardProps {
  city: City;
  guideCount: number;
  imageUrl: string;
  startingPrice: number;
}

function CityCard({ city, guideCount, imageUrl, startingPrice }: CityCardProps) {
  return (
    <Link href={`/cities/${city.slug}`}>
      <a className="group block card-hover rounded-2xl overflow-hidden bg-card border border-border shadow-soft focus-ring" data-testid={`card-city-${city.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${city.name} cityscape`}
            className="w-full h-full object-cover group-hover:scale-110 transition-brand"
            style={{ transitionDuration: '500ms' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
            <p className="text-white/90 text-sm">{city.country} • {guideCount} guides available</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="text-lg font-semibold">${startingPrice}</span>
              <span className="text-sm text-muted-foreground">/4hrs</span>
            </div>
            <span className="text-sm font-medium text-primary group-hover:underline">Explore →</span>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default memo(CityCard);
