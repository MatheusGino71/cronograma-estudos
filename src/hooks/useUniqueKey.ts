import { useId } from 'react'

/**
 * Hook personalizado para gerar chaves únicas em componentes React
 * Combina o ID do React com valores adicionais para garantir unicidade
 */
export function useUniqueKey() {
  const reactId = useId()
  
  return (prefix: string, ...values: (string | number)[]) => {
    const cleanValues = values.map(v => String(v).replace(/[^a-zA-Z0-9-_]/g, ''))
    return `${prefix}-${reactId}-${cleanValues.join('-')}`
  }
}

/**
 * Função para gerar chave única sem hook (para uso em contextos não-React)
 */
export function generateUniqueKey(prefix: string, ...values: (string | number)[]) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const cleanValues = values.map(v => String(v).replace(/[^a-zA-Z0-9-_]/g, ''))
  return `${prefix}-${timestamp}-${random}-${cleanValues.join('-')}`
}
