import { useState, memo } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Star, Flag, Edit } from "lucide-react";
import type { Review, User } from "@shared/schema";
import ReviewForm from "./ReviewForm";

interface ReviewCardProps {
  review: Review;
  author?: User;
  canRespond?: boolean;
  canEdit?: boolean;
}

function ReviewCard({ review, author, canRespond, canEdit }: ReviewCardProps) {
  const user = getUser();
  const { toast } = useToast();
  const [isRespondingOpen, setIsRespondingOpen] = useState(false);
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [responseText, setResponseText] = useState(review.responseText || "");
  const [reportReason, setReportReason] = useState("");

  const canEditReview = canEdit &&
    new Date().getTime() - new Date(review.createdAt).getTime() < 24 * 60 * 60 * 1000;

  const respondMutation = useMutation({
    mutationFn: async () => {
      if (!responseText.trim()) throw new Error("Please write a response");
      const response = await apiRequest("PATCH", `/api/reviews/${review.id}`, {
        responseText: responseText.trim(),
        responseAt: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Response submitted!",
        description: "Your response has been published.",
      });
      setIsRespondingOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit response",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!reportReason.trim()) throw new Error("Please provide a reason for reporting");
      const response = await apiRequest("POST", "/api/reports", {
        type: "review",
        targetId: review.id,
        reason: reportReason.trim(),
        reporterId: user?.id,
        status: "open",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review reported",
        description: "Thank you for reporting. We'll review this shortly.",
      });
      setIsReportingOpen(false);
      setReportReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to report review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div className="border border-border rounded-xl p-5 bg-card" data-testid={`review-${review.id}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={author?.avatarUrl || "https://i.pravatar.cc/40"}
              alt={author?.displayName || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{author?.displayName || "Anonymous"}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`w-4 h-4 ${
                        value <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                {review.editedAt && (
                  <>
                    <span>•</span>
                    <span className="text-xs">(edited)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {canEditReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingOpen(true)}
                data-testid="edit-review-button"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {user && user.id !== review.authorUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReportingOpen(true)}
                data-testid="report-review-button"
              >
                <Flag className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" data-testid="review-text">
          {review.text}
        </p>

        {review.responseText && (
          <div className="mt-4 pl-4 border-l-2 border-primary bg-muted/30 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-reply text-primary"></i>
              <span className="text-sm font-medium">Response from guide</span>
              {review.responseAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.responseAt), { addSuffix: true })}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed" data-testid="review-response">
              {review.responseText}
            </p>
          </div>
        )}

        {canRespond && !review.responseText && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRespondingOpen(true)}
            className="mt-3"
            data-testid="respond-button"
          >
            <i className="fas fa-reply mr-2"></i>
            Respond
          </Button>
        )}
      </div>

      {/* Respond Dialog */}
      <Dialog open={isRespondingOpen} onOpenChange={setIsRespondingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Response</label>
              <Textarea
                rows={4}
                placeholder="Thank you for your feedback..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                maxLength={500}
                data-testid="response-text"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {responseText.length}/500 characters
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => respondMutation.mutate()}
                disabled={respondMutation.isPending || !responseText.trim()}
                className="flex-1"
                data-testid="submit-response"
              >
                {respondMutation.isPending ? "Submitting..." : "Submit Response"}
              </Button>
              <Button
                onClick={() => setIsRespondingOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditingOpen} onOpenChange={setIsEditingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            reservationId={review.reservationId}
            subjectUserId={review.subjectUserId}
            existingReview={review}
            onSuccess={() => setIsEditingOpen(false)}
            onCancel={() => setIsEditingOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportingOpen} onOpenChange={setIsReportingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Reason for reporting</label>
              <Textarea
                rows={4}
                placeholder="Please describe why you're reporting this review..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                data-testid="report-reason"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => reportMutation.mutate()}
                disabled={reportMutation.isPending || !reportReason.trim()}
                className="flex-1"
                variant="destructive"
                data-testid="submit-report"
              >
                {reportMutation.isPending ? "Reporting..." : "Report Review"}
              </Button>
              <Button
                onClick={() => setIsReportingOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(ReviewCard);
