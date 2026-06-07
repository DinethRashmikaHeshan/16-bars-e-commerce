'use client'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8 border-b border-[#d4af37]/30 pb-4 uppercase tracking-widest text-[#d4af37]">
          Terms & Conditions
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Welcome to 16 BARS. These Terms and Conditions govern your use of our website and the purchase and sale of products from our platform. By accessing and using our website, you agree to comply with these terms. Please read them carefully before proceeding with any transactions.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Use of the Website</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>You must be at least 16 years old to use our website or make purchases.</li>
              <li>You are responsible for maintaining the confidentiality of your account information, including your username and password.</li>
              <li>You agree to provide accurate and current information during the registration and checkout process.</li>
              <li>You may not use our website for any unlawful or unauthorized purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Product Information and Pricing</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee that all descriptions are completely accurate or error-free.</li>
              <li>Prices are subject to change without notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Orders and Payments</h2>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>By placing an order on our website, you are making an offer to purchase the selected products.</li>
              <li>We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraudulent activity.</li>
              <li>You agree to provide valid payment information and authorize us to charge the total order amount using your selected method (e.g. Cash on Delivery or PayHere).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">4. Shipping and Delivery</h2>
            <p>
              We will make reasonable efforts to ensure timely shipping and delivery of your orders. Shipping and delivery times provided are estimates and may vary based on your location (especially across different regions of Sri Lanka).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">5. Returns and Refunds</h2>
            <p>
              Our Refund Policy governs the process and conditions for returning products and seeking refunds. Please refer to our Refund Policy page for more details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">6. Intellectual Property</h2>
            <p>
              All content and materials on our website, including text, images, logos, and graphics, are protected by intellectual property rights and are the property of 16 BARS. You may not reproduce, distribute, or modify any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">7. Limitation of Liability</h2>
            <p>
              In no event shall 16 BARS, its directors, employees, or affiliates be liable for any direct, indirect, incidental, or consequential damages arising out of your use of our website or the purchase and use of our products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">8. Amendments</h2>
            <p>
              We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
