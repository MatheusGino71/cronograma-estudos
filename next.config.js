/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para build com rotas dinâmicas
  // output: 'export' removido para permitir rotas dinâmicas e Firebase
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
