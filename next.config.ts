import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cronograma-estudos/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/cronograma-estudos' : ''
}

export default nextConfig
