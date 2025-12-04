import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, TrendingDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { calculateTourPrice, formatPrice } from "@/lib/pricing";

interface Slot {
  id: string;
  guide_id: string;
  start_time: string;
  duration_hours: 4 | 6 | 8;
  status: "open" | "pending" | "booked" | "closed";
}

interface SlotPickerProps {
  guideId: string;
  baseRateHour: number;
  selectedSlotId?: string;
  onSlotSelect: (slot: Slot | null) => void;
  currency?: string;
}

export default function SlotPicker({
  guideId,
  baseRateHour,
  selectedSlotId,
  onSlotSelect,
  currency = "USD",
}: SlotPickerProps) {
  const [showAll, setShowAll] = useState(false);

  // Fetch next 30 days of open slots
  const { data: slots, isLoading } = useQuery({
    queryKey: ["open-slots", guideId],
    queryFn: async () => {
      const from = new Date().toISOString();
      const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch(
        `/api/availability?guideId=${guideId}&from=${from}&to=${to}&status=open`
      );
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json() as Promise<Slot[]>;
    },
  });

  // Group slots by date
  const slotsByDate = slots?.reduce((acc, slot) => {
    const date = format(parseISO(slot.start_time), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Sort dates
  const sortedDates = Object.keys(slotsByDate || {}).sort();

  // Limit to first 7 days unless showAll
  const displayDates = showAll ? sortedDates : sortedDates.slice(0, 7);

  const getDiscountBadge = (duration: 4 | 6 | 8) => {
    if (duration === 6) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
          <TrendingDown className="w-3 h-3 mr-1" />
          5% off
        </Badge>
      );
    }
    if (duration === 8) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
          <TrendingDown className="w-3 h-3 mr-1" />
          10% off
        </Badge>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select a Time Slot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select a Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Available Slots</h3>
            <p className="text-sm text-muted-foreground">
              This guide doesn't have any open time slots in the next 30 days.
              Please check back later or contact the guide directly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Select a Time Slot
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose when you'd like to start your tour
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedSlotId}
          onValueChange={(slotId) => {
            const slot = slots.find((s) => s.id === slotId);
            onSlotSelect(slot || null);
          }}
        >
          <div className="space-y-4">
            {displayDates.map((date) => {
              const dateSlots = slotsByDate![date];
              const dateObj = parseISO(date);

              return (
                <div key={date} className="border rounded-lg p-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium">
                      {format(dateObj, "EEEE, MMMM d, yyyy")}
                    </h3>
                  </div>

                  {/* Slots for this date */}
                  <div className="space-y-2">
                    {dateSlots
                      .sort(
                        (a, b) =>
                          new Date(a.start_time).getTime() -
                          new Date(b.start_time).getTime()
                      )
                      .map((slot) => {
                        const startTime = parseISO(slot.start_time);
                        const endTime = new Date(startTime);
                        endTime.setHours(endTime.getHours() + slot.duration_hours);

                        const pricing = calculateTourPrice(
                          baseRateHour,
                          slot.duration_hours,
                          currency
                        );

                        return (
                          <div
                            key={slot.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                              selectedSlotId === slot.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={slot.id} id={slot.id} />
                            <Label
                              htmlFor={slot.id}
                              className="flex-1 cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 min-w-[140px]">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                                  </span>
                                </div>
                                <Badge variant="outline" className="font-normal">
                                  {slot.duration_hours} hours
                                </Badge>
                                {getDiscountBadge(slot.duration_hours)}
                              </div>
                              <div className="text-right">
                                {pricing.discount > 0 && (
                                  <div className="text-xs text-muted-foreground line-through">
                                    {formatPrice(pricing.subtotal, currency)}
                                  </div>
                                )}
                                <div className="text-lg font-bold">
                                  {formatPrice(pricing.total, currency)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  per person
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {/* Show More Button */}
        {sortedDates.length > 7 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All (${sortedDates.length} days)`}
            </Button>
          </div>
        )}

        {/* Pricing Note */}
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-1">Pricing</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• 4-hour tours: {formatPrice(baseRateHour * 4, currency)} per person</li>
            <li>
              • 6-hour tours: {formatPrice(baseRateHour * 6 * 0.95, currency)} per person{" "}
              <span className="text-green-600 font-medium">(5% discount)</span>
            </li>
            <li>
              • 8-hour tours: {formatPrice(baseRateHour * 8 * 0.9, currency)} per person{" "}
              <span className="text-green-600 font-medium">(10% discount)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
