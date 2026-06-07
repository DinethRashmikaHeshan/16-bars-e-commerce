'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading shop...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">Shop</h1>
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-amber-200 text-lg mb-4">No products available at the moment.</p>
            <p className="text-gray-500">Check the admin panel to add products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group cursor-pointer hover:opacity-80 transition"
              >
                <div className="bg-gray-900 h-64 mb-4 rounded flex items-center justify-center overflow-hidden relative border border-gray-800">
                  {product.image_url ? (
                    <Image
                      src={product.image_url.split(',')[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-600 transition">
                  {product.name}
                </h3>
                <p className="text-amber-600 font-semibold mt-2">
                  LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
