'use client'

import { useCart } from '@/hooks/useCart'
import { useUser } from '@/hooks/useUser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in Required</h1>
          <p className="text-amber-200 mb-8">Please sign in to proceed with checkout</p>
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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Cart is Empty</h1>
          <p className="text-amber-200 mb-8">Add items to your cart to proceed</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            status: 'pending',
            payment_method: formData.paymentMethod,
            payment_status: formData.paymentMethod === 'payhere' ? 'pending' : 'pending',
            total_amount: total,
            delivery_address: formData.address,
            phone_number: formData.phone,
          },
        ])
        .select('id')
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      // Handle payment
      if (formData.paymentMethod === 'payhere') {
        const hashResponse = await fetch('/api/payment/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id, amount: total }),
        })
        const hashData = await hashResponse.json()
        if (hashData.error) throw new Error(hashData.error)

        const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || 'your_payhere_merchant_id_here'

        const paymentParams: Record<string, string> = {
          merchant_id: merchantId,
          return_url: `${window.location.origin}/payment/success?order_id=${order.id}`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          notify_url: `${window.location.origin}/api/payment/webhook`,
          order_id: order.id,
          items: `16 Bars Order #${orderNumber}`,
          currency: 'LKR',
          amount: hashData.amountFormatted,
          hash: hashData.hash,
          first_name: user.email?.split('@')[0] || 'Customer',
          last_name: 'Customer',
          email: user.email || '',
          phone: formData.phone,
          address: formData.address,
          city: 'Colombo',
          country: 'Sri Lanka',
        }

        const isSandbox = merchantId === 'your_payhere_merchant_id_here' || merchantId.startsWith('12')
        const payhereCheckoutUrl = isSandbox 
          ? 'https://sandbox.payhere.lk/pay/checkout' 
          : 'https://www.payhere.lk/pay/checkout'

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = payhereCheckoutUrl

        Object.entries(paymentParams).forEach(([key, val]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = val
          form.appendChild(input)
        })

        document.body.appendChild(form)
        clearCart()
        form.submit()
      } else {
        // Cash on delivery - clear cart and redirect to success
        clearCart()
        router.push(`/order-success?order_id=${order.id}&order_number=${orderNumber}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating order')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className="bg-gray-900 border border-amber-600 rounded p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <div>
                    <p className="text-white font-semibold">{item.productName}</p>
                    <p className="text-amber-600 text-sm">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-white">LKR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <div className="pt-4 border-t border-amber-600">
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white mb-4">
                  <span>Shipping:</span>
                  <span>LKR 0.00</span>
                </div>
                <div className="flex justify-between text-amber-600 font-bold text-lg">
                  <span>Total:</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Delivery & Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Delivery Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Payment Method</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-amber-600 rounded cursor-pointer hover:bg-gray-900">
                    <input
                      type="radio"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-white">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center p-4 border border-amber-600 rounded cursor-pointer hover:bg-gray-900">
                    <input
                      type="radio"
                      value="payhere"
                      checked={formData.paymentMethod === 'payhere'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-white">PayHere Online Payment</span>
                  </label>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-black font-bold transition rounded"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
