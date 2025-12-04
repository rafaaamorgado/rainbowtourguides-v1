import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFormPersistence, getStoredFormData, clearStoredFormData } from "@/hooks/useFormPersistence";
import SlotPicker from "@/components/SlotPicker";
import { calculateGroupPrice, formatPrice } from "@/lib/pricing";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { GuideProfile } from "@shared/schema";

interface BookingFormProps {
  guide: GuideProfile;
  onSuccess?: (reservationId: string) => void;
}

interface BookingFormData {
  duration: 4 | 6 | 8;
  date: string;
  startTime: string;
  travelers: number;
  meetingType: "guide_default" | "traveler_accommodation";
  address: string;
  itineraryNote: string;
}

const openInMaps = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    window.open(`maps://maps.apple.com/?q=${encodedAddress}`, '_blank');
  } else if (isAndroid) {
    window.open(`geo:0,0?q=${encodedAddress}`, '_blank');
  } else {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }
};

interface Slot {
  id: string;
  guide_id: string;
  start_time: string;
  duration_hours: 4 | 6 | 8;
  status: "open" | "pending" | "booked" | "closed";
}

export default function BookingForm({ guide, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const user = getUser();
  const [showRestoredBanner, setShowRestoredBanner] = useState(false);

  // Slot-based booking
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [useSlotBooking, setUseSlotBooking] = useState(true);

  // Manual date/time booking (fallback)
  const [duration, setDuration] = useState<4 | 6 | 8>(4);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [meetingType, setMeetingType] = useState<"guide_default" | "traveler_accommodation">("guide_default");
  const [address, setAddress] = useState("");
  const [itineraryNote, setItineraryNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Form data for persistence
  const formData: BookingFormData = {
    duration,
    date,
    startTime,
    travelers,
    meetingType,
    address,
    itineraryNote,
  };

  // Persist form data
  const storageKey = `booking_form_${guide.uid}`;
  const { clearStorage } = useFormPersistence({
    key: storageKey,
    data: formData,
    expirationMinutes: 60,
    debounceMs: 500,
  });

  // Restore form data on mount
  useEffect(() => {
    const stored = getStoredFormData<BookingFormData>(storageKey, 60);
    if (stored) {
      setDuration(stored.duration);
      setDate(stored.date);
      setStartTime(stored.startTime);
      setTravelers(stored.travelers);
      setMeetingType(stored.meetingType);
      setAddress(stored.address);
      setItineraryNote(stored.itineraryNote);
      setShowRestoredBanner(true);

      setTimeout(() => setShowRestoredBanner(false), 5000);
    }
  }, [storageKey]);

  // Calculate price based on slot or manual selection
  const effectiveDuration = selectedSlot ? selectedSlot.duration_hours : duration;
  const baseRate = Number(guide.baseRateHour) || 25; // Use baseRateHour field (numeric type)

  const pricing = selectedSlot
    ? calculateGroupPrice(baseRate, selectedSlot.duration_hours, travelers)
    : calculateGroupPrice(baseRate, duration, travelers);

  const subtotal = pricing.total * travelers;
  const discount = promoDiscount;
  const subtotalAfterDiscount = subtotal - discount;
  const serviceFee = Math.round(subtotalAfterDiscount * 0.1);
  const total = subtotalAfterDiscount + serviceFee;

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setPromoError("");
    try {
      const response = await apiRequest("POST", "/api/promo-codes/validate", {
        code: promoCode.trim().toUpperCase(),
        bookingAmount: subtotal,
      });

      const data = await response.json();

      if (data.valid) {
        setPromoDiscount(data.discount);
        toast({
          title: "Promo code applied!",
          description: `You saved $${data.discount}`,
        });
      } else {
        setPromoError(data.message || "Invalid promo code");
        setPromoDiscount(0);
      }
    } catch (error: any) {
      setPromoError("Failed to validate promo code");
      setPromoDiscount(0);
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to book");
      if (!user.verified) {
        throw new Error("Please verify your email before making a booking. Check your inbox for the verification link.");
      }

      // Slot-based booking (preferred)
      if (selectedSlot) {
        const slotDate = format(parseISO(selectedSlot.start_time), "yyyy-MM-dd");
        const slotTime = format(parseISO(selectedSlot.start_time), "HH:mm");

        const response = await apiRequest("POST", "/api/reservations", {
          travelerId: user.id,
          guideId: guide.uid,
          slotId: selectedSlot.id,
          sessions: [{ date: slotDate, startTime: slotTime, durationHours: selectedSlot.duration_hours }],
          meeting: { type: meetingType, address: meetingType === "traveler_accommodation" ? address : null },
          itineraryNote,
        });

        return response.json();
      }

      // Manual booking (fallback)
      if (!date || !startTime) throw new Error("Please select date and time");

      const response = await apiRequest("POST", "/api/reservations", {
        travelerId: user.id,
        guideId: guide.uid,
        sessions: [{ date, startTime, durationHours: duration }],
        meeting: { type: meetingType, address: meetingType === "traveler_accommodation" ? address : null },
        itineraryNote,
      });

      return response.json();
    },
    onSuccess: (data) => {
      clearStorage();
      clearStoredFormData(storageKey);
      toast({
        title: "Booking request sent!",
        description: "The guide will review and respond within 24 hours.",
      });
      onSuccess?.(data.reservation.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg" data-testid="form-booking">
      {showRestoredBanner && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm flex items-start gap-2">
          <i className="fas fa-info-circle text-primary mt-0.5"></i>
          <div>
            <p className="font-medium text-primary">Your booking details have been saved</p>
            <p className="text-muted-foreground text-xs mt-1">Continue where you left off</p>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-1">Starting from</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${guide.prices.h4}</span>
          <span className="text-muted-foreground">/person for 4-hour tour</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Tour Duration</label>
          <div className="grid grid-cols-3 gap-2">
            {([4, 6, 8] as const).map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setDuration(hours)}
                className={`px-3 py-2 border-2 rounded-lg text-sm font-medium focus-ring ${
                  duration === hours
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary"
                }`}
                data-testid={`button-duration-${hours}`}
              >
                <div className="font-semibold">{hours} hrs</div>
                <div className="text-xs text-muted-foreground">${guide.prices[`h${hours}` as "h4" | "h6" | "h8"]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slot Selection */}
        {guide.baseRateHour ? (
          <div>
            {selectedSlot ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium">Selected Time Slot</label>
                <div className="p-4 border-2 border-primary bg-primary/5 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-normal">
                          {format(parseISO(selectedSlot.start_time), "EEEE, MMMM d, yyyy")}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          {format(parseISO(selectedSlot.start_time), "h:mm a")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {selectedSlot.duration_hours} hours
                        {selectedSlot.duration_hours === 6 && (
                          <span className="ml-2 text-green-600 font-medium">(5% discount applied)</span>
                        )}
                        {selectedSlot.duration_hours === 8 && (
                          <span className="ml-2 text-green-600 font-medium">(10% discount applied)</span>
                        )}
                      </div>
                      <div className="text-lg font-bold">
                        {formatPrice(pricing.total, "USD")} per person
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSlot(null)}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <SlotPicker
                guideId={guide.uid}
                baseRateHour={Number(guide.baseRateHour)}
                selectedSlotId={selectedSlot?.id}
                onSlotSelect={(slot) => setSelectedSlot(slot)}
              />
            )}
          </div>
        ) : (
          <>
            {/* Fallback: Manual Date & Time (if guide hasn't set baseRateHour) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  data-testid="input-date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  data-testid="input-time"
                />
              </div>
            </div>
          </>
        )}

        {/* Number of Travelers */}
        <div>
          <label className="block text-sm font-medium mb-2">Number of Travelers</label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              disabled={travelers <= 1}
              data-testid="button-decrease-travelers"
            >
              <i className="fas fa-minus"></i>
            </Button>
            <Input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, Math.min(guide.maxGroupSize, parseInt(e.target.value) || 1)))}
              min={1}
              max={guide.maxGroupSize}
              className="text-center"
              data-testid="input-travelers"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTravelers(Math.min(guide.maxGroupSize, travelers + 1))}
              disabled={travelers >= guide.maxGroupSize}
              data-testid="button-increase-travelers"
            >
              <i className="fas fa-plus"></i>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Max group size: {guide.maxGroupSize} people</p>
        </div>

        {/* Meeting Preference */}
        <div>
          <label className="block text-sm font-medium mb-2">Meeting Location</label>
          <select
            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value as "guide_default" | "traveler_accommodation")}
            data-testid="select-meeting"
          >
            <option value="guide_default">Guide's Default Meetup</option>
            <option value="traveler_accommodation">My Accommodation</option>
          </select>
          {meetingType === "traveler_accommodation" && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your accommodation address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1"
                  data-testid="input-address"
                />
                {address.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => openInMaps(address)}
                    title="Open in Maps"
                  >
                    <i className="fas fa-map-location-dot"></i>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                We'll share this with your guide after booking is confirmed
              </p>
            </div>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
          <Textarea
            rows={3}
            placeholder="Any specific interests, dietary restrictions, or accessibility needs?"
            value={itineraryNote}
            onChange={(e) => setItineraryNote(e.target.value)}
            maxLength={500}
            data-testid="textarea-requests"
          />
        </div>

        {/* Promo Code */}
        <div>
          <label className="block text-sm font-medium mb-2">Promo Code</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setPromoError("");
              }}
              placeholder="Enter code"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={applyPromoCode}
              disabled={!promoCode.trim() || promoDiscount > 0}
            >
              {promoDiscount > 0 ? (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Applied
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
          {promoError && (
            <p className="text-xs text-destructive mt-1">{promoError}</p>
          )}
          {promoDiscount > 0 && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <i className="fas fa-check-circle"></i>
              Promo code applied! You saved ${promoDiscount}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>{duration} hours × {travelers} travelers</span>
            <span>${subtotal}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-${promoDiscount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between font-semibold">
            <span>Total</span>
            <span data-testid="text-total">${total}</span>
          </div>
        </div>

        <Button
          className="w-full rainbow-gradient text-white hover:opacity-90"
          onClick={() => createBookingMutation.mutate()}
          disabled={createBookingMutation.isPending || !user}
          data-testid="button-request-booking"
        >
          {createBookingMutation.isPending ? "Sending..." : "Request to Book"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You won't be charged yet. The guide will confirm availability first.
        </p>
      </div>
    </div>
  );
}
