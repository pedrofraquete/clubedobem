/**
 * Bundle analyzer configuration for monitoring bundle sizes
 * Run with: npm run build && npm run analyze
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer

// Add this script to package.json:
// "analyze": "ANALYZE=true npm run build"

// Bundle size optimization tips:
// 1. Use dynamic imports for heavy components
// 2. Implement code splitting by routes
// 3. Use React.memo for expensive components
// 4. Optimize images with next/image
// 5. Remove unused dependencies
// 6. Use tree shaking for libraries
