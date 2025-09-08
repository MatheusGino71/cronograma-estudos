/** @type {import('next').NextConfig} */
const nextConfig = {
  // Para GitHub Pages
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuração para GitHub Pages
  basePath: '/cronograma-estudos',
  assetPrefix: '/cronograma-estudos',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
