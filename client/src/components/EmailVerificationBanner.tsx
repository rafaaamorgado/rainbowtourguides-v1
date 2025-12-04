import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";

export default function EmailVerificationBanner() {
  const user = getUser();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.verified || dismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!user.email) {
      toast({
        title: "Error",
        description: "Email address not found",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email sent!",
          description: "Check your inbox for the verification link.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <i className="fas fa-envelope text-amber-600 dark:text-amber-400 mr-2"></i>
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <strong className="font-semibold">Verify your email</strong>
          <p className="text-sm mt-1">
            Please verify your email address to book tours. Check your inbox for the verification link.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sending...
              </>
            ) : (
              "Resend Email"
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
