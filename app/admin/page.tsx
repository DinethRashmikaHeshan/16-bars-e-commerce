'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadStats() {
      try {
        const [{ count: productCount }, { data: orders }] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact' }),
          supabase.from('orders').select('*'),
        ])

        const revenue = orders?.reduce(
          (sum: number, order: any) => sum + parseFloat(order.total_amount),
          0
        ) || 0

        const pendingCount =
          orders?.filter((order: any) => order.status === 'pending').length || 0

        setStats({
          totalProducts: productCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue: revenue,
          pendingOrders: pendingCount,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-12">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-amber-600 rounded p-6">
          <h3 className="text-amber-600 text-sm font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
        </div>

        <div className="bg-gray-900 border border-amber-600 rounded p-6">
          <h3 className="text-amber-600 text-sm font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
        </div>

        <div className="bg-gray-900 border border-amber-600 rounded p-6">
          <h3 className="text-amber-600 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">
            LKR {stats.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-900 border border-amber-600 rounded p-6">
          <h3 className="text-amber-600 text-sm font-semibold mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  )
}
