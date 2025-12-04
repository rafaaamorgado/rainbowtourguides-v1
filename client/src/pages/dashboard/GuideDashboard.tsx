import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { getUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import RoleGate from "@/components/RoleGate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import SlotCreationForm from "@/components/SlotCreationForm";
import SlotCalendar from "@/components/SlotCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Reservation, TravelerProfile } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function GuideDashboard() {
  const user = getUser();
  const { toast } = useToast();

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations/guide", user?.id],
    enabled: !!user,
  });

  const pending = reservations?.filter((r) => r.status === "pending") || [];
  const accepted = reservations?.filter((r) => r.status === "accepted") || [];
  const completed = reservations?.filter((r) => r.status === "completed") || [];

  return (
    <RoleGate allowedRoles={["guide"]}>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="text-guide-dashboard-title">
                Guide Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your tour requests and bookings
              </p>
            </div>
            <Link href="/dashboard/profile">
              <a className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity" data-testid="link-edit-profile">
                Edit Profile
              </a>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">Pending Requests</div>
              <div className="text-3xl font-bold" data-testid="text-pending-requests">
                {pending.length}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">Accepted Tours</div>
              <div className="text-3xl font-bold" data-testid="text-accepted-tours">
                {accepted.length}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">Completed Tours</div>
              <div className="text-3xl font-bold" data-testid="text-completed-tours">
                {completed.length}
              </div>
            </div>
          </div>

          {/* Availability Management */}
          {user && (
            <div className="mb-8">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="calendar">My Availability</TabsTrigger>
                  <TabsTrigger value="create">Create Slots</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="mt-6">
                  <SlotCalendar guideId={user.id} />
                </TabsContent>
                <TabsContent value="create" className="mt-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <SlotCreationForm />
                    <div className="bg-card rounded-lg border border-border p-6">
                      <h3 className="text-lg font-semibold mb-4">Tips for Managing Availability</h3>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                          <span>Create slots at least 24 hours in advance to give travelers time to book</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                          <span>Longer tours (6-8 hours) automatically include discounts for travelers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                          <span>Peak times (mornings 9am-12pm) typically get booked first</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                          <span>You can delete open slots anytime before they're booked</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                          <span>Blocked dates won't accept new bookings automatically</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Pending Requests */}
          {pending.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
              <div className="space-y-4">
                {pending.map((reservation) => (
                  <RequestCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            </div>
          )}

          {/* Accepted Bookings */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold mb-6">Accepted Bookings</h2>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading bookings...
              </div>
            ) : accepted.length > 0 ? (
              <div className="space-y-4">
                {accepted.map((reservation) => (
                  <AcceptedCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-calendar-check text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No accepted bookings</h3>
                <p className="text-muted-foreground">
                  Review pending requests to start guiding
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

function RequestCard({ reservation }: { reservation: Reservation }) {
  const { toast } = useToast();

  const { data: traveler } = useQuery<TravelerProfile[], Error, TravelerProfile | undefined>({
    queryKey: ["/api/travelers"],
    select: (travelers) => travelers?.find((t) => t.uid === reservation.travelerId),
  });

  const respondMutation = useMutation({
    mutationFn: async (status: "accepted" | "cancelled") => {
      const response = await apiRequest("PATCH", `/api/reservations/${reservation.id}`, {
        status,
      });
      return response.json();
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations/guide"] });
      toast({
        title: status === "accepted" ? "Request accepted!" : "Request declined",
        description: status === "accepted"
          ? "You can now message the traveler to finalize details."
          : "The traveler has been notified.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div
      className="border border-border rounded-xl p-5"
      data-testid={`card-request-${reservation.id}`}
    >
      <div className="flex items-start gap-4">
        <img
          src={traveler?.avatarUrl || "https://i.pravatar.cc/60"}
          alt="Traveler"
          className="w-14 h-14 rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">
                {traveler?.displayName || "Traveler"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Requested {formatDistanceToNow(new Date(reservation.createdAt), { addSuffix: true })}
              </p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              Pending
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-dollar-sign"></i>
              <span>${reservation.total}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => respondMutation.mutate("accepted")}
              disabled={respondMutation.isPending}
              className="rainbow-gradient text-white"
              data-testid={`button-accept-${reservation.id}`}
            >
              Accept
            </Button>
            <Button
              onClick={() => respondMutation.mutate("cancelled")}
              disabled={respondMutation.isPending}
              variant="outline"
              data-testid={`button-decline-${reservation.id}`}
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AcceptedCard({ reservation }: { reservation: Reservation }) {
  const { data: traveler } = useQuery<TravelerProfile[], Error, TravelerProfile | undefined>({
    queryKey: ["/api/travelers"],
    select: (travelers) => travelers?.find((t) => t.uid === reservation.travelerId),
  });

  return (
    <div
      className="border border-border rounded-xl p-5 hover-lift"
      data-testid={`card-accepted-${reservation.id}`}
    >
      <div className="flex items-start gap-4">
        <img
          src={traveler?.avatarUrl || "https://i.pravatar.cc/60"}
          alt="Traveler"
          className="w-14 h-14 rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">
                {traveler?.displayName || "Traveler"}
              </h4>
              <p className="text-sm text-muted-foreground">
                Booked {formatDistanceToNow(new Date(reservation.createdAt), { addSuffix: true })}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Confirmed
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-dollar-sign"></i>
              <span>${reservation.total}</span>
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.href = `/reservation/${reservation.id}`}
            data-testid={`button-view-${reservation.id}`}
          >
            <i className="fas fa-comment mr-2"></i>Message Traveler
          </Button>
        </div>
      </div>
    </div>
  );
}
