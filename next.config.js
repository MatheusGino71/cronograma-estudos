/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração condicional para GitHub Pages e desenvolvimento local
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuração para GitHub Pages (apenas em produção)
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
