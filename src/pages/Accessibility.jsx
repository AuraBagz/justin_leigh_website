import { Link } from "react-router-dom";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-gold text-sm hover:text-gold-light transition-colors">&larr; Back to Home</Link>
        <h1 className="font-serif text-4xl text-white mt-6 mb-2">Accessibility Statement</h1>
        <p className="text-white/40 text-sm mb-12">Last Updated: April 13, 2026</p>

        <div className="space-y-8 text-white/70 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Our Commitment</h2>
            <p>The Law Office of Justin D. Leigh is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to ensure we provide equal access to all users.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Conformance Standard</h2>
            <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with a wide array of disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Accessibility Features</h2>
            <p className="mb-3">This website includes the following accessibility features:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Skip-to-main-content navigation link for keyboard users</li>
              <li>Semantic HTML structure with proper heading hierarchy</li>
              <li>ARIA labels on navigation landmarks and interactive elements</li>
              <li>Keyboard-accessible navigation and interactive components</li>
              <li>Visible focus indicators for keyboard navigation</li>
              <li>Color contrast ratios meeting WCAG AA standards (minimum 4.5:1 for text)</li>
              <li>Alternative text on all meaningful images</li>
              <li>Properly labeled form fields with associated labels</li>
              <li>Error messages announced to screen readers via ARIA live regions</li>
              <li>Reduced motion support for users with vestibular disorders</li>
              <li>Responsive design for various screen sizes and devices</li>
              <li>Text content that can be selected and copied</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Feedback</h2>
            <p className="mb-3">We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:</p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
              <p className="text-white font-medium">Justin D. Leigh, Attorney at Law</p>
              <p>Law Office of Justin D. Leigh</p>
              <p>Goldendale, Washington</p>
              <p className="mt-2">Phone: <a href="tel:5097738469" className="text-gold hover:text-gold-light transition-colors">(509) 773-8469</a></p>
              <p>Email: <a href="mailto:justindleigh@gmail.com" className="text-gold hover:text-gold-light transition-colors">justindleigh@gmail.com</a></p>
            </div>
            <p className="mt-3">We aim to respond to accessibility feedback within 5 business days and to resolve issues as promptly as possible.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">Assessment and Review</h2>
            <p>We assess the accessibility of this website on an ongoing basis. This statement was last reviewed and updated on April 13, 2026.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
