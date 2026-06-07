'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order_number')

  return (
    <div className="text-center max-w-md">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed</h1>
        {orderNumber && (
          <p className="text-amber-600 text-lg font-semibold mb-4">{orderNumber}</p>
        )}
        <p className="text-amber-200 mb-8">
          Thank you for your order! We&apos;ll send you updates about your delivery via email.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/orders"
          className="inline-block w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition rounded"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="inline-block w-full px-6 py-3 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-bold transition rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
