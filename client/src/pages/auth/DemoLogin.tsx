import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { saveUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Role, User } from "@shared/schema";

export default function DemoLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("traveler");
  const [displayName, setDisplayName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [useExisting, setUseExisting] = useState(false);

  const { data: demoUsers } = useQuery<{ travelers: User[], guides: User[], admins: User[] }>({
    queryKey: ["/api/auth/demo-users"],
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (useExisting && !selectedUserId) {
        throw new Error("Please select a user");
      }
      if (!useExisting && !displayName.trim()) {
        throw new Error("Please enter a display name");
      }

      const response = await apiRequest("POST", "/api/auth/demo-login", {
        role,
        displayName: useExisting ? undefined : displayName.trim(),
        userId: useExisting ? selectedUserId : undefined,
      });

      return response.json();
    },
    onSuccess: (data) => {
      saveUser(data.user);
      toast({
        title: "Welcome!",
        description: `Logged in as ${data.user.displayName} (${data.user.role})`,
      });

      // Redirect based on role
      if (data.user.role === "admin") {
        setLocation("/admin");
      } else if (data.user.role === "guide") {
        setLocation("/dashboard/guide");
      } else {
        setLocation("/dashboard/traveler");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full rainbow-gradient flex items-center justify-center">
              <i className="fas fa-compass text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">Demo Login</h1>
            <p className="text-muted-foreground">
              Try the platform without creating an account
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Choose Your Role</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("traveler")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors focus-ring ${
                    role === "traveler"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                  data-testid="button-role-traveler"
                >
                  <i className="fas fa-suitcase text-2xl mb-2 block"></i>
                  <div className="text-sm font-medium">Traveler</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("guide")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors focus-ring ${
                    role === "guide"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                  data-testid="button-role-guide"
                >
                  <i className="fas fa-map-marked-alt text-2xl mb-2 block"></i>
                  <div className="text-sm font-medium">Guide</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors focus-ring ${
                    role === "admin"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                  data-testid="button-role-admin"
                >
                  <i className="fas fa-shield-alt text-2xl mb-2 block"></i>
                  <div className="text-sm font-medium">Admin</div>
                </button>
              </div>
            </div>

            {(role === "guide" || role === "admin") && demoUsers && (
              <div>
                <label className="block text-sm font-medium mb-2">Login Mode</label>
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant={!useExisting ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseExisting(false)}
                    data-testid="button-new-user"
                  >
                    Create New
                  </Button>
                  <Button
                    type="button"
                    variant={useExisting ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseExisting(true)}
                    data-testid="button-existing-user"
                  >
                    Use Existing
                  </Button>
                </div>
              </div>
            )}

            {useExisting && (role === "guide" || role === "admin") ? (
              <div>
                <label className="block text-sm font-medium mb-2">Select {role === "guide" ? "Guide" : "Admin"}</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger data-testid="select-existing-user">
                    <SelectValue placeholder={`Choose a ${role}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {role === "guide" && demoUsers?.guides.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                    {role === "admin" && demoUsers?.admins.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!useExisting}
                  data-testid="input-displayname"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full rainbow-gradient text-white"
              disabled={loginMutation.isPending}
              data-testid="button-demo-login"
            >
              {loginMutation.isPending ? "Logging in..." : "Continue as Demo User"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <i className="fas fa-info-circle mr-2"></i>
              This is a demonstration mode. No real authentication is performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
