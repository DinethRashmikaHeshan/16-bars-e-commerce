'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

const STATUS_OPTIONS = [
  'pending',
  'processing',
  'sent_to_delivery',
  'on_the_way',
  'delivered',
  'cancelled',
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

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadOrder()
  }, [])

  async function loadOrder() {
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single()

      if (orderData) {
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
      }
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(newStatus: string) {
    if (!order) return

    try {
      setUpdating(true)

      // Update order status
      await supabase.from('orders').update({ status: newStatus }).eq('id', order.id)

      // Add to status history
      await supabase.from('order_status_history').insert({
        order_id: order.id,
        old_status: order.status,
        new_status: newStatus,
      })

      setOrder({ ...order, status: newStatus })

      // TODO: Send email notification to customer
      console.log(`Order ${order.order_number} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-white">Loading order...</div>
  }

  if (!order) {
    return <div className="text-white">Order not found</div>
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-6 text-amber-600 hover:text-amber-500 transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-amber-600 rounded p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Order #{order.order_number}</h2>

            <div className="space-y-3 text-amber-200">
              <p>
                <span className="font-semibold">Date:</span> {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Payment Method:</span>{' '}
                {order.payment_method.replace('_', ' ').toUpperCase()}
              </p>
              <p>
                <span className="font-semibold">Delivery Address:</span> {order.delivery_address}
              </p>
              <p>
                <span className="font-semibold">Phone Number:</span> {order.phone_number}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-900 border border-amber-600 rounded p-6">
            <h3 className="text-xl font-bold text-white mb-4">Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4">
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

        {/* Status Update */}
        <div className="bg-gray-900 border border-amber-600 rounded p-6 h-fit">
          <h3 className="text-xl font-bold text-white mb-4">Update Status</h3>

          <div className="space-y-3">
            <div className="mb-4">
              <p className="text-amber-600 text-sm font-semibold mb-2">Current Status:</p>
              <p className="text-white font-bold capitalize">{order.status.replace('_', ' ')}</p>
            </div>

            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-3 bg-black border border-amber-600 text-white rounded cursor-pointer disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 p-4 bg-black rounded text-amber-200 text-sm">
            <p className="font-semibold mb-2">Total Amount:</p>
            <p className="text-xl font-bold text-white">
              LKR {parseFloat(order.total_amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
