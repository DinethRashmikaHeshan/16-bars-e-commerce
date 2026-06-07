'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: string
  title: string
  image: string
  description?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
}

export function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay)

  useEffect(() => {
    if (!isAutoPlay || items.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isAutoPlay, items.length, interval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  if (items.length === 0) return null

  const currentItem = items[currentIndex]

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-1000" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white">
        <div className="space-y-4 px-4 md:px-8">
          <h2 className="text-5xl md:text-7xl font-black text-balance leading-tight">
            {currentItem.title}
          </h2>
          {currentItem.description && (
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              {currentItem.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-gold/0 hover:bg-gold/20 text-gold p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-gold/0 hover:bg-gold/20 text-gold p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'bg-gold w-12 h-2'
                : 'bg-white/30 hover:bg-white/50 w-2 h-2'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Resume autoplay hint */}
      {!isAutoPlay && (
        <button
          onClick={() => setIsAutoPlay(true)}
          className="absolute top-6 right-6 text-xs text-gray-400 hover:text-gold transition-colors z-10"
        >
          Resume
        </button>
      )}
    </div>
  )
}
