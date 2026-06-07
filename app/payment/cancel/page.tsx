'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md w-full bg-gray-900 border border-red-500 rounded p-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Payment Cancelled</h1>
        <p className="text-gray-300 mb-8">
          The payment process was cancelled or failed. No charges were made to your account.
        </p>

        <div className="space-y-4">
          <Link
            href="/checkout"
            className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition rounded text-center"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="block w-full py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold transition rounded text-center"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
