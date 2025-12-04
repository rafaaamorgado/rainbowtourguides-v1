import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CityCard from "@/components/CityCard";
import GuideCard from "@/components/GuideCard";
import HeroCarousel from "@/components/HeroCarousel";
import BookingBar from "@/components/booking/BookingBar";
import { Button } from "@/components/ui/button";
import type { City, GuideProfile } from "@shared/schema";
import heroImage1 from "@assets/rainbow_tour_guides_imagery_4_1759319660413.png";
import heroImage2 from "@assets/rainbow_tour_guides_imagery_rio_de_janeiro_v2_1759319660440.webp";
import heroImage3 from "@assets/Gemini_Generated_Image_nd6icnd6icnd6icn_1759319660440.png";
import heroImage4 from "@assets/rainbow_tour_guides_imagery_barcelona_1759319660440.png";
import heroImage5 from "@assets/rainbow_tour_guides_imagery_7_1759319660440.png";
import heroImage6 from "@assets/rainbow_tour_guides_imagery_6_1759319660440.png";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const { data: guides } = useQuery<GuideProfile[]>({
    queryKey: ["/api/guides"],
  });

  const heroImages = [
    heroImage1,
    heroImage2,
    heroImage3,
    heroImage4,
    heroImage5,
    heroImage6,
  ];

  const cityImages: Record<string, string> = {
    barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
    bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",
    saigon: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop",
    amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop",
  };

  const tourPackages = [
    {
      id: "cultural-heritage",
      title: "Cultural Heritage Tour",
      category: "Cultural",
      image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=600&h=400&fit=crop",
      duration: "4-6 hours",
      description: "Explore historic LGBTQ+ landmarks and hidden cultural gems",
    },
    {
      id: "food-wine",
      title: "Food & Wine Experience",
      category: "Culinary",
      image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=600&h=400&fit=crop",
      duration: "3-4 hours",
      description: "Discover local queer-owned restaurants and authentic cuisine",
    },
    {
      id: "nightlife",
      title: "Nightlife & Bars",
      category: "Nightlife",
      image: "https://images.pexels.com/photos/2306203/pexels-photo-2306203.jpeg?w=600&h=400&fit=crop",
      duration: "4-6 hours",
      description: "Experience the vibrant LGBTQ+ nightlife scene",
    },
    {
      id: "art-design",
      title: "Art & Design Walk",
      category: "Cultural",
      image: "https://images.pexels.com/photos/1566412/pexels-photo-1566412.jpeg?w=600&h=400&fit=crop",
      duration: "3-4 hours",
      description: "Visit queer art galleries and creative spaces",
    },
  ];

  const filterCategories = ["all", "Cultural", "Culinary", "Nightlife", "Adventure"];

  const filteredPackages =
    selectedFilter === "all"
      ? tourPackages
      : tourPackages.filter((pkg) => pkg.category === selectedFilter);

  return (
    <div>
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-neutral-50 to-primary/5">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Content */}
            <div className="space-y-8">
              {/* Label Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
                <i className="fas fa-heart"></i>
                <span>Experience the Magic of Authentic Travel</span>
              </div>

              {/* H1 with Serif Highlight */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
                Discover{" "}
                <span className="text-display rainbow-text">Incredible Cities</span>{" "}
                with LGBTQ+ Local Guides
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-neutral-700 max-w-xl leading-relaxed">
                Connect with verified local guides who share your identity. Experience authentic tours, hidden gems, and safe spaces in 50+ cities worldwide.
              </p>

              {/* People Joined Row */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[5, 12, 47, 32, 19].map((img) => (
                    <img
                      key={img}
                      src={`https://i.pravatar.cc/48?img=${img}`}
                      alt="Happy traveler"
                      className="w-12 h-12 rounded-full border-3 border-white shadow-soft"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-foreground text-base">
                    {guides?.length || 0}+ Verified Guides
                  </div>
                  <div className="text-neutral-600">
                    Across {cities?.length || 0}+ cities worldwide
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/guides">
                  <a>
                    <Button
                      size="lg"
                      className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft text-base transition-brand"
                    >
                      <i className="fas fa-calendar-check mr-2"></i>
                      Book Now
                    </Button>
                  </a>
                </Link>
                <Link href="/cities">
                  <a>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold text-base transition-brand"
                    >
                      <i className="fas fa-map-marked-alt mr-2"></i>
                      Explore Destinations
                    </Button>
                  </a>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Carousel */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60"></div>
              <div className="relative">
                <HeroCarousel images={heroImages} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Bar - Glass Overlay */}
      <BookingBar />

      {/* Tour Packages Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-display">
              Our Tours Ensure a{" "}
              <span className="rainbow-text">Seamless & Memorable</span> Adventure
            </h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              From cultural immersion to culinary journeys, discover experiences tailored to LGBTQ+ travelers seeking authentic connections.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-brand ${
                  selectedFilter === category
                    ? "bg-primary text-white shadow-soft"
                    : "bg-white border border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                {category === "all" ? "All Tours" : category}
              </button>
            ))}
          </div>

          {/* Tour Cards - Horizontal Scroll */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group relative w-80 rounded-2xl overflow-hidden shadow-soft hover:shadow-glass transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground">
                        {pkg.category}
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <i className="fas fa-clock"></i>
                        <span>{pkg.duration}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-white/90 text-sm">{pkg.description}</p>
                    </div>
                  </div>

                  {/* Arrow Button */}
                  <div className="absolute bottom-6 right-6">
                    <div className="w-10 h-10 rounded-full bg-primary group-hover:bg-accent flex items-center justify-center transition-brand shadow-soft">
                      <i className="fas fa-arrow-right text-white"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore <span className="text-display rainbow-text">Top Destinations</span>
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Discover LGBTQ+-friendly neighborhoods, vibrant culture, and hidden gems with local guides who know the scene.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities?.slice(0, 5).map((city) => {
              const cityGuides = guides?.filter((g) => g.citySlug === city.slug) || [];
              const minPrice = cityGuides.length > 0
                ? Math.min(...cityGuides.map((g) => g.prices.h4))
                : 0;

              return (
                <CityCard
                  key={city.id}
                  city={city}
                  guideCount={cityGuides.length}
                  imageUrl={cityImages[city.slug]}
                  startingPrice={minPrice}
                />
              );
            })}

            {/* View All Card */}
            <Link href="/cities">
              <a className="group block rounded-2xl border-2 border-dashed border-border hover:border-primary transition-brand bg-white/50 backdrop-blur-sm focus-ring">
                <div className="flex flex-col items-center justify-center text-center p-12 h-full min-h-[280px]">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-brand">
                    <i className="fas fa-globe text-primary text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">View All Cities</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cities?.length || 0}+ destinations worldwide
                  </p>
                  <span className="text-sm font-semibold text-primary group-hover:underline">
                    Browse all <i className="fas fa-arrow-right ml-1"></i>
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation + Testimonial Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Testimonial Card */}
            <div className="space-y-6">
              <div className="glass-card p-8 shadow-glass">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src="https://i.pravatar.cc/80?img=12"
                    alt="Alex Martinez"
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">Alex Martinez</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                        <i className="fas fa-star"></i>
                        5.0
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Barcelona, Spain</p>
                  </div>
                </div>

                <p className="text-neutral-700 leading-relaxed mb-6">
                  "Maria showed us the real Barcelona - hidden queer-friendly spots we'd never find in guidebooks. She made us feel safe and welcomed everywhere we went. This was hands down the best travel experience of my life!"
                </p>

                {/* Inclusion Chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                    <i className="fas fa-shield-check"></i>
                    Verified Guide
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                    <i className="fas fa-language"></i>
                    Multilingual
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                    <i className="fas fa-heart"></i>
                    LGBTQ+ Safe
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border border-border shadow-soft">
                  <div className="text-3xl font-bold text-primary mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-border shadow-soft">
                  <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Travelers</div>
                </div>
              </div>
            </div>

            {/* Right: Image & Video Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Large Image Card */}
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-soft h-64">
                <img
                  src={heroImage4}
                  alt="Barcelona tour"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Video Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden shadow-soft h-48 group cursor-pointer">
                <img
                  src={heroImage2}
                  alt="Rio tour"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-white transition-brand">
                    <i className="fas fa-play text-primary text-xl ml-1"></i>
                  </div>
                </div>
              </div>

              {/* Small Image Card */}
              <div className="rounded-2xl overflow-hidden shadow-soft h-48">
                <img
                  src={heroImage6}
                  alt="City tour"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Our <span className="text-display rainbow-text">Top Guides</span>
              </h2>
              <p className="text-lg text-neutral-700 max-w-2xl">
                Verified locals who share authentic experiences and safe spaces in their cities.
              </p>
            </div>
            <Link href="/guides">
              <a className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-semibold transition-brand focus-ring">
                View all guides
                <i className="fas fa-arrow-right"></i>
              </a>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides?.slice(0, 4).map((guide) => (
              <GuideCard key={guide.uid} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-display">How to Book</span> Your Perfect Tour
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
              Three simple steps to connect with your guide and start exploring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Choose Your Guide",
                description: "Browse verified LGBTQ+ guides in your destination. Filter by language, interests, and availability.",
                icon: "fa-search-location",
              },
              {
                step: "02",
                title: "Confirm Availability",
                description: "Select your preferred dates and tour duration (4, 6, or 8 hours). Add any special requests.",
                icon: "fa-calendar-check",
              },
              {
                step: "03",
                title: "Start Exploring",
                description: "Connect with your guide, finalize details, and enjoy an authentic local experience tailored to you.",
                icon: "fa-map-marked-alt",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold shadow-soft group-hover:scale-110 transition-brand">
                    {item.step}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <i className={`fas ${item.icon} text-accent text-lg`}></i>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/guides">
              <a>
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft text-base transition-brand"
                >
                  Get Started Now
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-white border-y border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-2">Trusted by Travelers Worldwide</h3>
            <p className="text-muted-foreground">
              Join thousands of LGBTQ+ travelers who discovered safe, authentic experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { icon: "fa-shield-check", title: "Verified Guides", subtitle: "Background checked" },
              { icon: "fa-lock", title: "SSL Secure", subtitle: "256-bit encryption" },
              { icon: "fa-heart", title: "LGBTQ+ Verified", subtitle: "Community approved" },
              { icon: "fa-undo", title: "Money Back", subtitle: "Guaranteed refund" },
            ].map((badge) => (
              <div key={badge.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className={`fas ${badge.icon} text-primary text-2xl`}></i>
                </div>
                <div>
                  <div className="font-bold text-foreground">{badge.title}</div>
                  <div className="text-sm text-muted-foreground">{badge.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
