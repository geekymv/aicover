"use client";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 text-center mb-8"><strong>Last updated:</strong> 2025-03-04</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-4">By accessing and using funny-coloring-pages.online, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our service.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">2. Service Description</h2>
        <p className="text-gray-600 mb-4">Our AI-powered coloring page generation service offers:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Custom coloring page generation from text descriptions</li>
          <li>High-quality, family-friendly artwork suitable for all ages</li>
          <li>Instant downloads in printable formats</li>
          <li>Access to a growing public library of generated content</li>
          <li>Community sharing and interaction features</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">3. Usage Rights and Restrictions</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>All generated content automatically becomes part of our <strong className="text-gray-700">public library</strong></li>
          <li>Generated content may be used for personal, non-commercial purposes</li>
          <li>Daily generation limits may apply to prevent service abuse</li>
          <li>Generated content <strong className="text-gray-700">cannot be deleted</strong> from the public library</li>
          <li>Sharing and redistribution must include attribution to our platform</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">4. Content Guidelines</h2>
        <p className="text-gray-600 mb-4">Prohibited content and behaviors include:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Adult, explicit, or inappropriate content</li>
          <li>Violent or disturbing imagery</li>
          <li>Hate speech or discriminatory content</li>
          <li>Copyright or trademark infringement</li>
          <li>Attempts to generate content that violates our AI safety filters</li>
          <li>Automated or bulk generation attempts without authorization</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">5. Service Limitations</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Service availability is provided on an "as-is" basis</li>
          <li>AI generation quality may vary based on input prompts</li>
          <li>Scheduled maintenance windows may affect service access</li>
          <li>Generation requests may be queued during high-traffic periods</li>
          <li>We reserve the right to modify features or impose additional limits</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">6. Intellectual Property</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>AI-generated content is available through our public library</li>
          <li>Users grant us a perpetual license to store and display generated content</li>
          <li>Our service name, logo, and branding are protected intellectual property</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">7. Termination</h2>
        <p className="text-gray-600 mb-4">We reserve the right to terminate or suspend access to our services for violations of these terms or any other reason at our sole discretion.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">8. Changes to Terms</h2>
        <p className="text-gray-600 mb-4">We may update these terms periodically. Continued use of the service after changes constitutes acceptance of updated terms. Major changes will be announced via service notifications.</p>

        {/* Add Refund Policy */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">9. Refund Policy</h2>
        <p className="text-gray-600 mb-4">Our refund policy is designed to be fair and transparent:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
          <li>Refund requests must be submitted within 7 days of purchase</li>
          <li>Full refunds will be provided if our service experiences significant technical issues preventing usage</li>
          <li>No refunds will be issued for content that has already been generated or downloaded</li>
          <li>Refund requests will be processed within 3-5 business days</li>
          <li>Refunds will be issued to the original payment method</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">10. Contact</h2>
        <p className="text-gray-600 mb-4">For questions about these terms or to report violations, please contact us at:
          <a href="mailto:geekymv2024@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
            geekymv2024@gmail.com
          </a>
        </p>

        <p className="text-gray-700 font-medium text-center mt-10">Thank you for choosing funny-coloring-pages.online!</p>
      </div>
    </div>
  );
}