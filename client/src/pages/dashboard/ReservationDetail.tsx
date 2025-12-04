import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUser } from "@/lib/auth";
import RoleGate from "@/components/RoleGate";
import ChatThread from "@/components/ChatThread";
import ReviewForm from "@/components/ReviewForm";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import type { Reservation, Booking, Conversation, GuideProfile, TravelerProfile, Review, User } from "@shared/schema";

export default function ReservationDetail() {
  const { id } = useParams();
  const user = getUser();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: reservation, isLoading: reservationLoading } = useQuery<Reservation>({
    queryKey: ["/api/reservations", id],
  });

  const { data: booking } = useQuery<Booking[], Error, Booking | undefined>({
    queryKey: ["/api/bookings"],
    select: (bookings) => bookings?.find((b) => b.reservationId === id),
  });

  const { data: conversation } = useQuery<Conversation[], Error, Conversation | undefined>({
    queryKey: ["/api/conversations/user", user?.id],
    select: (conversations) => conversations?.find((c) => c.reservationId === id),
    enabled: !!user && reservation?.status === "accepted",
  });

  const { data: guide } = useQuery<GuideProfile[], Error, GuideProfile | undefined>({
    queryKey: ["/api/guides"],
    select: (guides) => guides.find((g) => g.uid === reservation?.guideId),
    enabled: !!reservation,
  });

  const { data: traveler } = useQuery<TravelerProfile[], Error, TravelerProfile | undefined>({
    queryKey: ["/api/travelers"],
    select: (travelers) => travelers?.find((t) => t.uid === reservation?.travelerId),
    enabled: !!reservation,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    select: (allReviews) => allReviews.filter((r) => r.reservationId === id),
    enabled: !!reservation,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  if (reservationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading reservation...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Reservation not found</h2>
          <p className="text-muted-foreground">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  const isGuide = user?.role === "guide";
  const otherUser = isGuide ? traveler : guide;

  return (
    <RoleGate allowedRoles={["traveler", "guide"]}>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2" data-testid="text-reservation-title">
                  Reservation Details
                </h1>
                <p className="text-muted-foreground">ID: {reservation.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[reservation.status]}`}>
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  {isGuide ? "Traveler" : "Guide"}
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={otherUser?.avatarUrl || "https://i.pravatar.cc/60"}
                    alt={otherUser?.displayName || "User"}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{otherUser?.displayName || "User"}</div>
                    {!isGuide && guide && (
                      <div className="text-sm text-muted-foreground">
                        {guide.city}, {guide.country}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${reservation.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee:</span>
                    <span>${Math.round(reservation.subtotal * reservation.travelerFeePct / 100)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span data-testid="text-total-amount">${reservation.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {booking && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Tour Details</h3>
                <div className="space-y-2">
                  {booking.sessions.map((session, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <i className="fas fa-calendar text-muted-foreground"></i>
                      <span>
                        {session.date} at {session.startTime} • {session.durationHours} hours
                      </span>
                    </div>
                  ))}
                  {booking.itineraryNote && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-1">Special Requests:</div>
                      <div className="text-sm text-muted-foreground">{booking.itineraryNote}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {reservation.status === "accepted" && conversation ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <ChatThread conversationId={conversation.id} />
            </div>
          ) : reservation.status === "pending" ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <i className="fas fa-hourglass-half text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Waiting for Response</h3>
              <p className="text-muted-foreground">
                {isGuide
                  ? "Review this request and accept or decline."
                  : "The guide will review your request and respond within 24 hours."}
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <i className="fas fa-info-circle text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">No Messages Available</h3>
              <p className="text-muted-foreground">
                Messages are only available for accepted reservations.
              </p>
            </div>
          )}

          {/* Reviews */}
          {reservation.status === "completed" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const author = users?.find(u => u.id === review.authorUserId);
                    return (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        author={author}
                        canRespond={user?.id === review.subjectUserId}
                        canEdit={user?.id === review.authorUserId}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-border p-8">
                  {showReviewForm ? (
                    <ReviewForm
                      reservationId={id!}
                      subjectUserId={isGuide ? reservation.travelerId : reservation.guideId}
                      onSuccess={() => setShowReviewForm(false)}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  ) : (
                    <div className="text-center">
                      <i className="fas fa-star text-4xl text-muted-foreground mb-4"></i>
                      <h3 className="text-xl font-semibold mb-2">Share Your Experience</h3>
                      <p className="text-muted-foreground mb-6">
                        {isGuide
                          ? "How was your experience with this traveler?"
                          : "How was your tour experience?"}
                      </p>
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="rainbow-gradient text-white"
                        data-testid="button-leave-review"
                      >
                        <i className="fas fa-star mr-2"></i>
                        Leave a Review
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleGate>
  );
}
