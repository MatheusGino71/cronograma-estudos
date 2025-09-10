import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// HOC para Suspense com tipo correto
export function withSuspense<T extends Record<string, unknown>>(
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

// Lazy loading helpers
export const createLazyComponent = (
  importFn: () => Promise<any>,
  fallback?: React.ReactNode
) => {
  return dynamic(importFn, {
    ssr: false,
    loading: () => fallback || <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
  })
}

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)
