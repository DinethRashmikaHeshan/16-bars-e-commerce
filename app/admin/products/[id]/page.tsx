'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'tshirt',
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [sizes, setSizes] = useState<{ [key: string]: number }>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProductData() {
      try {
        // Fetch product info
        const { data: productData, error: productErr } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (productErr) throw productErr

        setFormData({
          name: productData.name,
          description: productData.description,
          price: String(productData.price),
          category: productData.category,
        })

        if (productData.image_url) {
          setImageUrls(productData.image_url.split(','))
        }

        // Fetch sizes
        const { data: sizesData } = await supabase
          .from('product_sizes')
          .select('size, stock_quantity')
          .eq('product_id', id)

        if (sizesData) {
          const loadedSizes = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
          sizesData.forEach((s: any) => {
            if (s.size in loadedSizes) {
              loadedSizes[s.size as keyof typeof loadedSizes] = s.stock_quantity
            }
          })
          setSizes(loadedSizes)
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err instanceof Error ? err.message : 'Product not found')
      } finally {
        setLoading(false)
      }
    }

    loadProductData()
  }, [id])

  const handleImageUpload = async (files: FileList) => {
    try {
      setSaving(true)
      const uploaded: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${Date.now()}-${file.name}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        uploaded.push(data.publicUrl)
      }

      setImageUrls((prev) => [...prev, ...uploaded])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Update product details
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: imageUrls.join(','),
        })
        .eq('id', id)

      if (productError) throw productError

      // Update sizes: delete old, insert new
      await supabase.from('product_sizes').delete().eq('product_id', id)

      const sizeInserts = SIZES.filter((size) => sizes[size] > 0).map((size) => ({
        product_id: id,
        size,
        stock_quantity: sizes[size],
      }))

      if (sizeInserts.length > 0) {
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(sizeInserts)

        if (sizesError) throw sizesError
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading product data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Error loading product</h1>
        <p className="text-amber-200 mb-8">{error}</p>
        <Link href="/admin/products" className="text-amber-600 border-b border-amber-600 pb-1 hover:text-white">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-amber-600 hover:text-white mb-8 transition">
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </Link>

      <h1 className="text-4xl font-bold text-white mb-12">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Name */}
        <div>
          <label className="block text-white font-semibold mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded h-32"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-white font-semibold mb-2">Price (LKR)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-white font-semibold mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900 border border-amber-600 text-white rounded"
          >
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="pants">Pants</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-white font-semibold mb-2">Product Images</label>
          <div className="border-2 border-dashed border-amber-600 rounded p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageUpload(e.target.files)
                }
              }}
              className="hidden"
              id="image-input"
            />
            <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-amber-600" />
              <span className="text-amber-600">Click to upload more images</span>
            </label>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group bg-gray-900 border border-amber-600/30 rounded aspect-square overflow-hidden">
                  <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sizes & Stock */}
        <div>
          <label className="block text-white font-semibold mb-4">Stock by Size</label>
          <div className="grid grid-cols-5 gap-4">
            {SIZES.map((size) => (
              <div key={size}>
                <label className="block text-amber-600 text-sm mb-2">{size}</label>
                <input
                  type="number"
                  min="0"
                  value={sizes[size]}
                  onChange={(e) =>
                    setSizes({ ...sizes, [size]: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-600 text-white rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-black font-bold transition rounded"
        >
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}
