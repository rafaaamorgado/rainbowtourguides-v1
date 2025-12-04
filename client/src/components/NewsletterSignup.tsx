import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function NewsletterSignup() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!gdprConsent) {
      setError("You must accept the privacy policy to continue");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/newsletter/subscribe", {
        email,
        gdprConsent,
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Subscription successful!",
          description: data.message,
        });
      } else {
        setError(data.error || "Failed to subscribe");
        toast({
          title: "Subscription failed",
          description: data.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Failed to subscribe to newsletter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background/5 rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
          <i className="fas fa-check text-green-400 text-xl"></i>
        </div>
        <h4 className="font-semibold mb-2">Check Your Email!</h4>
        <p className="text-sm text-background/80">
          We've sent you a confirmation link. Please check your inbox and click the link to complete your subscription.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-4">Subscribe to Our Newsletter</h4>
      <p className="text-sm text-background/80 mb-4">
        Get travel tips, LGBTQ+ destination guides, and exclusive offers delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
        />

        <div className="flex items-start gap-2">
          <Checkbox
            id="newsletter-gdpr"
            checked={gdprConsent}
            onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
            disabled={isLoading}
            className="mt-0.5"
          />
          <label htmlFor="newsletter-gdpr" className="text-xs text-background/80 leading-tight cursor-pointer">
            I agree to receive newsletters and accept the{" "}
            <a href="/privacy-policy" className="underline hover:text-background" target="_blank">
              Privacy Policy
            </a>
          </label>
        </div>

        {error && (
          <p className="text-xs text-red-300">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-background text-foreground hover:bg-background/90"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Subscribing...
            </>
          ) : (
            <>
              <i className="fas fa-envelope mr-2"></i>
              Subscribe
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
