'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './navigation'

export function ConditionalNav() {
  const pathname = usePathname()
  
  // Não renderiza a navegação na página de login admin ou no painel admin
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <Navigation />
}
