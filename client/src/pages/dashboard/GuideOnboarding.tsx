import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { calculateTourPrice, formatPrice } from "@/lib/pricing";
import type { City, GuideProfile } from "@shared/schema";

const STEPS = [
  { number: 1, title: "Basic Info", icon: "fa-user" },
  { number: 2, title: "Location & Languages", icon: "fa-globe" },
  { number: 3, title: "Expertise & Rates", icon: "fa-star" },
  { number: 4, title: "Photos & Bio", icon: "fa-camera" },
  { number: 5, title: "Verification", icon: "fa-shield-check" },
];

export default function GuideOnboarding() {
  const user = getUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: guideProfile } = useQuery<GuideProfile>({
    queryKey: ["/api/guides", user?.id],
    enabled: !!user,
  });

  const [currentStep, setCurrentStep] = useState(guideProfile?.onboardingStep || 1);
  const { data: cities } = useQuery<City[]>({
    queryKey: ["/api/cities"],
  });

  const [formData, setFormData] = useState({
    // Step 1
    displayName: guideProfile?.displayName || "",
    handle: guideProfile?.handle || "",
    tagline: guideProfile?.tagline || "",
    yearsExperience: guideProfile?.yearsExperience || 0,

    // Step 2
    cityId: guideProfile?.cityId || "",
    city: guideProfile?.city || "",
    country: guideProfile?.country || "",
    timezone: guideProfile?.timezone || "UTC",
    languages: guideProfile?.languages || [],

    // Step 3
    themes: guideProfile?.themes || [],
    maxGroupSize: guideProfile?.maxGroupSize || 6,
    baseRateHour: guideProfile?.baseRateHour || 25,
    prices: guideProfile?.prices || { h4: 100, h6: 140, h8: 180, currency: "USD" },
    meetupPref: guideProfile?.meetupPref || { type: "central_location", defaultLocation: "" },

    // Step 4
    bio: guideProfile?.bio || "",
    photos: guideProfile?.photos || [],

    // Step 5
    verificationDocs: [],
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/guides/${user?.id}`, {
        ...data,
        city_id: formData.cityId || null,
        baseRateHour: formData.baseRateHour || null,
        onboardingStep: currentStep,
        onboarding_data: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guides"] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/guides/${user?.id}`, {
        ...formData,
        city_id: formData.cityId || null,
        baseRateHour: formData.baseRateHour || null,
        onboarding_completed: true,
        onboardingStep: 5,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Rainbow Tour Guides!",
        description: "Your guide profile is now live. Start accepting bookings!",
      });
      setLocation("/dashboard/guide");
    },
  });

  const handleNext = () => {
    saveProgressMutation.mutate(formData);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboardingMutation.mutate();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string) => {
    if (value.trim()) {
      updateFormData(field, [...(formData[field as keyof typeof formData] as string[]), value.trim()]);
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const array = formData[field as keyof typeof formData] as string[];
    updateFormData(field, array.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, idx) => (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <p className="text-xs mt-2 text-center">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            {STEPS[currentStep - 1].title}
          </h1>
          <p className="text-muted-foreground mb-8">
            Step {currentStep} of 5 - Complete your guide profile
          </p>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label>Display Name*</Label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => updateFormData("displayName", e.target.value)}
                  placeholder="How travelers will see your name"
                />
              </div>
              <div>
                <Label>Profile Handle*</Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 bg-muted rounded-l-lg text-muted-foreground">
                    rainbow.tours/
                  </span>
                  <Input
                    value={formData.handle}
                    onChange={(e) => updateFormData("handle", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-unique-handle"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be your unique URL
                </p>
              </div>
              <div>
                <Label>Tagline*</Label>
                <Input
                  value={formData.tagline}
                  onChange={(e) => updateFormData("tagline", e.target.value)}
                  placeholder="e.g., Barcelona's LGBTQ+ nightlife expert"
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.tagline.length}/80 characters
                </p>
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) => updateFormData("yearsExperience", parseInt(e.target.value) || 0)}
                  placeholder="How long have you been guiding?"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location & Languages */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>City*</Label>
                <select
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                  value={formData.cityId}
                  onChange={(e) => {
                    const selectedCity = cities?.find(c => c.id === e.target.value);
                    updateFormData("cityId", e.target.value);
                    if (selectedCity) {
                      updateFormData("city", selectedCity.name);
                      updateFormData("country", selectedCity.country_code);
                      updateFormData("timezone", selectedCity.timezone);
                    }
                  }}
                >
                  <option value="">Select your city...</option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.countryCode}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose the city where you offer tours
                </p>
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  disabled
                  className="bg-muted"
                  placeholder="Auto-filled when you select a city"
                />
              </div>
              <div>
                <Label>Timezone*</Label>
                <select
                  className="w-full px-4 py-2 border border-input rounded-lg"
                  value={formData.timezone}
                  onChange={(e) => updateFormData("timezone", e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris/Madrid/Berlin</option>
                  <option value="Asia/Bangkok">Bangkok</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              <div>
                <Label>Languages Spoken*</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a language"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray("languages", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      {lang}
                      <button onClick={() => removeFromArray("languages", idx)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Expertise & Rates */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Tour Themes/Specialties*</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="e.g., Food & Drink, Nightlife, History"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray("themes", (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.themes.map((theme, idx) => (
                    <span key={idx} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm flex items-center gap-2">
                      {theme}
                      <button onClick={() => removeFromArray("themes", idx)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle text-primary"></i>
                  New Pricing Model
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your base hourly rate. Travelers automatically get discounts for longer tours:
                  6 hours = 5% off, 8 hours = 10% off.
                </p>
              </div>

              <div>
                <Label>Base Hourly Rate (USD)*</Label>
                <Input
                  type="number"
                  min="15"
                  max="200"
                  step="5"
                  value={formData.baseRateHour}
                  onChange={(e) => updateFormData("baseRateHour", parseInt(e.target.value) || 25)}
                  placeholder="25"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: $20-50/hour depending on experience and city
                </p>
              </div>

              {formData.baseRateHour > 0 && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">4-Hour Tour</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(calculateTourPrice(formData.baseRateHour, 4).total)}
                    </div>
                    <div className="text-xs text-muted-foreground">Standard rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">6-Hour Tour</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(calculateTourPrice(formData.baseRateHour, 6).total)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">5% discount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">8-Hour Tour</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(calculateTourPrice(formData.baseRateHour, 8).total)}
                    </div>
                    <div className="text-xs text-green-600 font-medium">10% discount</div>
                  </div>
                </div>
              )}
              <div>
                <Label>Maximum Group Size*</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.maxGroupSize}
                  onChange={(e) => updateFormData("maxGroupSize", parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Default Meeting Location*</Label>
                <Input
                  value={formData.meetupPref.defaultLocation}
                  onChange={(e) => updateFormData("meetupPref", { ...formData.meetupPref, defaultLocation: e.target.value })}
                  placeholder="e.g., Plaza Catalunya metro station"
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos & Bio */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label>Biography*</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Tell travelers about yourself, your experience, and what makes your tours special..."
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length} characters - Be authentic and welcoming!
                </p>
              </div>
              <div>
                <Label>Profile Photos</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  For this demo, add photo URLs. In production, you'd upload images here.
                </p>
                <Input
                  placeholder="Paste image URL and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addToArray("photos", (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img src={photo} alt="" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removeFromArray("photos", idx)}
                        className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Verification */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-shield-check text-amber-600"></i>
                  Identity Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  To ensure traveler safety, all guides must verify their identity. This step can be completed later, but you won't be able to accept bookings until verified.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Government ID (Front)*</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Passport, driver's license, or national ID
                  </p>
                  <Input type="file" accept="image/*" />
                </div>
                <div>
                  <Label>Selfie with ID*</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Hold your ID next to your face
                  </p>
                  <Input type="file" accept="image/*" />
                </div>
                <div>
                  <Label>Additional Documents (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Tour guide license, certificates, etc.
                  </p>
                  <Input type="file" accept="image/*,application/pdf" multiple />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className="rainbow-gradient text-white"
              >
                Save & Continue
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="rainbow-gradient text-white"
                disabled={completeOnboardingMutation.isPending}
              >
                {completeOnboardingMutation.isPending ? "Completing..." : "Complete Onboarding"}
                <i className="fas fa-check ml-2"></i>
              </Button>
            )}
          </div>

          {/* Save Progress Notice */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            <i className="fas fa-save mr-1"></i>
            Your progress is automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}
