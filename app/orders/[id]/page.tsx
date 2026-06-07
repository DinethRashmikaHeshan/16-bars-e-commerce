'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📦' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'sent_to_delivery', label: 'Sent to Delivery', icon: '🚚' },
  { key: 'on_the_way', label: 'On the Way', icon: '📍' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
]

interface OrderItem {
  id: string
  product_id: string
  size: string
  quantity: number
  price: number
  products: { name: string }
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  payment_method: string
  delivery_address: string
  phone_number: string
  created_at: string
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    async function loadOrder() {
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (!orderData) {
          router.push('/orders')
          return
        }

        setOrder(orderData)

        const { data: itemsData } = await supabase
          .from('order_items')
          .select(`
            id,
            product_id,
            size,
            quantity,
            price,
            products(name)
          `)
          .eq('order_id', orderData.id)

        setItems(itemsData || [])
      } catch (error) {
        console.error('Error loading order:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Order not found</p>
      </div>
    )
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.key === order.status)

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-amber-600 hover:text-amber-500 transition"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">Order #{order.order_number}</h1>
        <p className="text-amber-200 mb-12">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>

        {/* Status Timeline or Cancellation Banner */}
        {order.status === 'cancelled' ? (
          <div className="bg-red-950/40 border border-red-500 rounded p-8 mb-8 text-center">
            <span className="text-5xl block mb-4">🚫</span>
            <h2 className="text-2xl font-black text-red-500 mb-2">Order Cancelled</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              This order has been cancelled. If you have already paid, a refund will be processed. Please contact customer support for further information.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-amber-600 rounded p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-8">Delivery Status</h2>

            <div className="flex items-center justify-between relative mb-12">
              {/* Progress bar background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2"></div>

              {/* Progress bar fill */}
              {currentStatusIndex >= 0 && (
                <div
                  className="absolute top-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                ></div>
              )}

              {/* Status steps */}
              <div className="flex justify-between w-full relative z-10">
                {STATUS_STEPS.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        index <= currentStatusIndex
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      } transition-colors duration-300`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-xs text-center mt-3 font-semibold ${
                        index <= currentStatusIndex ? 'text-amber-600' : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-amber-600 rounded p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Items</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-700 pb-4"
                  >
                    <div>
                      <p className="text-white font-semibold">{item.products.name}</p>
                      <p className="text-amber-600 text-sm">
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-semibold">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-amber-600 rounded p-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 text-amber-200 text-sm">
                <p>
                  <span className="font-semibold">Total:</span> LKR{' '}
                  {parseFloat(order.total_amount).toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{' '}
                  {order.payment_method === 'cash_on_delivery'
                    ? 'Cash on Delivery'
                    : 'PayHere'}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-amber-600 rounded p-6">
              <h3 className="text-lg font-bold text-white mb-4">Delivery Info</h3>
              <div className="space-y-3 text-amber-200 text-sm">
                <p>
                  <span className="font-semibold">Phone:</span> {order.phone_number}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {order.delivery_address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
