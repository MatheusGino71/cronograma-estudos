import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Componentes com lazy loading
export const LazyProgressChart = dynamic(
  () => import('@/components/progress/ProgressChart'),
  { 
    ssr: false,
    loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
  }
)

export const LazySimuladoInterativo = dynamic(
  () => import('@/components/simulado/SimuladoInterativo'),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
  }
)

export const LazyDisciplineTable = dynamic(
  () => import('@/components/disciplines/DisciplineTable'),
  { 
    ssr: false,
    loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
  }
)

export const LazyAIChat = dynamic(
  () => import('@/components/ai/AIChat'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
  }
)

export const LazyCalendar = dynamic(
  () => import('@/components/calendar/Calendar'),
  { 
    ssr: false,
    loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
  }
)

// HOC para Suspense
export function withSuspense<T extends {}>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function SuspendedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <div className="animate-pulse bg-gray-100 rounded-lg h-32" />}>
        <Component {...props} />
      </Suspense>
    )
  }
}
