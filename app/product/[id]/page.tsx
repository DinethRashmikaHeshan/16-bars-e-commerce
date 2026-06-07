'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/hooks/useCart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

interface ProductSize {
  size: string
  stock_quantity: number
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState<string>('')
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { addToCart } = useCart()
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
        setProduct(productData)
        if (productData.image_url) {
          setActiveImage(productData.image_url.split(',')[0])
        }

        // Fetch sizes and stock
        const { data: sizesData } = await supabase
          .from('product_sizes')
          .select('size, stock_quantity')
          .eq('product_id', id)

        const availableSizes = sizesData || []
        setSizes(availableSizes)

        // Pre-select first size with stock
        const firstAvailable = availableSizes.find(s => s.stock_quantity > 0)
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size)
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

  const handleAddToCart = async () => {
    if (!product) return
    if (!selectedSize) {
      setMessage('Please select a size first')
      return
    }

    setAddingToCart(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      await addToCart(
        product.id,
        product.name,
        selectedSize,
        quantity,
        product.price,
        product.image_url
      )

      setMessage('Added to cart successfully!')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error(err)
      setMessage('Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-amber-600 border-b border-amber-600 pb-1 hover:text-white">
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-amber-600 hover:text-white mb-12 transition">
          <ChevronLeft className="w-5 h-5" />
          BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images Gallery */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 aspect-square rounded overflow-hidden relative border border-gray-800">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {product.image_url && product.image_url.split(',').length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.image_url.split(',').map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`aspect-square relative bg-gray-900 rounded overflow-hidden border transition ${
                      activeImage === url ? 'border-amber-600' : 'border-gray-800 hover:border-amber-600/50'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <span className="text-xs tracking-widest text-amber-600 uppercase font-semibold mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
              {product.name}
            </h1>
            
            <p className="text-3xl font-bold text-amber-600 mb-8">
              LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>

            <div className="w-full h-px bg-amber-600/30 mb-8" />

            <h3 className="text-xs uppercase tracking-widest text-amber-600/70 font-bold mb-3">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </p>

            {/* Sizes selection */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest text-amber-600/70 font-bold mb-4">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-3">
                {sizes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No sizes configured for this product.</p>
                ) : (
                  sizes.map((s) => {
                    const isOutOfStock = s.stock_quantity <= 0
                    const isSelected = selectedSize === s.size

                    return (
                      <button
                        key={s.size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(s.size)}
                        className={`px-5 py-3 border font-bold text-sm tracking-wider transition rounded ${
                          isOutOfStock
                            ? 'border-gray-800 text-gray-700 cursor-not-allowed'
                            : isSelected
                            ? 'border-amber-600 bg-amber-600 text-black'
                            : 'border-amber-600/30 text-amber-600 hover:border-amber-600'
                        }`}
                      >
                        {s.size} {isOutOfStock && '(Out of stock)'}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Quantity */}
            {sizes.length > 0 && selectedSize && (
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest text-amber-600/70 font-bold mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-amber-600/30 text-amber-600 flex items-center justify-center font-bold hover:border-amber-600 transition rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-white font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-amber-600/30 text-amber-600 flex items-center justify-center font-bold hover:border-amber-600 transition rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Message Alert */}
            {message && (
              <p className={`text-sm mb-6 ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || sizes.length === 0 || !selectedSize}
              className="flex items-center justify-center gap-3 w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-black text-lg transition tracking-widest uppercase rounded"
            >
              <ShoppingBag className="w-5 h-5" />
              {addingToCart ? 'ADDING TO CART...' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
