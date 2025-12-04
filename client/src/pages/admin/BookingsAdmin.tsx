import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function BookingsAdmin() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Bookings</h2>
        <p className="text-muted-foreground" data-testid="text-bookings-count">
          {bookings?.length || 0} total bookings
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Sessions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/20" data-testid={`row-booking-${booking.id}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{booking.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {booking.sessions.length} session(s)
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="View Details"
                        data-testid={`button-view-booking-${booking.id}`}
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="Mark Complete"
                        data-testid={`button-complete-booking-${booking.id}`}
                      >
                        <i className="fas fa-check text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="More"
                        data-testid={`button-more-booking-${booking.id}`}
                      >
                        <i className="fas fa-ellipsis-h text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
