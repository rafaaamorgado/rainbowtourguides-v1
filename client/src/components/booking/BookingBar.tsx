import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { City } from "@shared/schema";

export default function BookingBar() {
  const [, setLocation] = useLocation();
  const [destination, setDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState("1");

  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (destination) {
      const city = cities?.find(c => c.slug === destination);
      if (city) {
        setLocation(`/cities/${city.slug}`);
      }
    } else {
      setLocation("/explore");
    }
  };

  return (
    <div className="relative -mt-16 z-10">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-10">
        <div className="glass-card p-6 shadow-glass">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
            {/* Destination */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Destination
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-white">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.slug}>
                      {city.name}, {city.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrival */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Arrival
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 rounded-xl border-border bg-white pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Departure */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Departure
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={arrivalDate || new Date().toISOString().split('T')[0]}
                  className="w-full h-12 rounded-xl border-border bg-white pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Guests
              </label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent select-none">
                Book
              </label>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-soft transition-brand"
              >
                <i className="fas fa-search mr-2"></i>
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
