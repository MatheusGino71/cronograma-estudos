import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent'
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600', 
  accent: 'text-red-600'
}

export const LoadingSpinner = memo(({ 
  size = 'md', 
  variant = 'primary',
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[variant]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

// Skeletons otimizados
export const SkeletonCard = memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-32 mb-4"></div>
    <div className="bg-gray-200 rounded h-4 mb-2 w-3/4"></div>
    <div className="bg-gray-200 rounded h-4 w-1/2"></div>
  </div>
))

export const SkeletonTable = memo(({ rows = 5 }: { rows?: number }) => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded h-8 mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4 mb-2">
        <div className="bg-gray-200 rounded h-6 flex-1"></div>
        <div className="bg-gray-200 rounded h-6 w-24"></div>
        <div className="bg-gray-200 rounded h-6 w-16"></div>
      </div>
    ))}
  </div>
))

export const SkeletonText = memo(({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`bg-gray-200 rounded h-4 mb-2 ${
          i === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      />
    ))}
  </div>
))

SkeletonCard.displayName = 'SkeletonCard'
SkeletonTable.displayName = 'SkeletonTable'
SkeletonText.displayName = 'SkeletonText'
