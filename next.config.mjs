/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para produção
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // ESLint configuration
  eslint: {
    // Permite que o build seja executado mesmo com warnings do ESLint
    ignoreDuringBuilds: true
  },
  
  // TypeScript configuration
  typescript: {
    // Permite que o build continue mesmo com erros de tipo
    ignoreBuildErrors: false
  }
}

export default nextConfig
