'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductGalleryProps {
  productId: string
}

export default function ProductGallery({ productId }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [showZoom, setShowZoom] = useState(false)

  // Mock images - in real app, fetch based on productId
  const images = [
    { id: 1, alt: 'Marmitas fitness principais', color: 'from-orange-200 to-orange-300' },
    { id: 2, alt: 'Detalhes dos ingredientes', color: 'from-green-200 to-green-300' },
    { id: 3, alt: 'Embalagem sustentável', color: 'from-blue-200 to-blue-300' },
    { id: 4, alt: 'Informações nutricionais', color: 'from-purple-200 to-purple-300' },
    { id: 5, alt: 'Processo de preparo', color: 'from-teal-200 to-teal-300' }
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
        <div className={`w-full h-full bg-gradient-to-br ${images[currentImage].color} flex items-center justify-center`}>
          <div className="text-6xl opacity-50">📦</div>
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Zoom Button */}
        <button
          onClick={() => setShowZoom(true)}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              currentImage === index
                ? 'border-orange-400 ring-2 ring-orange-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-br ${image.color} flex items-center justify-center`}>
              <div className="text-2xl opacity-70">📦</div>
            </div>
          </button>
        ))}
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              ✕
            </button>
            <div className={`w-full h-96 bg-gradient-to-br ${images[currentImage].color} rounded-lg flex items-center justify-center`}>
              <div className="text-8xl opacity-50">📦</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}