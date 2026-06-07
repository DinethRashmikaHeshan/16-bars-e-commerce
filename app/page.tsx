import Link from 'next/link'
import Image from 'next/image'
import { Carousel } from '@/components/carousel'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  let products = []
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    products = data || []
  } catch (err) {
    console.error('Error fetching featured products:', err)
  }

  const featuredProducts = products.length > 0 ? products : [
    { id: 'mock1', name: 'ALL EQEZ Tee', description: "Street's Disciple Collection", price: 2499, image_url: '/products/tshirt-1-front.png' },
    { id: 'mock2', name: '16 BARS Classic', description: 'Gold Logo Edition', price: 1999, image_url: '/lookbook/street-style.jpg' },
    { id: 'mock3', name: 'Limited Drop', description: 'Exclusive Design', price: 2999, image_url: '/lookbook/street-style.jpg' }
  ]

  const carouselItems = [
    {
      id: '1',
      title: 'THE CULTURE',
      description: 'Urban. Raw. Authentic.',
      image: '/lifestyle/cityscape.jpg'
    },
    {
      id: '2',
      title: 'REPRESENT',
      description: 'Wear Your Story',
      image: '/lookbook/community.jpg'
    },
    {
      id: '3',
      title: 'STREET STYLE',
      description: 'Express Yourself',
      image: '/lookbook/street-style.jpg'
    }
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Featured Carousel */}
      <section className="relative">
        <Carousel items={carouselItems} autoPlay={true} interval={5000} />
      </section>

      {/* Featured Products Section */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-white">FEATURED</h2>
            <div className="w-24 h-1 bg-[#d4af37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const isMock = String(product.id).startsWith('mock')
              const href = isMock ? '/shop' : `/product/${product.id}`

              return (
                <Link key={product.id} href={href} className="group cursor-pointer block">
                  <div className="relative overflow-hidden mb-6 h-96 border border-gray-800 bg-gray-900 rounded-none">
                    {product.image_url ? (
                      <Image
                        src={product.image_url.split(',')[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-[#d4af37] transition duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2 mb-4 line-clamp-2">{product.description}</p>
                  <p className="text-[#d4af37] font-bold text-lg">
                    LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-[#d4af37] text-black font-black text-lg hover:bg-white transition duration-300"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 px-4 bg-[#141414] border-t border-b border-[#333333]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <Image
              src="/logo.png"
              alt="16 Bars"
              width={160}
              height={160}
              className="h-40 w-auto mx-auto"
            />
            <h2 className="text-4xl md:text-5xl font-black text-white">
              THE <span className="text-[#d4af37]">CULTURE</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              16 Bars isn&apos;t just a brand—it&apos;s a movement. We celebrate urban culture, authenticity, and the raw energy of street aesthetics. Every piece is crafted for those who speak the language of the streets.
            </p>
            <Link
              href="/about"
              className="inline-block text-[#d4af37] font-bold border-b-2 border-[#d4af37] hover:text-white pb-2 transition duration-300"
            >
              Learn More About Our Story →
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto">
          <div className="border border-[#333333] p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">STAY UPDATED</h2>
            <p className="text-gray-400 mb-8">Get exclusive access to new drops and insider culture</p>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-[#141414] text-white placeholder-gray-600 border border-[#333333] focus:border-[#d4af37] focus:outline-none transition"
              />
              <button className="px-8 py-4 bg-[#d4af37] text-black font-black hover:bg-white transition duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 bg-[#0a0a0a] border-t border-[#333333]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-black text-white mb-6">READY TO REPRESENT?</h3>
          <Link
            href="/shop"
            className="inline-block px-12 py-4 border-2 border-[#d4af37] text-[#d4af37] font-black text-lg hover:bg-[#d4af37] hover:text-black transition duration-300"
          >
            SHOP NOW
          </Link>
        </div>
      </section>
    </main>
  )
}
