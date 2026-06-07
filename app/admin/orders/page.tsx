'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600'
      case 'processing':
        return 'bg-blue-600'
      case 'sent_to_delivery':
        return 'bg-purple-600'
      case 'on_the_way':
        return 'bg-indigo-600'
      case 'delivered':
        return 'bg-green-600'
      case 'cancelled':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  if (loading) {
    return <div className="text-white">Loading orders...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-12">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-amber-200">No orders yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-amber-600 rounded">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-amber-600">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Order #</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-900">
                  <td className="px-6 py-4 text-white font-semibold">{order.order_number}</td>
                  <td className="px-6 py-4 text-white">LKR {parseFloat(order.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} text-white text-sm px-3 py-1 rounded inline-block capitalize`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
