export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Rainbow Tour Guides ("we," "our," or "us"). We are committed to protecting your personal information
                and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with
                the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Register for an account</li>
                <li>Book a tour with a guide</li>
                <li>Contact us through our contact form</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in community features</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The personal information we collect may include: name, email address, phone number, profile photo, home country,
                preferred language, payment information, and any other information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you visit our website, we automatically collect certain information about your device, including information
                about your web browser, IP address, time zone, and some of the cookies installed on your device. We collect this
                information using technologies like cookies, web beacons, and similar tracking technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect or receive:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To facilitate account creation and authentication</li>
                <li>To process your bookings and transactions</li>
                <li>To send you administrative information, such as booking confirmations</li>
                <li>To respond to your inquiries and solve any issues</li>
                <li>To enable user-to-user communications (between travelers and guides)</li>
                <li>To enforce our terms, conditions, and policies</li>
                <li>To send you marketing and promotional communications (with your consent)</li>
                <li>To analyze usage and improve our services</li>
                <li>To prevent fraudulent transactions and monitor against theft</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information in the following situations:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 With Service Providers</h3>
              <p className="text-muted-foreground leading-relaxed">
                We share your information with third-party vendors, service providers, contractors, or agents who perform services
                for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer
                service, and marketing assistance.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 With Other Users</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you book a tour, we share your information with the guide to facilitate the booking. Similarly, guides' public
                profile information is visible to all users of the platform.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 For Legal Reasons</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information where required by law, court order, or governmental regulations, or to protect our
                rights, privacy, safety, or property, and/or that of our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and store certain information.
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do
                not accept cookies, you may not be able to use some portions of our service. For more information about the cookies
                we use and your choices, please see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures designed to protect the security of any
                personal information we process. However, please note that no electronic transmission over the Internet or information
                storage technology can be guaranteed to be 100% secure. While we strive to protect your personal information, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
                <li><strong>Data Portability:</strong> Request transfer of your information to another organization</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where we rely on consent</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided below. We will respond to your request
                within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this
                Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your personal
                information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, country,
                or other governmental jurisdiction where data protection laws may differ. If you are located outside the United States
                and choose to provide information to us, please note that we transfer the data to the United States and process it
                there.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable
                information from children under 18. If you become aware that a child has provided us with personal information, please
                contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
                on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any
                changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions or comments about this Privacy Policy, please contact us at:
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
                This Privacy Policy is provided as a comprehensive guide to our data practices. We are committed to transparency
                and protecting your privacy rights in accordance with applicable data protection laws, including GDPR and CCPA.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
