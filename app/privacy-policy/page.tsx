'use client'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8 border-b border-[#d4af37]/30 pb-4 uppercase tracking-widest text-[#d4af37]">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            At 16 BARS, we are committed to protecting the privacy and security of our customers' personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit or make a purchase on our website. By using our website, you consent to the practices described in this policy.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Information We Collect</h2>
            <p>
              When you visit our website, we may collect certain information about you, including:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Personal identification information (such as your name, email address, and phone number) provided voluntarily by you during registration or checkout.</li>
              <li>Payment and billing information necessary to process your orders, including credit card details, securely handled by trusted third-party payment processors like PayHere.</li>
              <li>Browsing information, such as your IP address, browser type, and device information, collected automatically using cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Use of Information</h2>
            <p>
              We may use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>To process and fulfill your orders, including shipping and delivery.</li>
              <li>To communicate with you regarding your purchases, provide customer support, and respond to inquiries.</li>
              <li>To personalize your shopping experience and present relevant product recommendations.</li>
              <li>To detect and prevent fraud, unauthorized activities, and abuse of our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Information Sharing</h2>
            <p>
              We respect your privacy and do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Trusted service providers:</strong> We may share your information with third-party service providers who assist us in operating our website, processing payments, and delivering products.</li>
              <li><strong>Legal requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal requests or orders.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and gather information about your preferences and interactions with our website. You have the option to disable cookies through your browser settings, but this may limit certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Changes to the Privacy Policy</h2>
            <p>
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with a revised "last updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding our Privacy Policy or the handling of your personal information, please contact us using the contact details provided on our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
