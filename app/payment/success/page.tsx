'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="text-center max-w-md w-full bg-gray-900 border border-amber-600 rounded p-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6 animate-bounce" />
      <h1 className="text-3xl font-black text-white mb-4">Payment Successful!</h1>
      <p className="text-gray-300 mb-8">
        Your payment has been successfully processed. Thank you for shopping with 16 BARS.
      </p>

      <div className="space-y-4">
        {orderId && (
          <Link
            href={`/orders/${orderId}`}
            className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition rounded text-center"
          >
            Track Order
          </Link>
        )}
        <Link
          href="/shop"
          className="block w-full py-3 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-bold transition rounded text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <Suspense fallback={<p className="text-white">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
