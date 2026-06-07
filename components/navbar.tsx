'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'

export function Navbar() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-[#0a0a0a] border-b border-[#d4af37] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image
              src="/logo.png"
              alt="16 Bars"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-white font-black text-lg hidden md:inline">16 BARS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12 flex-1 ml-12">
            <Link href="/shop" className="text-gray-300 hover:text-[#d4af37] transition font-medium text-sm uppercase tracking-wider">
              Shop
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-[#d4af37] transition font-medium text-sm uppercase tracking-wider">
              About
            </Link>
            <Link href="/lookbook" className="text-gray-300 hover:text-[#d4af37] transition font-medium text-sm uppercase tracking-wider">
              Lookbook
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-[#d4af37] transition font-medium text-sm uppercase tracking-wider">
              Contact
            </Link>
            {user && (
              <Link href="/orders" className="text-gray-300 hover:text-[#d4af37] transition font-medium text-sm uppercase tracking-wider">
                My Orders
              </Link>
            )}
          </div>


          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-gray-300 hover:text-[#d4af37] transition"
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {/* Auth Links */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        className="hidden md:block px-4 py-2 bg-[#d4af37] text-black hover:bg-white transition text-xs font-black uppercase"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="hidden md:block px-4 py-2 text-gray-300 hover:text-[#d4af37] transition text-xs font-medium"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="hidden md:block px-4 py-2 text-gray-300 hover:text-[#d4af37] transition text-xs font-medium"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#d4af37] hover:text-white transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-[#333333] pt-4">
            <Link
              href="/shop"
              className="block text-gray-300 hover:text-[#d4af37] transition py-2 font-medium text-sm uppercase"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-[#d4af37] transition py-2 font-medium text-sm uppercase"
            >
              About
            </Link>
            <Link
              href="/lookbook"
              className="block text-gray-300 hover:text-[#d4af37] transition py-2 font-medium text-sm uppercase"
            >
              Lookbook
            </Link>
            <Link
              href="/contact"
              className="block text-gray-300 hover:text-[#d4af37] transition py-2 font-medium text-sm uppercase"
            >
              Contact
            </Link>
            {user && (
              <>
                <Link
                  href="/orders"
                  className="block text-gray-300 hover:text-[#d4af37] transition py-2 font-medium text-sm uppercase"
                >
                  My Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 bg-[#d4af37] text-black hover:bg-white transition text-sm font-black uppercase"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-[#d4af37] transition text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-gray-300 hover:text-[#d4af37] transition text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
