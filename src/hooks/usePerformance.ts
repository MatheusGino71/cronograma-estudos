import { useMemo, useCallback, useRef, useState, useEffect } from 'react'

// Hook para debounce
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay]) as T
}

// Hook para throttle
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRun = useRef(Date.now())
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args)
        lastRun.current = Date.now()
      }, delay - (Date.now() - lastRun.current))
    }
  }, [callback, delay]) as T
}

// Hook para memoização pesada
export function useHeavyComputation<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps)
}

// Hook para lazy state
export function useLazyState<T>(
  initialValue: T | (() => T)
) {
  const [state, setState] = useState<T | undefined>(undefined)
  
  const getValue = useCallback(() => {
    if (state === undefined) {
      const value = typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue
      setState(value)
      return value
    }
    return state
  }, [state, initialValue])

  return [getValue, setState] as const
}

// Hook para intersection observer (lazy loading)
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    if (!ref.current) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [ref, options])
  
  return isIntersecting
}
