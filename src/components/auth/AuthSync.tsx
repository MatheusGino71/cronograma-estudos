'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDisciplineStore } from '@/store/discipline'
import { useScheduleStore } from '@/store/schedule'
import { useProgressStore } from '@/store/progress'

/**
 * Componente para sincronizar o estado de autenticação com os stores
 * Garante que os dados sejam isolados por usuário
 */
export function AuthSync() {
  const { user } = useAuth()
  const setDisciplineUserId = useDisciplineStore((state) => state.setUserId)
  const resetDisciplineData = useDisciplineStore((state) => state.resetDataForNewUser)
  const setScheduleUserId = useScheduleStore((state) => state.setUserId)
  const resetScheduleData = useScheduleStore((state) => state.resetDataForNewUser)
  const setProgressUserId = useProgressStore((state) => state.setUserId)
  const resetProgressData = useProgressStore((state) => state.resetProgressForNewUser)

  useEffect(() => {
    if (user) {
      // Usuário logado - configurar stores com o ID do usuário
      setDisciplineUserId(user.id)
      setScheduleUserId(user.id)
      setProgressUserId(user.id)
      
      // Resetar dados se necessário (mudança de usuário)
      resetDisciplineData()
      resetScheduleData()
      resetProgressData()
    } else {
      // Usuário deslogado - limpar stores
      setDisciplineUserId(null)
      setScheduleUserId(null)
      setProgressUserId(null)
    }
  }, [
    user,
    setDisciplineUserId,
    resetDisciplineData,
    setScheduleUserId,
    resetScheduleData,
    setProgressUserId,
    resetProgressData
  ])

  // Este componente não renderiza nada
  return null
}
