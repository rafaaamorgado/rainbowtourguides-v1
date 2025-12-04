import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock } from "lucide-react";

export default function SlotCreationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getUser();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState<4 | 6 | 8>(4);

  const createSlotMutation = useMutation({
    mutationFn: async (data: { guideId: string; startTime: string; durationHours: 4 | 6 | 8 }) => {
      const res = await apiRequest("POST", "/api/guides/availability", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Slot created",
        description: "Your availability slot has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["availability", user?.id] });
      // Reset form
      setDate("");
      setStartTime("09:00");
      setDuration(4);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error creating slot",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create availability slots.",
      });
      return;
    }

    if (!date || !startTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields.",
      });
      return;
    }

    // Combine date and time into ISO string
    const startTimeISO = new Date(`${date}T${startTime}`).toISOString();

    createSlotMutation.mutate({
      guideId: user.id,
      startTime: startTimeISO,
      durationHours: duration,
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Create Availability Slot
        </CardTitle>
        <CardDescription>
          Add a new time slot when you're available to guide tours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              max={maxDateStr}
              required
            />
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Local time (your timezone)
            </p>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={duration === 4 ? "default" : "outline"}
                onClick={() => setDuration(4)}
                className="relative"
              >
                4 hours
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-xs"
                >
                  Standard
                </Badge>
              </Button>
              <Button
                type="button"
                variant={duration === 6 ? "default" : "outline"}
                onClick={() => setDuration(6)}
                className="relative"
              >
                6 hours
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-800"
                >
                  -5%
                </Badge>
              </Button>
              <Button
                type="button"
                variant={duration === 8 ? "default" : "outline"}
                onClick={() => setDuration(8)}
                className="relative"
              >
                8 hours
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-800"
                >
                  -10%
                </Badge>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Longer tours include automatic discounts for travelers
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={createSlotMutation.isPending}
          >
            {createSlotMutation.isPending ? "Creating..." : "Create Slot"}
          </Button>
        </form>

        {/* Helper Text */}
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-1">Tips for creating slots:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Create slots at least 24 hours in advance</li>
            <li>Avoid overlapping time slots</li>
            <li>Consider peak tourist times (mornings and afternoons)</li>
            <li>You can delete or close slots if plans change</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
