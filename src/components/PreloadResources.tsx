'use client'

import { memo } from 'react'
import Head from 'next/head'

interface PreloadResourcesProps {
  fonts?: string[]
  images?: string[]
  scripts?: string[]
  stylesheets?: string[]
}

/**
 * Component to preload critical resources for better Core Web Vitals
 * Helps improve LCP (Largest Contentful Paint) by preloading key assets
 */
const PreloadResources = memo(function PreloadResources({
  fonts = [],
  images = [],
  scripts = [],
  stylesheets = []
}: PreloadResourcesProps) {
  return (
    <Head>
      {/* Preload critical fonts */}
      {fonts.map((font, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}

      {/* Preload critical images */}
      {images.map((image, index) => (
        <link
          key={`image-${index}`}
          rel="preload"
          href={image}
          as="image"
        />
      ))}

      {/* Preload critical scripts */}
      {scripts.map((script, index) => (
        <link
          key={`script-${index}`}
          rel="preload"
          href={script}
          as="script"
        />
      ))}

      {/* Preload critical stylesheets */}
      {stylesheets.map((stylesheet, index) => (
        <link
          key={`stylesheet-${index}`}
          rel="preload"
          href={stylesheet}
          as="style"
        />
      ))}

      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//supabase.co" />
      
      {/* Preconnect to critical origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Resource hints for better performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="format-detection" content="telephone=no" />
    </Head>
  )
})

export default PreloadResources

// Default preload configurations for different pages
export const defaultPreloads = {
  home: {
    images: [
      '/hero-image.jpg',
      '/logo.png'
    ],
    fonts: [
      '/fonts/inter-var.woff2'
    ]
  },
  marketplace: {
    images: [
      '/marketplace-hero.jpg',
      '/category-icons.png'
    ]
  },
  admin: {
    scripts: [
      '/js/chart.min.js',
      '/js/admin-dashboard.js'
    ]
  }
}
