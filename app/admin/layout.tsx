'use client'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-amber-200">You don&apos;t have permission to access this page</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-amber-600 bg-gray-900 min-h-screen p-6">
          <h2 className="text-xl font-bold text-white mb-8">Admin Panel</h2>
          <nav className="space-y-4">
            <Link
              href="/admin"
              className="block px-4 py-2 text-amber-600 hover:bg-amber-600 hover:text-black rounded transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 text-amber-600 hover:bg-amber-600 hover:text-black rounded transition"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 text-amber-600 hover:bg-amber-600 hover:text-black rounded transition"
            >
              Orders
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white rounded transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
