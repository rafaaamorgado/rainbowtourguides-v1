import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Globe, Heart, Star, ChevronRight } from "lucide-react";
import type { City } from "@shared/schema";

export default function Cities() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: cities, isLoading } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const { data: guides } = useQuery({
    queryKey: ["/api/guides"],
  });

  const getGuideCountForCity = (citySlug: string) => {
    return guides?.filter((g: any) => g.citySlug === citySlug).length || 0;
  };

  const filteredCities = cities?.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCities = cities
    ?.map(city => ({
      ...city,
      guideCount: getGuideCountForCity(city.slug)
    }))
    .sort((a, b) => b.guideCount - a.guideCount)
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-blue-500/10 via-green-500/10 to-teal-500/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Explore LGBTQ+-Welcoming Cities
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover safe, welcoming destinations around the world where you can be yourself.
              Find experienced local guides in each city ready to show you authentic experiences.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cities or countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">{cities?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div className="text-center p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">{guides?.length || 0}+</div>
              <div className="text-sm text-muted-foreground">Local Guides</div>
            </div>
            <div className="text-center p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">6</div>
              <div className="text-sm text-muted-foreground">Continents</div>
            </div>
            <div className="text-center p-4 bg-background/50 backdrop-blur rounded-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">LGBTQ+ Safe</div>
            </div>
          </div>
        </div>
      </section>

      {featuredCities.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Destinations</h2>
              <p className="text-lg text-muted-foreground">
                Our top LGBTQ+-friendly cities with the most experienced local guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCities.map((city) => (
                <Link key={city.id} href={`/cities/${city.slug}`}>
                  <a className="group block">
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-4 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="absolute top-4 right-4 flex gap-2">
                        <div className="bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{city.guideCount}</span>
                        </div>
                      </div>

                      <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-pink-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                          {city.name}
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <div className="flex items-center gap-4 text-white/90">
                          <span className="flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4" />
                            {city.countryCode}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <Globe className="w-4 h-4" />
                            {city.timezone.split('/')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {city.guideCount} {city.guideCount === 1 ? 'guide' : 'guides'} available
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Explore <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Cities</h2>
              <p className="text-muted-foreground">
                {filteredCities?.length || 0} destinations available
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-3" />
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredCities && filteredCities.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCities.map((city) => {
                const guideCount = getGuideCountForCity(city.slug);
                return (
                  <Link key={city.id} href={`/cities/${city.slug}`}>
                    <a className="group block">
                      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3 text-primary" />
                            <span className="font-medium">{guideCount}</span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                            {city.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{city.country_code}</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <span className="text-sm text-muted-foreground">
                              {guideCount} {guideCount === 1 ? 'guide' : 'guides'}
                            </span>
                            <span className="text-sm text-primary font-medium flex items-center gap-1">
                              View City
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No cities found</h3>
              <p className="text-muted-foreground mb-6">
                Try a different search term
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Travel with Rainbow Tour Guides?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every city in our network has been carefully selected for its LGBTQ+ friendliness and local community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Star className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Safe Spaces</h3>
              <p className="text-muted-foreground">
                All our destinations are carefully vetted for LGBTQ+ safety, legal protections, and welcoming communities
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local LGBTQ+ Guides</h3>
              <p className="text-muted-foreground">
                Connect with guides who are part of the local LGBTQ+ community and know the best spots
              </p>
            </div>

            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Authentic Experiences</h3>
              <p className="text-muted-foreground">
                Go beyond tourist traps and discover the real LGBTQ+ culture, nightlife, and community in each city
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't see your city?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're always expanding to new destinations. Join as a guide and help us bring Rainbow Tour Guides to your city.
          </p>
          <Link href="/become-guide">
            <a>
              <Button size="lg" className="rainbow-gradient text-white">
                Become a Guide in Your City
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
