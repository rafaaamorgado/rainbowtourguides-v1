import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import GuideCardBrand from "@/components/guides/GuideCardBrand";
import FilterChips from "@/components/guides/FilterChips";
import { GuideGridSkeleton } from "@/components/LoadingSkeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { GuideProfile, City } from "@shared/schema";

type SortOption = "relevance" | "rating" | "bookings" | "price";

export default function Guides() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const { data: guides, isLoading: guidesLoading } = useQuery<GuideProfile[]>({
    queryKey: ["/api/guides"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  // Extract unique countries from guides
  const countries = Array.from(new Set(guides?.map(g => g.country) || [])).sort();

  // Rating filters
  const ratingFilters = ["4.5+ Stars", "4.0+ Stars", "3.5+ Stars"];

  // Filter guides
  let filteredGuides = guides?.filter((guide) => {
    // Search filter
    const matchesSearch = !searchQuery ||
      guide.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    // City filter
    const matchesCity = !selectedCity || guide.city === selectedCity;

    // Country filter
    const matchesCountry = selectedCountries.length === 0 ||
      selectedCountries.includes(guide.country);

    // Rating filter
    let matchesRating = true;
    if (selectedRatings.length > 0) {
      matchesRating = selectedRatings.some(rating => {
        if (rating === "4.5+ Stars") return guide.ratingAvg >= 4.5;
        if (rating === "4.0+ Stars") return guide.ratingAvg >= 4.0;
        if (rating === "3.5+ Stars") return guide.ratingAvg >= 3.5;
        return true;
      });
    }

    return matchesSearch && matchesCity && matchesCountry && matchesRating;
  });

  // Sort guides
  if (sortBy === "rating") {
    filteredGuides = filteredGuides?.sort((a, b) => b.ratingAvg - a.ratingAvg);
  } else if (sortBy === "bookings") {
    filteredGuides = filteredGuides?.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
  } else if (sortBy === "price") {
    filteredGuides = filteredGuides?.sort((a, b) => a.prices.h4 - b.prices.h4);
  }

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleRatingToggle = (rating: string) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedCity("");
    setSelectedCountries([]);
    setSelectedRatings([]);
    setSearchQuery("");
  };

  const activeFilterCount = selectedCountries.length + selectedRatings.length + (selectedCity ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:py-24">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Discover Your Perfect{" "}
              <span className="text-display rainbow-text">LGBTQ+ Guide</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              Connect with verified local guides who understand and celebrate the LGBTQ+ experience.
              Explore authentic experiences in welcoming destinations worldwide.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search guides by name, city, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-4 h-14 text-base rounded-full border-border bg-white shadow-soft"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: `${guides?.length || 0}+`, label: "Verified Guides" },
              { value: `${cities?.length || 0}+`, label: "Cities Worldwide" },
              { value: "4.8", label: "Average Rating" },
              { value: "50+", label: "Languages" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-border shadow-soft"
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          {/* Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-full border-primary text-primary hover:bg-primary/5"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-primary text-white rounded-full text-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {filteredGuides?.length || 0} guides found
                </span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-40 rounded-full border-border bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="bookings">Most Booked</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="glass-card p-6 space-y-6 mb-6 shadow-glass animate-in slide-in-from-top-2">
                {/* City Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full sm:w-64 rounded-xl border-border bg-white">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All cities</SelectItem>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}, {city.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <FilterChips
                  label="Country"
                  filters={countries}
                  selected={selectedCountries}
                  onToggle={handleCountryToggle}
                />

                {/* Rating Filter */}
                <FilterChips
                  label="Minimum Rating"
                  filters={ratingFilters}
                  selected={selectedRatings}
                  onToggle={handleRatingToggle}
                />
              </div>
            )}
          </div>

          {/* Guides Grid */}
          {guidesLoading ? (
            <GuideGridSkeleton count={6} />
          ) : filteredGuides && filteredGuides.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <GuideCardBrand
                  key={guide.uid}
                  guide={guide}
                  onMessage={() => { }}
                  onCall={() => { }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No guides found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline" className="rounded-full">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Become a <span className="text-display rainbow-text">Tour Guide</span>
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-8">
              Share your city with LGBTQ+ travelers and earn income on your own schedule.
              Join our community of verified local guides.
            </p>
            <Link href="/become-guide">
              <a>
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft"
                >
                  Apply to Be a Guide
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
