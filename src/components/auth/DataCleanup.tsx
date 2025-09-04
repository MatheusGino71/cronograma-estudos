'use client'

import { useEffect } from 'react'

/**
 * Componente para limpeza única dos dados não autenticados
 * Remove dados do localStorage que não estão associados a usuários
 */
export function DataCleanup() {
  useEffect(() => {
    // Executar limpeza apenas uma vez
    const hasCleanedUp = localStorage.getItem('mindtech-data-cleanup-v1')
    
    if (!hasCleanedUp) {
      try {
        // Limpar dados de disciplinas não autenticadas
        const disciplineData = localStorage.getItem('discipline-storage')
        if (disciplineData) {
          const parsed = JSON.parse(disciplineData)
          if (parsed.state && !parsed.state.userId) {
            // Limpar dados se não há userId
            localStorage.removeItem('discipline-storage')
            console.log('🧹 Dados de disciplinas não autenticados removidos')
          }
        }

        // Limpar dados de cronograma não autenticados
        const scheduleData = localStorage.getItem('schedule-storage')
        if (scheduleData) {
          const parsed = JSON.parse(scheduleData)
          if (parsed.state && !parsed.state.userId) {
            // Limpar dados se não há userId
            localStorage.removeItem('schedule-storage')
            console.log('🧹 Dados de cronograma não autenticados removidos')
          }
        }

        // Limpar dados de progresso não autenticados
        const progressData = localStorage.getItem('progress-storage')
        if (progressData) {
          const parsed = JSON.parse(progressData)
          if (parsed.state && !parsed.state.userId) {
            // Limpar dados se não há userId
            localStorage.removeItem('progress-storage')
            console.log('🧹 Dados de progresso não autenticados removidos')
          }
        }

        // Marcar como limpo
        localStorage.setItem('mindtech-data-cleanup-v1', 'true')
        console.log('✅ Limpeza de dados concluída')
        
      } catch (error) {
        console.error('❌ Erro durante limpeza:', error)
      }
    }
  }, [])

  return null
}
