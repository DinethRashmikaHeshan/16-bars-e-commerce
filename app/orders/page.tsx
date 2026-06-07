'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
}

export default function OrdersPage() {
  const { user, loading: userLoading } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    async function loadOrders() {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setOrders(data || [])
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in Required</h1>
          <p className="text-amber-200 mb-8">Please sign in to view your orders</p>
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

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-200 mb-6">No orders yet</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 border border-amber-600 rounded p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{order.order_number}</h3>
                  <p className="text-amber-600 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-white">LKR {parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`${getStatusColor(
                      order.status
                    )} text-white text-sm px-4 py-2 rounded capitalize`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
