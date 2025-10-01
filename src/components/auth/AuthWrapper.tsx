'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { usePathname } from 'next/navigation'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname()
  
  // Rotas que não precisam de autenticação
  const publicRoutes = [
    '/',  // Landing page
    '/api', // APIs são públicas por natureza, mas podem ter sua própria proteção
  ]
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })

  // Se for rota pública, mostra o conteúdo sem proteção
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Se for rota privada, aplica proteção
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
