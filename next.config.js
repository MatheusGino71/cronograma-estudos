/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cronograma-estudos' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/cronograma-estudos' : '',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
