import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import RoleGate from "@/components/RoleGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { GuideProfile, TravelerProfile } from "@shared/schema";

export default function ProfileEdit() {
  const user = getUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isGuide = user?.role === "guide";

  const { data: profile, isLoading } = useQuery<(GuideProfile | TravelerProfile)[], Error, GuideProfile | TravelerProfile | undefined>({
    queryKey: isGuide ? ["/api/guides"] : ["/api/travelers"],
    select: (profiles) => profiles.find((p) => p.uid === user?.id),
    enabled: !!user,
  });

  const [formData, setFormData] = useState<any>({
    displayName: user?.displayName || "",
    avatarUrl: user?.avatarUrl || "",
    ...(isGuide ? {
      bio: "",
      tagline: "",
      languages: [],
      themes: [],
      prices: { h4: 100, h6: 140, h8: 180 }
    } : {
      homeCountry: ""
    })
  });

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData(profile);
    } else if (user) {
      // Initialize with user data if no profile exists yet
      setFormData({
        displayName: user.displayName,
        avatarUrl: user.avatarUrl || "",
        ...(isGuide ? {
          bio: "",
          tagline: "",
          languages: [],
          themes: [],
          cityId: "",
          baseRateHour: 25,
          prices: { h4: 100, h6: 140, h8: 180 }
        } : {
          homeCountry: ""
        })
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = isGuide ? `/api/guides/${user?.id}` : `/api/travelers/${user?.id}`;
      const payload = isGuide ? {
        ...data,
        city_id: data.cityId || null,
        base_rate_hour: data.baseRateHour || null,
      } : data;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: isGuide ? ["/api/guides"] : ["/api/travelers"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setLocation(isGuide ? "/dashboard/guide" : "/dashboard/traveler");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <RoleGate allowedRoles={["traveler", "guide"]}>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setLocation(isGuide ? "/dashboard/guide" : "/dashboard/traveler")}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Edit Profile</CardTitle>
              <CardDescription>
                Update your {isGuide ? "guide" : "traveler"} profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-profile-edit">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName || ""}
                      onChange={(e) => handleChange("displayName", e.target.value)}
                      data-testid="input-displayName"
                    />
                  </div>

                  <div>
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      value={formData.avatarUrl || ""}
                      onChange={(e) => handleChange("avatarUrl", e.target.value)}
                      placeholder="https://..."
                      data-testid="input-avatarUrl"
                    />
                  </div>

                  {!isGuide && (
                    <div>
                      <Label htmlFor="homeCountry">Home Country</Label>
                      <Input
                        id="homeCountry"
                        value={formData.homeCountry || ""}
                        onChange={(e) => handleChange("homeCountry", e.target.value)}
                        placeholder="e.g., United States"
                        data-testid="input-homeCountry"
                      />
                    </div>
                  )}

                  {isGuide && (
                    <>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio || ""}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          rows={4}
                          placeholder="Tell travelers about yourself..."
                          data-testid="input-bio"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={formData.tagline || ""}
                          onChange={(e) => handleChange("tagline", e.target.value)}
                          placeholder="Your professional tagline"
                          data-testid="input-tagline"
                        />
                      </div>

                      <div>
                        <Label htmlFor="languages">Languages (comma-separated)</Label>
                        <Input
                          id="languages"
                          value={formData.languages?.join(", ") || ""}
                          onChange={(e) =>
                            handleChange(
                              "languages",
                              e.target.value.split(",").map((l) => l.trim())
                            )
                          }
                          placeholder="English, Spanish, French"
                          data-testid="input-languages"
                        />
                      </div>

                      <div>
                        <Label htmlFor="themes">Tour Themes (comma-separated)</Label>
                        <Input
                          id="themes"
                          value={formData.themes?.join(", ") || ""}
                          onChange={(e) =>
                            handleChange(
                              "themes",
                              e.target.value.split(",").map((t) => t.trim())
                            )
                          }
                          placeholder="Food & Drink, History, LGBTQ+ Nightlife"
                          data-testid="input-themes"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cityId">City</Label>
                        <select
                          id="cityId"
                          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                          value={formData.cityId || ""}
                          onChange={(e) => handleChange("cityId", e.target.value)}
                          data-testid="select-cityId"
                        >
                          <option value="">Select your city...</option>
                          {cities?.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}, {city.country_code}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="baseRateHour">Base Hourly Rate ($)</Label>
                        <Input
                          id="baseRateHour"
                          type="number"
                          min="15"
                          max="200"
                          step="5"
                          value={formData.baseRateHour || ""}
                          onChange={(e) => handleChange("baseRateHour", parseInt(e.target.value) || 0)}
                          placeholder="25"
                          data-testid="input-baseRateHour"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your hourly rate. Automatic discounts: 6h = 5% off, 8h = 10% off.
                        </p>
                      </div>

                      {formData.baseRateHour > 0 && (
                        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg text-center">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">4h Tour</div>
                            <div className="text-lg font-bold">{formatPrice(calculateTourPrice(formData.baseRateHour, 4).total)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">6h Tour</div>
                            <div className="text-lg font-bold">{formatPrice(calculateTourPrice(formData.baseRateHour, 6).total)}</div>
                            <div className="text-xs text-green-600">-5%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">8h Tour</div>
                            <div className="text-lg font-bold">{formatPrice(calculateTourPrice(formData.baseRateHour, 8).total)}</div>
                            <div className="text-xs text-green-600">-10%</div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price4h">4-Hour Rate ($)</Label>
                          <Input
                            id="price4h"
                            type="number"
                            value={formData.prices?.h4 || ""}
                            onChange={(e) =>
                              handleChange("prices", {
                                ...formData.prices,
                                h4: parseInt(e.target.value) || 0,
                              })
                            }
                            data-testid="input-price4h"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price6h">6-Hour Rate ($)</Label>
                          <Input
                            id="price6h"
                            type="number"
                            value={formData.prices?.h6 || ""}
                            onChange={(e) =>
                              handleChange("prices", {
                                ...formData.prices,
                                h6: parseInt(e.target.value) || 0,
                              })
                            }
                            data-testid="input-price6h"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price8h">8-Hour Rate ($)</Label>
                          <Input
                            id="price8h"
                            type="number"
                            value={formData.prices?.h8 || ""}
                            onChange={(e) =>
                              handleChange("prices", {
                                ...formData.prices,
                                h8: parseInt(e.target.value) || 0,
                              })
                            }
                            data-testid="input-price8h"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1"
                    data-testid="button-save"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation(isGuide ? "/dashboard/guide" : "/dashboard/traveler")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
}
