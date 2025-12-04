export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are
                widely used to make websites work more efficiently, provide information to website owners, and improve user
                experience. Cookies allow websites to remember your actions and preferences over time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rainbow Tour Guides uses cookies to enhance your experience on our platform, understand how you use our services,
                and deliver personalized content. We use both first-party cookies (set by us) and third-party cookies (set by
                other services we use).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Essential Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies are necessary for the website to function and cannot be switched off. They are usually only set in
                response to actions you take, such as logging in, filling in forms, or setting privacy preferences.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Examples:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li><code>session_token</code> - Maintains your logged-in state</li>
                  <li><code>csrf_token</code> - Protects against cross-site request forgery</li>
                  <li><code>cookie_consent</code> - Stores your cookie preferences</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Analytics Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information
                anonymously. This helps us improve our website and services.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Examples:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li><code>_ga</code> - Google Analytics: Distinguishes unique users</li>
                  <li><code>_gid</code> - Google Analytics: Distinguishes users</li>
                  <li><code>_gat</code> - Google Analytics: Throttles request rate</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Marketing Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies track your visit to our website and the pages you view. They may be set by us or by third-party
                advertising partners. They help us deliver relevant advertisements and measure the effectiveness of our campaigns.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Examples:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li><code>_fbp</code> - Facebook Pixel: Tracks conversions and user behavior</li>
                  <li><code>li_sugr</code> - LinkedIn: Browser identification for ads</li>
                  <li><code>IDE</code> - Google DoubleClick: Serves targeted advertisements</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.4 Preference Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These cookies enable the website to remember choices you make (such as language, currency, or region) and provide
                enhanced, personalized features.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold mb-2">Examples:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li><code>user_language</code> - Stores your language preference</li>
                  <li><code>currency_pref</code> - Remembers your currency selection</li>
                  <li><code>theme_mode</code> - Saves your dark/light mode preference</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use services from third parties that may set their own cookies. These include:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Google Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use Google Analytics to understand how visitors use our site. Google Analytics collects information anonymously
                and reports website trends without identifying individual visitors. You can opt out of Google Analytics by
                installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Social Media Platforms</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our website includes social media features and widgets. These features may collect your IP address and which page
                you're visiting, and may set a cookie to enable the feature to function properly. Social media features are either
                hosted by third parties or hosted directly on our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookie Duration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies can be "session cookies" or "persistent cookies":
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser. They help
                  us track your actions during a single browsing session.
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them. They
                  help us recognize you when you return to our website and remember your preferences.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Managing Your Cookie Preferences</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Using Our Cookie Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can manage your cookie preferences at any time using our cookie settings tool. Click the button below to open
                the settings:
              </p>
              <div className="flex justify-center my-6">
                <button
                  onClick={() => {
                    const event = new CustomEvent('openCookieSettings');
                    window.dispatchEvent(event);
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Manage Cookie Settings
                </button>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can set your browser to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies when you close your browser</li>
                <li>Notify you before a cookie is set</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Browser-Specific Instructions</h3>
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Google Chrome</p>
                  <p className="text-sm text-muted-foreground">
                    Settings → Privacy and security → Cookies and other site data
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Mozilla Firefox</p>
                  <p className="text-sm text-muted-foreground">
                    Settings → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Safari</p>
                  <p className="text-sm text-muted-foreground">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Microsoft Edge</p>
                  <p className="text-sm text-muted-foreground">
                    Settings → Cookies and site permissions → Manage and delete cookies
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you disable or refuse cookies, please note that some parts of our website may become inaccessible or not
                function properly. For example, you may not be able to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                <li>Stay logged into your account</li>
                <li>Make bookings or complete transactions</li>
                <li>Save your preferences and settings</li>
                <li>Access personalized content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Do Not Track Signals</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers incorporate a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want
                to have your online activity tracked. Currently, there is no industry standard for how DNT signals should be
                interpreted. Rainbow Tour Guides does not currently respond to DNT signals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
                legal, or regulatory reasons. We encourage you to review this policy periodically. The "Last updated" date at the
                top indicates when this policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold">Rainbow Tour Guides</p>
                <p className="text-muted-foreground">Email: privacy@rainbowtourguides.com</p>
                <p className="text-muted-foreground">
                  Contact Form: <a href="/contact" className="text-primary hover:underline">rainbowtourguides.com/contact</a>
                </p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                For more information about how we handle your personal data, please see our{" "}
                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
