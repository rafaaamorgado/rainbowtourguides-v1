import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabaseSignUp, supabaseSignIn, signInWithGoogle, signInWithApple } from "@/lib/supabaseAuth";
import { saveUser } from "@/lib/auth";
import { useLocation } from "wouter";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
  contextMessage?: string;
  returnUrl?: string;
}

const RETURN_URL_KEY = "auth_return_url";

export default function AuthModal({ isOpen, onClose, defaultTab = "signin", contextMessage, returnUrl }: AuthModalProps) {
  const [currentPath] = useLocation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  // Save return URL when modal opens
  useEffect(() => {
    if (isOpen && returnUrl) {
      try {
        localStorage.setItem(RETURN_URL_KEY, returnUrl);
      } catch (error) {
        console.error("Failed to save return URL:", error);
      }
    } else if (isOpen && !returnUrl) {
      try {
        localStorage.setItem(RETURN_URL_KEY, currentPath);
      } catch (error) {
        console.error("Failed to save return URL:", error);
      }
    }
  }, [isOpen, returnUrl, currentPath]);

  // Helper to get and clear return URL
  const getReturnUrl = (): string => {
    try {
      const url = localStorage.getItem(RETURN_URL_KEY);
      localStorage.removeItem(RETURN_URL_KEY);
      return url || "/dashboard/traveler";
    } catch (error) {
      console.error("Failed to get return URL:", error);
      return "/dashboard/traveler";
    }
  };

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "traveler" as "traveler" | "guide",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!signInData.email || !signInData.password) {
      setErrors({ general: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(signInData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await supabaseSignIn(signInData.email, signInData.password);

      if (result.error) {
        setErrors({ general: result.error });
      } else if (result.user) {
        saveUser(result.user);
        toast({
          title: "Welcome back!",
          description: `Signed in as ${result.user.displayName}`,
        });
        onClose();
        const destination = getReturnUrl();
        setLocation(destination);
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign in" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (!signUpData.displayName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setErrors({ general: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(signUpData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      setIsLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    if (!signUpData.acceptTerms) {
      setErrors({ terms: "You must accept the terms and conditions" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await supabaseSignUp(
        signUpData.email,
        signUpData.password,
        signUpData.displayName,
        signUpData.role
      );

      if (result.error) {
        setErrors({ general: result.error });
      } else if (result.user) {
        saveUser(result.user);
        toast({
          title: "Account created!",
          description: "Welcome to Rainbow Tour Guides",
        });
        onClose();
        const destination = getReturnUrl();
        setLocation(destination);
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create account" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = provider === "google"
        ? await signInWithGoogle()
        : await signInWithApple();

      if (result.error) {
        setErrors({ general: result.error });
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to sign in" });
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSignInData({ email: "", password: "" });
    setSignUpData({ displayName: "", email: "", password: "", confirmPassword: "", role: "traveler", acceptTerms: false });
    setErrors({});
    setActiveTab(defaultTab);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Welcome to Rainbow Tour Guides
          </DialogTitle>
          {contextMessage && (
            <p className="text-center text-sm text-muted-foreground mt-2">{contextMessage}</p>
          )}
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-4">
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
              >
                <i className="fab fa-google mr-2"></i>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("apple")}
                disabled={isLoading}
              >
                <i className="fab fa-apple mr-2"></i>
                Continue with Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full rainbow-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
              >
                <i className="fab fa-google mr-2"></i>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleOAuthSignIn("apple")}
                disabled={isLoading}
              >
                <i className="fab fa-apple mr-2"></i>
                Continue with Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="signup-name">Display Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your name"
                  value={signUpData.displayName}
                  onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
                <Label className="text-sm font-medium">I want to join as:</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSignUpData({ ...signUpData, role: "traveler" })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      signUpData.role === "traveler"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-center">
                      <i className="fas fa-plane-departure text-xl mb-1"></i>
                      <div className="font-medium">Traveler</div>
                      <div className="text-xs text-muted-foreground">Book tours</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpData({ ...signUpData, role: "guide" })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      signUpData.role === "guide"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-center">
                      <i className="fas fa-map-marked-alt text-xl mb-1"></i>
                      <div className="font-medium">Guide</div>
                      <div className="text-xs text-muted-foreground">Offer tours</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={signUpData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setSignUpData({ ...signUpData, acceptTerms: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                  I accept the{" "}
                  <a href="/terms-of-service" className="text-primary hover:underline" target="_blank">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </a>
                  ,{" "}
                  <a href="/help-center#refund-policy" className="text-primary hover:underline" target="_blank">
                    Refund Policy
                  </a>
                  , and{" "}
                  <a href="/help-center#community-guidelines" className="text-primary hover:underline" target="_blank">
                    Community Guidelines
                  </a>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

              <Button
                type="submit"
                className="w-full rainbow-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          By continuing, you agree to our Terms and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}
