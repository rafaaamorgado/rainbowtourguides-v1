import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GuideCard from "@/components/GuideCard";
import FilterPanel, { type FilterOptions } from "@/components/FilterPanel";
import { GuideGridSkeleton } from "@/components/LoadingSkeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { GuideProfile, City } from "@shared/schema";
import exploreHeroImage from "@assets/rainbow_tour_guides_imagery_barcelona_1759319660440.png";

type SortOption = "relevance" | "rating" | "bookings";

export default function Explore() {
  const [cityQuery, setCityQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<FilterOptions>({
    languages: [],
    themes: [],
    minDuration: 2,
    maxDuration: 12,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const { data: guides, isLoading: guidesLoading } = useQuery<GuideProfile[]>({
    queryKey: ["/api/guides"],
  });

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  // Filter cities based on search query
  const matchingCities = cities?.filter((city) =>
    city.name.toLowerCase().includes(cityQuery.toLowerCase())
  ) || [];

  // Show autocomplete when there's input and matching cities
  useEffect(() => {
    setShowAutocomplete(cityQuery.length > 0 && matchingCities.length > 0);
  }, [cityQuery, matchingCities.length]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: City) => {
    setCityQuery(city.name);
    setSelectedCitySlug(city.slug);
    setShowAutocomplete(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityQuery(e.target.value);
    setSelectedCitySlug(""); // Clear selection when typing
  };

  let filteredGuides = guides?.filter((guide) => {
    // Filter by city
    const matchesCity = !cityQuery ||
      guide.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
      (selectedCitySlug && guide.citySlug === selectedCitySlug);

    // Filter by languages
    const matchesLanguage = filters.languages.length === 0 ||
      filters.languages.some(lang => guide.languages.includes(lang));

    // Filter by themes/interests
    const matchesTheme = filters.themes.length === 0 ||
      filters.themes.some(theme => guide.themes.includes(theme));

    // Filter by duration (check if guide offers tours in the selected range)
    const guideHours = [4, 6, 8]; // Available durations from guide prices
    const matchesDuration = guideHours.some(
      hours => hours >= filters.minDuration && hours <= filters.maxDuration
    );

    // Filter by minimum rating
    const matchesRating = !filters.minRating || guide.ratingAvg >= filters.minRating;

    return matchesCity && matchesLanguage && matchesTheme && matchesDuration && matchesRating;
  });

  // Sort guides
  if (filteredGuides) {
    filteredGuides = [...filteredGuides].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount;
        case "bookings":
          return b.ratingCount - a.ratingCount; // ratingCount is a proxy for bookings
        case "relevance":
        default:
          // Relevance: combination of verified status, rating, and bookings
          const scoreA = (a.verified ? 10 : 0) + a.ratingAvg + (a.ratingCount * 0.1);
          const scoreB = (b.verified ? 10 : 0) + b.ratingAvg + (b.ratingCount * 0.1);
          return scoreB - scoreA;
      }
    });
  }

  const handleClearFilters = () => {
    setFilters({
      languages: [],
      themes: [],
      minDuration: 2,
      maxDuration: 12,
      minRating: undefined,
      targetDate: undefined,
      onlyAvailable: false,
    });
    setCityQuery("");
    setSelectedCitySlug("");
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Find Your Guide</h1>
              <p className="text-lg text-muted-foreground">
                Find your perfect LGBTQ+ local guide from our community of verified experts.
              </p>
            </div>
            <div className="relative h-[300px] lg:h-[350px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl"></div>
              <img
                src={exploreHeroImage}
                alt="Guide showing traveler around Barcelona"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-muted/30 min-h-screen">

        {/* Search Bar */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <label className="block text-sm font-medium mb-2">City</label>
            <div className="flex gap-3 relative">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a city..."
                  value={cityQuery}
                  onChange={handleInputChange}
                  onFocus={() => cityQuery && matchingCities.length > 0 && setShowAutocomplete(true)}
                  data-testid="input-city-search"
                  className="w-full"
                />
                
                {/* Autocomplete Dropdown */}
                {showAutocomplete && (
                  <div
                    ref={autocompleteRef}
                    className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    data-testid="autocomplete-dropdown"
                  >
                    {matchingCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-4 py-2 text-left hover:bg-accent transition-colors focus:bg-accent focus:outline-none"
                        data-testid={`autocomplete-item-${city.slug}`}
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-muted-foreground">{city.country}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                size="lg"
                className="text-white px-8"
                style={{ backgroundColor: '#ff3a3a' }}
                data-testid="button-find-guide"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Guide
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid with Sidebar */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                {filteredGuides ? `${filteredGuides.length} guides found` : 'Loading...'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Sort by:</label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="bookings">Most Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

        {guidesLoading ? (
          <GuideGridSkeleton count={9} />
        ) : filteredGuides && filteredGuides.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <GuideCard key={guide.uid} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No guides found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>

            {/* Smart Suggestions */}
            {(filters.languages.length > 0 || filters.themes.length > 0 || filters.minRating) && (
              <div className="max-w-md mx-auto text-left space-y-3">
                <p className="text-sm font-medium mb-2">Suggestions:</p>
                {filters.languages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, languages: [] })}
                  >
                    <i className="fas fa-times mr-2"></i>
                    Remove language filters
                  </Button>
                )}
                {filters.themes.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, themes: [] })}
                  >
                    <i className="fas fa-times mr-2"></i>
                    Remove interest filters
                  </Button>
                )}
                {filters.minRating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, minRating: undefined })}
                  >
                    <i className="fas fa-times mr-2"></i>
                    Remove rating filter
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
