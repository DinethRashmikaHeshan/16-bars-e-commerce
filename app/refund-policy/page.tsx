'use client'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8 border-b border-[#d4af37]/30 pb-4 uppercase tracking-widest text-[#d4af37]">
          Refund Policy
        </h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            Thank you for shopping at 16 BARS. We value your satisfaction and strive to provide you with the best online streetwear shopping experience possible. If, for any reason, you are not completely satisfied with your purchase, we are here to help.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Returns</h2>
            <p>
              We accept returns within 7 days from the date of purchase. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Refunds</h2>
            <p>
              Once we receive your return and inspect the item, we will notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment (such as PayHere or bank transfer). Please note that the refund amount will exclude any shipping charges incurred during the initial purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Exchanges</h2>
            <p>
              If you would like to exchange your item for a different size, please contact our customer support team within 7 days of receiving your order. We will provide you with further instructions on how to proceed with the exchange.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Non-Returnable Items</h2>
            <p>
              Certain items are non-returnable and non-refundable. These include:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Gift cards</li>
              <li>Sale or promotional items</li>
              <li>Customized or personalized garments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Damaged or Defective Items</h2>
            <p>
              In the unfortunate event that your item arrives damaged or defective, please contact us immediately. We will arrange for a replacement or issue a refund, depending on your preference and product availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Return Shipping</h2>
            <p>
              You will be responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g., wrong item shipped, defective product). In such cases, we will arrange for a return pickup or refund the shipping costs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Processing Time</h2>
            <p>
              Refunds and exchanges will be processed within 5 business days after we receive your returned item. Please note that it may take additional time for the refund to appear in your account, depending on your payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our refund policy, please contact our customer support team. We are here to assist you and ensure your shopping experience with us is enjoyable and hassle-free.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
