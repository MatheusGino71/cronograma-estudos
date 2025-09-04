'use client'

import { useEffect } from 'react'

export function ClearLocalStorage() {
  useEffect(() => {
    // Limpar apenas na primeira execução após a atualização
    const hasCleared = localStorage.getItem('stores-cleared-v2')
    
    if (!hasCleared) {
      // Limpar stores antigos
      localStorage.removeItem('discipline-storage')
      localStorage.removeItem('schedule-storage')
      localStorage.removeItem('progress-storage')
      
      // Marcar como limpo
      localStorage.setItem('stores-cleared-v2', 'true')
      
      // Recarregar a página para inicializar com stores limpos
      window.location.reload()
    }
  }, [])

  return null
}
