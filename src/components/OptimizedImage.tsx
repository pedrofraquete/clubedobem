'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

/**
 * Optimized Image component with lazy loading, blur placeholder, and error handling
 * Improves LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift)
 */
const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
          className
        )}
        style={{ width, height }}
      >
        Imagem não encontrada
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        loading={priority ? 'eager' : loading}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill && `object-${objectFit}`
        )}
        style={!fill ? { objectFit } : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
})

export default OptimizedImage

// Preset configurations for common use cases
export const ImagePresets = {
  hero: {
    priority: true,
    quality: 85,
    sizes: '100vw',
    placeholder: 'blur' as const
  },
  thumbnail: {
    quality: 60,
    loading: 'lazy' as const,
    placeholder: 'blur' as const
  },
  avatar: {
    quality: 70,
    objectFit: 'cover' as const,
    placeholder: 'blur' as const
  },
  gallery: {
    quality: 80,
    loading: 'lazy' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}
