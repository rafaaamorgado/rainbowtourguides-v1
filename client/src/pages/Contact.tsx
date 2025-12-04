import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export default function Contact() {
  const { toast } = useToast();
  const user = getUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    message: "",
    gdprConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters";
    }

    if (!formData.gdprConsent) {
      newErrors.gdprConsent = "You must accept the privacy policy to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiRequest("POST", "/api/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        gdprConsent: formData.gdprConsent,
        userId: user?.id,
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setSubmissionId(data.submissionId);
        toast({
          title: "Message sent!",
          description: data.message,
        });
      } else {
        setErrors({ general: data.error || "Failed to send message" });
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionId("");
    setFormData({
      name: user?.displayName || "",
      email: user?.email || "",
      subject: "",
      message: "",
      gdprConsent: false,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted/30 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold mb-4">Message Received!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for contacting Rainbow Tour Guides. We've received your message and will respond within 24-48 hours.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Reference ID: <span className="font-mono font-semibold">{submissionId.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleReset}
                variant="outline"
              >
                Send Another Message
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                className="rainbow-gradient text-white"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help? We're here for you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {errors.general}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={isSubmitting}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isSubmitting}
                    maxLength={2000}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between text-xs">
                    <div>
                      {errors.message && (
                        <span className="text-destructive">{errors.message}</span>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {formData.message.length}/2000
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="gdpr"
                      checked={formData.gdprConsent}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, gdprConsent: checked as boolean })
                      }
                      disabled={isSubmitting}
                      className={errors.gdprConsent ? "border-destructive" : ""}
                    />
                    <label htmlFor="gdpr" className="text-sm leading-tight cursor-pointer">
                      I agree to the{" "}
                      <a href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                        Privacy Policy
                      </a>{" "}
                      and consent to Rainbow Tour Guides storing and processing my personal information to respond to my inquiry. <span className="text-destructive">*</span>
                    </label>
                  </div>
                  {errors.gdprConsent && (
                    <p className="text-xs text-destructive ml-7">{errors.gdprConsent}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rainbow-gradient text-white hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-envelope text-primary"></i>
                Email Us
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                For general inquiries:
              </p>
              <a href="mailto:hello@rainbowtourguides.com" className="text-sm text-primary hover:underline">
                hello@rainbowtourguides.com
              </a>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-clock text-primary"></i>
                Response Time
              </h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24-48 hours during business days (Monday-Friday).
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-question-circle text-primary"></i>
                FAQ
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Looking for quick answers? Check out our Help Center for frequently asked questions.
              </p>
              <a href="/help" className="text-sm text-primary hover:underline flex items-center gap-1">
                Visit Help Center <i className="fas fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
