/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  // Configuração condicional para GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    distDir: 'out',
    basePath: '/cronograma-estudos',
    assetPrefix: '/cronograma-estudos',
  }),
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Otimizações de imagem
  images: {
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configurações de bundle
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      'react-markdown',
      'jspdf'
    ],
  },
  
  // Configurações de build
  trailingSlash: true,
  generateEtags: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Headers para cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
