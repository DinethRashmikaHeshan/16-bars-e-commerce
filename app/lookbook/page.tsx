import Image from 'next/image'

export default function LookbookPage() {
  const lookbookImages = [
    { id: 1, src: '/lookbook/street-style.jpg', title: 'Street Culture', span: 'col-span-1' },
    { id: 2, src: '/lookbook/community.jpg', title: 'Community', span: 'col-span-2' },
    { id: 3, src: '/lifestyle/cityscape.jpg', title: 'Urban Dreams', span: 'col-span-1' }
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="h-96 flex items-center justify-center px-4 border-b border-[#333333]">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-black">LOOKBOOK</h1>
          <p className="text-[#d4af37] font-bold text-lg">The 16 Bars Story in Images</p>
          <div className="w-24 h-1 bg-[#d4af37] mx-auto"></div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            {/* Street Style - Single */}
            <div className="relative overflow-hidden group cursor-pointer col-span-1 row-span-2">
              <Image
                src="/lookbook/street-style.jpg"
                alt="Street Culture"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-black text-[#d4af37]">Street Culture</h3>
              </div>
            </div>

            {/* Community - Wide */}
            <div className="relative overflow-hidden group cursor-pointer col-span-2">
              <Image
                src="/lookbook/community.jpg"
                alt="Community"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-black text-[#d4af37]">Community</h3>
              </div>
            </div>

            {/* Cityscape */}
            <div className="relative overflow-hidden group cursor-pointer col-span-2">
              <Image
                src="/lifestyle/cityscape.jpg"
                alt="Urban Dreams"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-2xl font-black text-[#d4af37]">Urban Dreams</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#141414] border-t border-[#333333]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-black">Inspired? Represent the Culture</h2>
          <p className="text-gray-400 text-lg">Own a piece of the 16 Bars movement</p>
          <a href="/shop" className="inline-block px-10 py-4 bg-[#d4af37] text-black font-black hover:bg-white transition">
            SHOP NOW
          </a>
        </div>
      </section>
    </main>
  )
}
