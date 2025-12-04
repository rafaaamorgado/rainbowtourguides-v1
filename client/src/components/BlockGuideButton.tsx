import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";

interface BlockGuideButtonProps {
  guideId: string;
  guideName: string;
  onBlocked?: () => void;
}

export default function BlockGuideButton({ guideId, guideName, onBlocked }: BlockGuideButtonProps) {
  const user = getUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const blockMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to block guides");

      const response = await apiRequest("POST", "/api/blocked-guides", {
        traveler_id: user.id,
        guide_id: guideId,
        reason: reason.trim() || null,
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Guide blocked",
        description: `${guideName} will no longer appear in your search results.`,
      });
      setIsOpen(false);
      setReason("");
      onBlocked?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to block guide",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-destructive"
      >
        <i className="fas fa-ban mr-2"></i>
        Block Guide
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Block {guideName}?</DialogTitle>
            <DialogDescription>
              This guide will no longer appear in your search results. You can unblock them later from your account settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">
                Reason (Optional)
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know why you're blocking this guide..."
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => blockMutation.mutate()}
              disabled={blockMutation.isPending}
            >
              {blockMutation.isPending ? "Blocking..." : "Block Guide"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
