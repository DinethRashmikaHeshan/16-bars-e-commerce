'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const { data } = await supabase.from('products').select('*')
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await supabase.from('products').delete().eq('id', id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return <div className="text-white">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition rounded"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-amber-200 mb-6">No products yet</p>
          <Link
            href="/admin/products/new"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-black font-bold transition"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-amber-600 rounded">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-amber-600">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-900">
                  <td className="px-6 py-4 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative bg-gray-800 rounded overflow-hidden border border-gray-700 flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url.split(',')[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold">
                            NO IMG
                          </div>
                        )}
                      </div>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-amber-600">{product.category}</td>
                  <td className="px-6 py-4 text-white">LKR {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 flex gap-3 h-20 items-center">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
