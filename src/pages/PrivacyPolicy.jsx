import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-gold text-sm hover:text-gold-light transition-colors">&larr; Back to Home</Link>
        <h1 className="font-serif text-4xl text-white mt-6 mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last Updated: April 13, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Introduction</h2>
            <p>The Law Office of Justin D. Leigh ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website justindleigh.com, our client portal at portal.justindleigh.com, or use any of our online services.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following categories of personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Contact Information:</span> Name, email address, phone number</li>
              <li><span className="text-white/90 font-medium">Case Information:</span> Subject matter of inquiry, description of legal matter, opposing party names, court case numbers, whether a real estate inquiry</li>
              <li><span className="text-white/90 font-medium">Referral Information:</span> How you heard about our office</li>
              <li><span className="text-white/90 font-medium">Consultation Preferences:</span> Preferred date and time for consultation</li>
              <li><span className="text-white/90 font-medium">Client Portal Data:</span> Documents you upload, case status information, messages between you and our office</li>
              <li><span className="text-white/90 font-medium">Technical Data:</span> IP address, browser type, and device information collected automatically when you visit our site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. How We Collect Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Directly from you when you submit a contact form, consultation request, or AI inquiry form</li>
              <li>Through our client portal when you upload documents or communicate with our office</li>
              <li>Through Google Local Service Ads when you contact us via a Google LSA listing (note: Google may record these calls; see Section 9)</li>
              <li>Through our phone system when you call our office (calls may be recorded for quality and documentation purposes)</li>
              <li>Automatically through cookies and similar technologies when you browse our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To respond to your inquiries and provide legal services</li>
              <li>To evaluate potential conflicts of interest before establishing representation</li>
              <li>To communicate with you about your legal matter</li>
              <li>To manage your account on our client portal</li>
              <li>To send you important notices regarding your case or our services</li>
              <li>To comply with legal and ethical obligations</li>
              <li>To improve our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. How We Store and Protect Your Information</h2>
            <p className="mb-3">Your information is stored using Supabase, a SOC 2 Type II certified cloud database platform with encryption at rest and in transit. Our website and client portal are served over HTTPS with TLS encryption. Access to client data is restricted to authorized personnel only through role-based access controls and multi-factor authentication.</p>
            <p>While we implement commercially reasonable security measures, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security of your information.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Third-Party Service Providers</h2>
            <p className="mb-3">We use the following third-party services that may process your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Supabase:</span> Database hosting and authentication</li>
              <li><span className="text-white/90 font-medium">Vercel:</span> Website hosting</li>
              <li><span className="text-white/90 font-medium">Resend:</span> Email delivery for notifications and correspondence</li>
              <li><span className="text-white/90 font-medium">Google:</span> Maps embed on contact page, Local Service Ads, Google Calendar integration</li>
              <li><span className="text-white/90 font-medium">Quo (formerly OpenPhone):</span> Phone system with call recording and transcription</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Cookies and Tracking Technologies</h2>
            <p>Our website may use cookies and similar technologies for functionality purposes, including the Google Maps embed on our contact page. We do not use cookies for advertising or behavioral tracking. Your browser settings allow you to manage or disable cookies.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><span className="text-white/90 font-medium">Access:</span> Request a copy of the personal information we hold about you</li>
              <li><span className="text-white/90 font-medium">Correction:</span> Request correction of inaccurate personal information</li>
              <li><span className="text-white/90 font-medium">Deletion:</span> Request deletion of your personal information, subject to legal and ethical retention obligations</li>
              <li><span className="text-white/90 font-medium">Portability:</span> Request your data in a portable format</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us using the information in Section 12. We will respond to your request within 45 days.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Google Local Service Ads</h2>
            <p>If you contact us through a Google Local Service Ad, please be aware that Google may record the phone call. These recordings are stored by Google and are subject to Google's own privacy policies. <span className="text-white/90 font-medium">Call recordings made by Google through Local Service Ads are not protected by attorney-client privilege.</span> An attorney-client relationship is not established through an initial contact via Google Local Service Ads. If you wish to communicate confidential information, please contact our office directly after a formal engagement has been established.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Consumer Health Data (Washington State)</h2>
            <p>In compliance with the Washington My Health My Data Act (RCW 19.373), we acknowledge that information submitted through our intake forms may incidentally include consumer health data, such as descriptions of injuries, disabilities, or medical conditions relevant to your legal matter. We collect this information solely to evaluate and provide legal services. We do not sell consumer health data. We will obtain your consent before collecting health data not necessary to provide the legal services you have requested. You may contact us to exercise your rights under the My Health My Data Act.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. Data Retention</h2>
            <p>We retain personal information for as long as necessary to fulfill the purposes for which it was collected, to comply with our legal and ethical obligations (including bar association record-keeping requirements), to resolve disputes, and to enforce our agreements. For prospective clients who do not engage our services, we generally retain contact information for conflict-checking purposes as required by the Washington Rules of Professional Conduct.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Contact Us</h2>
            <p className="mb-3">If you have questions about this Privacy Policy or wish to exercise your rights, please contact:</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <p className="text-white font-medium">Justin D. Leigh, Attorney at Law</p>
              <p>Law Office of Justin D. Leigh</p>
              <p>Goldendale, Washington</p>
              <p className="mt-2">Phone: <a href="tel:5097738469" className="text-gold hover:text-gold-light transition-colors">(509) 773-8469</a></p>
              <p>Email: <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">13. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Your continued use of our website after any changes constitutes acceptance of the revised policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
