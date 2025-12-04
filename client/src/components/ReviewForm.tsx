import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import type { Review } from "@shared/schema";

interface ReviewFormProps {
  reservationId: string;
  subjectUserId: string;
  existingReview?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  reservationId,
  subjectUserId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const user = getUser();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [text, setText] = useState<string>(existingReview?.text || "");

  const isEditing = !!existingReview;
  const canEdit = existingReview &&
    new Date().getTime() - new Date(existingReview.createdAt).getTime() < 24 * 60 * 60 * 1000;

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to leave a review");
      if (rating === 0) throw new Error("Please select a rating");
      if (!text.trim()) throw new Error("Please write a review");
      if (text.length > 500) throw new Error("Review must be 500 characters or less");

      if (isEditing && existingReview) {
        const response = await apiRequest("PATCH", `/api/reviews/${existingReview.id}`, {
          rating,
          text: text.trim(),
          originalText: existingReview.originalText || existingReview.text,
          editedAt: new Date().toISOString(),
        });
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/reviews", {
          subjectUserId,
          authorUserId: user.id,
          reservationId,
          rating,
          text: text.trim(),
          status: "published",
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: isEditing ? "Review updated!" : "Review submitted!",
        description: isEditing
          ? "Your review has been updated successfully."
          : "Thank you for sharing your experience.",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: isEditing ? "Failed to update review" : "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isEditing && !canEdit) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          Reviews can only be edited within 24 hours of posting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="review-form">
      <div>
        <label className="block text-sm font-medium mb-3">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus-ring rounded"
              data-testid={`star-${value}`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          rows={4}
          placeholder="Share your experience with this guide..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          data-testid="review-text"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {text.length}/500 characters
        </p>
      </div>

      {isEditing && existingReview && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <i className="fas fa-info-circle mr-2"></i>
            You can edit your review within 24 hours of posting.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => submitReviewMutation.mutate()}
          disabled={submitReviewMutation.isPending || rating === 0 || !text.trim()}
          className="flex-1 rainbow-gradient text-white"
          data-testid="submit-review"
        >
          {submitReviewMutation.isPending
            ? (isEditing ? "Updating..." : "Submitting...")
            : (isEditing ? "Update Review" : "Submit Review")}
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            data-testid="cancel-review"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
