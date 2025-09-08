/** @type {import('next').NextConfig} */
const nextConfig = {
  // Só usa export para production no GitHub Pages
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Só usa basePath para production no GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/cronograma-estudos' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cronograma-estudos' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
