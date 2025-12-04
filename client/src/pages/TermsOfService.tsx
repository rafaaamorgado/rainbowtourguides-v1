export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 shadow-xl">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Rainbow Tour Guides. By accessing or using our website and services, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are
                prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rainbow Tour Guides is a marketplace platform that connects travelers with local LGBTQ+ friendly tour guides.
                We provide the technology and infrastructure to facilitate these connections, but we are not a tour operator and
                do not provide tours directly. All tours are provided by independent guides who use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Registration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use certain features of our service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Eligibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to create an account and use our services. By creating an account, you represent
                and warrant that you meet this age requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 For Travelers</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a traveler using our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate booking information including dates, times, and group size</li>
                <li>Arrive on time for scheduled tours</li>
                <li>Treat guides with respect and courtesy</li>
                <li>Pay the agreed-upon fees for services rendered</li>
                <li>Follow the guide's reasonable instructions during the tour</li>
                <li>Leave honest and fair reviews based on your actual experience</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 For Guides</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a guide using our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate information about your services, availability, and pricing</li>
                <li>Honor all confirmed bookings or provide adequate notice of cancellation</li>
                <li>Provide services professionally and with reasonable care and skill</li>
                <li>Maintain any required licenses, permits, or insurance</li>
                <li>Treat all travelers with respect regardless of their background</li>
                <li>Keep traveler information confidential</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Booking and Payment Terms</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Booking Process</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you request a booking through our platform, you are making an offer to the guide to provide services at the
                stated price. The booking becomes binding when the guide accepts your request.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Pricing and Fees</h3>
              <p className="text-muted-foreground leading-relaxed">
                All prices are set by individual guides and displayed in their local currency or USD. Rainbow Tour Guides charges
                a service fee to travelers and a commission to guides for each completed booking. These fees will be clearly
                displayed before you confirm your booking.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Payment Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payments are processed securely through our third-party payment processors. We do not store your complete payment
                information on our servers. By providing payment information, you authorize us to charge your payment method for
                the total booking amount.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cancellation and Refund Policy</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Traveler Cancellations</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>More than 7 days before tour:</strong> Full refund minus service fees</li>
                <li><strong>3-7 days before tour:</strong> 50% refund</li>
                <li><strong>Less than 3 days before tour:</strong> No refund</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Guide Cancellations</h3>
              <p className="text-muted-foreground leading-relaxed">
                If a guide cancels a confirmed booking, the traveler will receive a full refund including all fees. Guides who
                frequently cancel bookings may have their accounts suspended or terminated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violate any local, state, national, or international law</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Transmit any harmful, offensive, or discriminatory content</li>
                <li>Harass, threaten, or intimidate other users</li>
                <li>Attempt to circumvent our payment system</li>
                <li>Create multiple accounts or fake accounts</li>
                <li>Use automated systems to access the platform</li>
                <li>Interfere with or disrupt the platform's functionality</li>
                <li>Collect or harvest personal information about other users</li>
                <li>Post false or misleading reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Content and Intellectual Property</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 User Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you post on the platform, including reviews, photos, and messages. However,
                by posting content, you grant Rainbow Tour Guides a worldwide, non-exclusive, royalty-free license to use,
                reproduce, and display such content in connection with operating and promoting the platform.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Platform Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                All content on the Rainbow Tour Guides platform, including text, graphics, logos, images, and software, is the
                property of Rainbow Tour Guides or its licensors and is protected by copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations of Liability</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Service "As Is"</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rainbow Tour Guides provides the platform "as is" and "as available" without warranties of any kind, either express
                or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">9.2 Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Rainbow Tour Guides shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
                indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">9.3 Guide Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                Rainbow Tour Guides is not responsible for the conduct, quality, or safety of tours provided by independent guides.
                We strongly encourage travelers to research guides, read reviews, and use common sense when booking tours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless Rainbow Tour Guides and its officers, directors, employees, and
                agents from any claims, liabilities, damages, losses, and expenses arising from your violation of these Terms or
                your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">11.1 Informal Resolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have a dispute with Rainbow Tour Guides, please contact us first to attempt to resolve it informally.
                We are committed to working with users to reach a fair resolution.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">11.2 Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Rainbow
                Tour Guides is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the
                updated Terms on this page and updating the "Last updated" date. Your continued use of the platform after changes
                become effective constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account and access to the platform at our sole discretion,
                without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third
                parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="font-semibold">Rainbow Tour Guides</p>
                <p className="text-muted-foreground">Email: legal@rainbowtourguides.com</p>
                <p className="text-muted-foreground">
                  Contact Form: <a href="/contact" className="text-primary hover:underline">rainbowtourguides.com/contact</a>
                </p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                By using Rainbow Tour Guides, you acknowledge that you have read, understood, and agree to be bound by these
                Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
