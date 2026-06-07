'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4af37]/20 text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image
              src="/logo.png"
              alt="16 Bars Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-white font-black text-lg">16 BARS</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Premium streetwear fashion. Rooted in culture, crafted for the streets.
          </p>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-[#d4af37] transition">T-Shirts</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#d4af37] transition">Hoodies</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#d4af37] transition">Pants</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-[#d4af37] transition">Accessories</Link>
            </li>
          </ul>
        </div>

        {/* Company Navigation */}
        <div>
          <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-[#d4af37] transition">About Us</Link>
            </li>
            <li>
              <Link href="/lookbook" className="hover:text-[#d4af37] transition">Lookbook</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#d4af37] transition">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="text-white font-black uppercase text-sm tracking-wider mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-[#d4af37] transition">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-[#d4af37] transition">Refund Policy</Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-[#d4af37] transition">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <p>&copy; {currentYear} 16 BARS. All rights reserved.</p>
        <p>Premium Sri Lankan Streetwear.</p>
      </div>
    </footer>
  )
}
