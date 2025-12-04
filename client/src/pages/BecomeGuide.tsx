import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Globe, Heart, Shield, Users, Zap } from "lucide-react";
import guideHeroImage from "@assets/rainbow_tour_guides_imagery_rio_de_janeiro_v2_1759319660440.webp";

export default function BecomeGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" data-testid="text-page-title">
                Become a Guide
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Share your city with LGBTQ+ travelers from around the world. Build meaningful connections while earning money doing what you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/demo-login">
                  <a>
                    <Button size="lg" className="rainbow-gradient text-white" data-testid="button-get-started">
                      Get Started
                    </Button>
                  </a>
                </Link>
                <Link href="/guides">
                  <a>
                    <Button size="lg" variant="outline" data-testid="button-browse-guides">
                      Browse Guides
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl"></div>
              <img
                src={guideHeroImage}
                alt="Guides enjoying Rio de Janeiro with travelers"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Guide */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Guide with Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Make a Difference</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Help LGBTQ+ travelers experience your city in a safe, authentic, and inclusive way. Create lasting memories and build a global community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set your own hours and prices. Guide on weekends, evenings, or whenever works for you. Full control over your availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Earn Money</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Turn your local knowledge into income. Set competitive rates and keep 80% of your earnings after platform fees.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Create Profile</h3>
              <p className="text-sm text-muted-foreground">
                Sign up and tell us about yourself, your city, and what makes your tours special.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Verified</h3>
              <p className="text-sm text-muted-foreground">
                Complete a quick verification process to ensure safety and quality for our community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Set Your Rates</h3>
              <p className="text-sm text-muted-foreground">
                Choose your hourly rates and availability. Update anytime to match your schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold mb-2">Start Guiding</h3>
              <p className="text-sm text-muted-foreground">
                Receive booking requests, accept tours, and start sharing your city with travelers!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Need */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Local Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Deep knowledge of your city's LGBTQ+ scene, hidden gems, and local culture.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Passion for Hospitality</h3>
                <p className="text-sm text-muted-foreground">
                  Love meeting new people and creating memorable experiences for travelers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Flexible Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Ability to host tours on weekends, evenings, or during your free time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Good Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Fluency in English and/or other languages to communicate with international travelers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Commitment to Safety</h3>
                <p className="text-sm text-muted-foreground">
                  Dedication to providing safe, inclusive experiences for LGBTQ+ travelers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Valid ID</h3>
                <p className="text-sm text-muted-foreground">
                  Government-issued identification for verification purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Support */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Safety & Support</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-4" />
                <CardTitle>Verified Travelers Only</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All travelers go through verification. You'll know who you're meeting before accepting any tour request.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team is here to help with any questions or concerns. Access support anytime, anywhere during your tours.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Guiding?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community of passionate local guides and start sharing your city today.
          </p>
          <Link href="/auth/demo-login">
            <a>
              <Button size="lg" className="rainbow-gradient text-white" data-testid="button-signup">
                Sign Up Now
              </Button>
            </a>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Have questions? Check out our <a href="#help" className="text-primary hover:underline">FAQ</a> or contact us.
          </p>
        </div>
      </section>
    </div>
  );
}
