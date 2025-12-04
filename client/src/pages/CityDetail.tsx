import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GuideCard from "@/components/GuideCard";
import ShareButtons from "@/components/ShareButtons";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { City, GuideProfile } from "@shared/schema";

export default function CityDetail() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");

  const { data: city, isLoading: cityLoading } = useQuery<City>({
    queryKey: ["/api/cities", slug],
  });

  const { data: guides, isLoading: guidesLoading } = useQuery<GuideProfile[]>({
    queryKey: ["/api/guides"],
    select: (data) => data.filter((g) => g.citySlug === slug),
  });

  // Get all unique themes from guides
  const allThemes = Array.from(
    new Set(guides?.flatMap((g) => g.themes) || [])
  ).sort();

  const filteredGuides = guides?.filter((guide) => {
    const matchesSearch =
      guide.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTheme =
      selectedTheme === "all" || guide.themes.includes(selectedTheme);

    return matchesSearch && matchesTheme;
  });

  if (cityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading city...</div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">City not found</h2>
          <p className="text-muted-foreground">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const cityImages: Record<string, string> = {
    barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&h=400&fit=crop",
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&h=400&fit=crop",
    lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&h=400&fit=crop",
    bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1400&h=400&fit=crop",
    saigon: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&h=400&fit=crop",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* City Header */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={cityImages[city.slug] || cityImages.barcelona}
          alt={`${city.name} cityscape`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2" data-testid="text-city-name">
                  {city.name}
                </h1>
                <p className="text-white/90 text-lg" data-testid="text-city-country">
                  {city.country} • {guides?.length || 0} guides available
                </p>
              </div>
              <div className="hidden lg:block">
                <ShareButtons
                  title={`Discover ${city.name} - LGBTQ+ Tour Guides`}
                  description={`Find authentic LGBTQ+ tour guides in ${city.name}, ${city.country}`}
                  compact
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Guides</label>
              <Input
                type="text"
                placeholder="Search by name or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-guides"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger data-testid="select-theme">
                  <SelectValue placeholder="All themes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All themes</SelectItem>
                  {allThemes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger data-testid="select-duration-filter">
                  <SelectValue placeholder="Any duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any duration</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Guides</h2>
          <p className="text-muted-foreground" data-testid="text-results-count">
            {filteredGuides?.length || 0} guides in {city.name}
          </p>
        </div>

        {guidesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading guides...</div>
          </div>
        ) : filteredGuides && filteredGuides.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.uid} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No guides found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
