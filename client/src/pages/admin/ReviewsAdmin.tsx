import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Review } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function ReviewsAdmin() {
  const { toast } = useToast();
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const statusColors = {
    published: "bg-green-100 text-green-700",
    hidden: "bg-gray-100 text-gray-700",
    reported: "bg-red-100 text-red-700",
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "published" | "hidden" | "reported" }) => {
      const response = await apiRequest("PATCH", `/api/admin/reviews/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "Review updated",
        description: "Review status has been changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reviews</h2>
        <p className="text-muted-foreground" data-testid="text-reviews-count">
          {reviews?.length || 0} total reviews
        </p>
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <div
            key={review.id}
            className="border border-border rounded-xl p-5"
            data-testid={`card-review-${review.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500 text-sm">
                  {"⭐".repeat(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[review.status]}`}>
                {review.status}
              </span>
            </div>

            <p className="text-muted-foreground mb-4">{review.text}</p>

            {review.responseText && (
              <div className="p-3 bg-muted/50 rounded-lg mb-4">
                <div className="text-sm font-medium mb-1">Guide Response:</div>
                <div className="text-sm text-muted-foreground">{review.responseText}</div>
              </div>
            )}

            <div className="flex gap-2">
              {review.status !== "published" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatusMutation.mutate({ id: review.id, status: "published" })}
                  disabled={updateStatusMutation.isPending}
                  data-testid={`button-publish-${review.id}`}
                >
                  <i className="fas fa-check mr-2"></i>Publish
                </Button>
              )}
              {review.status !== "hidden" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatusMutation.mutate({ id: review.id, status: "hidden" })}
                  disabled={updateStatusMutation.isPending}
                  data-testid={`button-hide-${review.id}`}
                >
                  <i className="fas fa-eye-slash mr-2"></i>Hide
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                data-testid={`button-view-${review.id}`}
              >
                <i className="fas fa-eye mr-2"></i>View Details
              </Button>
            </div>
          </div>
        ))}

        {reviews?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reviews found
          </div>
        )}
      </div>
    </div>
  );
}
