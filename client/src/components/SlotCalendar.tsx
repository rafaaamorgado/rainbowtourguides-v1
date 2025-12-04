import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Trash2, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface Slot {
  id: string;
  guide_id: string;
  start_time: string;
  duration_hours: 4 | 6 | 8;
  status: "open" | "pending" | "booked" | "closed";
  created_at: string;
  updated_at: string;
}

interface SlotCalendarProps {
  guideId: string;
}

export default function SlotCalendar({ guideId }: SlotCalendarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch slots for current month
  const { data: slots, isLoading } = useQuery({
    queryKey: ["availability", guideId, format(currentMonth, "yyyy-MM")],
    queryFn: async () => {
      const from = startOfMonth(currentMonth).toISOString();
      const to = endOfMonth(currentMonth).toISOString();
      const res = await fetch(`/api/availability?guideId=${guideId}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json() as Promise<Slot[]>;
    },
  });

  // Delete slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      await apiRequest("DELETE", `/api/availability/${slotId}`);
    },
    onSuccess: () => {
      toast({ title: "Slot deleted", description: "The availability slot has been removed." });
      queryClient.invalidateQueries({ queryKey: ["availability", guideId] });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  // Group slots by date
  const slotsByDate = slots?.reduce((acc, slot) => {
    const date = format(new Date(slot.start_time), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Get all days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Status badge colors
  const getStatusColor = (status: Slot["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDeleteSlot = (slotId: string, slotDate: string) => {
    if (confirm(`Delete this slot on ${slotDate}?`)) {
      deleteSlotMutation.mutate(slotId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Availability Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const daySlots = slotsByDate?.[dateKey] || [];
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={dateKey}
                    className={`aspect-square border rounded-lg p-1 ${
                      isToday ? "border-primary border-2" : "border-border"
                    } ${!isSameMonth(day, currentMonth) ? "opacity-50" : ""}`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="text-xs font-medium text-center mb-1">
                        {format(day, "d")}
                      </div>
                      <div className="flex-1 space-y-1 overflow-y-auto">
                        {daySlots.length === 0 ? (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            No slots
                          </div>
                        ) : (
                          daySlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="group relative"
                            >
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(slot.status)} text-[10px] py-0 px-1 w-full justify-center cursor-pointer hover:opacity-80`}
                                title={`${format(new Date(slot.start_time), "p")} - ${slot.duration_hours}h - ${slot.status}`}
                              >
                                {format(new Date(slot.start_time), "HH:mm")}
                                <span className="ml-1">{slot.duration_hours}h</span>
                              </Badge>
                              {slot.status === "open" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full"
                                  onClick={() => handleDeleteSlot(slot.id, format(day, "PPP"))}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Open
                </Badge>
                <span className="text-muted-foreground">Available for booking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Pending
                </Badge>
                <span className="text-muted-foreground">Awaiting payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Booked
                </Badge>
                <span className="text-muted-foreground">Confirmed booking</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {slots?.filter((s) => s.status === "open").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Open</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {slots?.filter((s) => s.status === "pending").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {slots?.filter((s) => s.status === "booked").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Booked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {slots?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
