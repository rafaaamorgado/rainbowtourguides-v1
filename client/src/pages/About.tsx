export default function About() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="relative h-96 bg-gradient-to-br from-primary via-accent to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yMCAyMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTQ4IDQ4YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">About Rainbow Tour Guides</h1>
            <p className="text-xl max-w-2xl">
              Connecting LGBTQ+ travelers with welcoming local guides around the world
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Rainbow Tour Guides was founded with a simple yet powerful vision: to make travel safer, more authentic, and more
              inclusive for LGBTQ+ travelers worldwide. We believe that everyone deserves to explore the world with confidence,
              knowing they'll be welcomed, respected, and celebrated for who they are.
            </p>
          </section>

          <section className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The idea for Rainbow Tour Guides was born from personal experience. Our founders, avid travelers themselves,
                noticed a gap in the travel industry: while mainstream tour platforms connected travelers with local guides, they
                often overlooked the specific needs and concerns of LGBTQ+ travelers.
              </p>
              <p>
                Too many LGBTQ+ travelers faced uncomfortable situations, felt the need to hide their identities, or missed out on
                authentic local experiences because they didn't know where they'd be safe and welcome. We knew there had to be a
                better way.
              </p>
              <p>
                In 2023, we launched Rainbow Tour Guides as a platform dedicated to connecting LGBTQ+ travelers with guides who
                not only understood their needs but celebrated diversity. Today, we're proud to work with hundreds of welcoming
                guides in cities around the world, creating thousands of meaningful connections and unforgettable experiences.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <i className="fas fa-heart text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusion</h3>
                <p className="text-muted-foreground">
                  We celebrate diversity and create spaces where everyone feels welcome, respected, and valued for who they are.
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <i className="fas fa-shield-alt text-accent text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Safety</h3>
                <p className="text-muted-foreground">
                  We prioritize the safety and well-being of our travelers and guides, with thorough vetting and support systems.
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <i className="fas fa-star text-secondary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
                <p className="text-muted-foreground">
                  We facilitate genuine connections between travelers and local guides for truly authentic cultural experiences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <i className="fas fa-users text-primary"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connect Travelers & Guides</h3>
                  <p className="text-muted-foreground">
                    We provide a platform where LGBTQ+ friendly guides can showcase their expertise and travelers can find the
                    perfect local guide for their journey.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <i className="fas fa-check-circle text-accent"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verify & Support Guides</h3>
                  <p className="text-muted-foreground">
                    All guides undergo a verification process to ensure they're committed to providing welcoming, inclusive
                    experiences. We provide ongoing support and resources to our guide community.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <i className="fas fa-globe text-secondary"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Build Community</h3>
                  <p className="text-muted-foreground">
                    We're more than a booking platform—we're building a global community of inclusive travel enthusiasts who
                    believe the world is better when we explore it together.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Cities Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Verified Guides</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">5,000+</div>
                <div className="text-sm text-muted-foreground">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Trust & Safety</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your safety is our top priority. We've implemented comprehensive measures to ensure both travelers and guides have
              positive, secure experiences:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <i className="fas fa-check-circle text-primary mt-1"></i>
                <span className="text-muted-foreground">Identity verification for all guides</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-check-circle text-primary mt-1"></i>
                <span className="text-muted-foreground">Reviews and rating system for transparency</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-check-circle text-primary mt-1"></i>
                <span className="text-muted-foreground">Secure payment processing</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-check-circle text-primary mt-1"></i>
                <span className="text-muted-foreground">24/7 customer support</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-check-circle text-primary mt-1"></i>
                <span className="text-muted-foreground">Clear cancellation and refund policies</span>
              </li>
            </ul>
          </section>

          <section className="text-center bg-card rounded-2xl border border-border p-12">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a traveler looking for authentic experiences or a guide wanting to share your city with welcoming
              visitors, we'd love to have you join the Rainbow Tour Guides community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/guides"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Find a Guide
              </a>
              <a
                href="/become-guide"
                className="inline-flex items-center justify-center px-6 py-3 rainbow-gradient text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Become a Guide
              </a>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Contact Us <i className="fas fa-arrow-right text-sm"></i>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
