'use client'

import { useCart } from '@/hooks/useCart'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity, total } = useCart()
  const { user } = useUser()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in Required</h1>
          <p className="text-amber-200 mb-8">Please sign in to view your cart</p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading cart...</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-amber-200 mb-8">Start shopping to add items to your cart</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-amber-600 rounded p-6 flex gap-6"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-gray-700">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl.split(',')[0]}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs text-center font-bold">NO IMAGE</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{item.productName}</h3>
                  <p className="text-amber-600 mb-4">Size: {item.size}</p>
                  <p className="text-white font-semibold">
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 border border-amber-600 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-amber-600 hover:text-amber-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-amber-600 hover:text-amber-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-amber-600 rounded p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping:</span>
                  <span>LKR 0.00</span>
                </div>
                <div className="border-t border-amber-600 pt-4 flex justify-between text-amber-600 font-bold text-lg">
                  <span>Total:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="block text-center px-6 py-3 border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black font-bold transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
