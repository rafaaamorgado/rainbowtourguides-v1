import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface City {
  id: string;
  name: string;
  country_code: string;
  slug: string;
  lat: number | null;
  lng: number | null;
  timezone: string;
}

interface CitySelectorProps {
  value?: string;
  onChange: (citySlug: string | undefined) => void;
  placeholder?: string;
  showAll?: boolean;
}

export default function CitySelector({
  value,
  onChange,
  placeholder = "All cities",
  showAll = true,
}: CitySelectorProps) {
  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await fetch("/api/cities");
      if (!res.ok) throw new Error("Failed to fetch cities");
      return res.json() as Promise<City[]>;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? undefined : val)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">
            All Cities
          </SelectItem>
        )}
        {cities?.map((city) => (
          <SelectItem key={city.id} value={city.slug}>
            {city.name}, {city.country_code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
