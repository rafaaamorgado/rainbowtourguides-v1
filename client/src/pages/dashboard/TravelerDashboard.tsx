import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getUser } from "@/lib/auth";
import RoleGate from "@/components/RoleGate";
import type { Reservation, Booking, GuideProfile } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function TravelerDashboard() {
  const user = getUser();

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations/traveler", user?.id],
    enabled: !!user,
  });

  const pending = reservations?.filter((r) => r.status === "pending") || [];
  const accepted = reservations?.filter((r) => r.status === "accepted") || [];
  const past = reservations?.filter((r) => r.status === "completed") || [];

  return (
    <RoleGate allowedRoles={["traveler"]}>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="text-dashboard-title">
                My Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your bookings and connect with guides
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
              <div className="text-sm text-muted-foreground mb-1">Upcoming Tours</div>
              <div className="text-3xl font-bold" data-testid="text-upcoming-count">
                {accepted.length}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">Completed Tours</div>
              <div className="text-3xl font-bold" data-testid="text-completed-count">
                {past.length}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">Pending Requests</div>
              <div className="text-3xl font-bold" data-testid="text-pending-count">
                {pending.length}
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading bookings...
              </div>
            ) : reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-calendar-alt text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and book your first tour!
                </p>
                <Link href="/guides">
                  <a className="inline-flex items-center px-6 py-3 rainbow-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-opacity" data-testid="link-explore">
                    Explore Guides
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const { data: guide } = useQuery<GuideProfile[], Error, GuideProfile | undefined>({
    queryKey: ["/api/guides"],
    select: (guides) => guides.find((g) => g.uid === reservation.guideId),
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  return (
    <Link href={`/reservation/${reservation.id}`}>
      <a
        className="block border border-border rounded-xl p-5 hover-lift focus-ring"
        data-testid={`card-reservation-${reservation.id}`}
      >
        <div className="flex items-start gap-4">
          <img
            src={guide?.avatarUrl || "https://i.pravatar.cc/60"}
            alt="Guide"
            className="w-14 h-14 rounded-lg pride-ring"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">
                  Tour with {guide?.displayName || "Guide"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {guide?.city}, {guide?.country}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <i className="fas fa-dollar-sign"></i>
                <span>${reservation.total}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fas fa-clock"></i>
                <span>
                  {formatDistanceToNow(new Date(reservation.createdAt), { addSuffix: true })}
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-primary hover:underline">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
