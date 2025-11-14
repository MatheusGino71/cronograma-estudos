'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  Users, 
  FileQuestion, 
  TrendingUp, 
  Activity,
  Shield,
  BarChart3,
  Settings,
  Database
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalQuestions: number
  totalAnswered: number
  averageSuccess: number
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswered: 0,
    averageSuccess: 0
  })

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Carregar usuários do Firebase
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const totalUsers = usersSnapshot.size

        // Carregar questões do Firebase
        const questoesSnapshot = await getDocs(collection(db, 'questoes'))
        const totalQuestions = questoesSnapshot.size
        
        // Pegar dados reais do localStorage para demonstração
        const historico = localStorage.getItem('historico-questoes')
        const questoesRespondidas = historico ? JSON.parse(historico).length : 0
        
        const estatisticas = localStorage.getItem('estatisticas-questoes')
        let taxaAcerto = 0
        if (estatisticas) {
          const stats = JSON.parse(estatisticas)
          taxaAcerto = stats.totalRespondidas > 0 
            ? Math.round((stats.totalCorretas / stats.totalRespondidas) * 100)
            : 0
        }

        setStats({
          totalUsers,
          totalQuestions,
          totalAnswered: questoesRespondidas,
          averageSuccess: taxaAcerto
        })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        // Fallback para dados do localStorage
        const historico = localStorage.getItem('historico-questoes')
        const questoesRespondidas = historico ? JSON.parse(historico).length : 0
        
        const estatisticas = localStorage.getItem('estatisticas-questoes')
        let taxaAcerto = 0
        if (estatisticas) {
          const stats = JSON.parse(estatisticas)
          taxaAcerto = stats.totalRespondidas > 0 
            ? Math.round((stats.totalCorretas / stats.totalRespondidas) * 100)
            : 0
        }

        setStats({
          totalUsers: 0,
          totalQuestions: 0,
          totalAnswered: questoesRespondidas,
          averageSuccess: taxaAcerto
        })
      }
    }

    loadStats()
  }, [])

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3347]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-[#FF3347]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie usuários, questões e acompanhe estatísticas globais
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-[#3D5AFE]" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">TOTAL</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuários</p>
            </div>
          </div>

          {/* Total Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">BANCO</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalQuestions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questões</p>
            </div>
          </div>

          {/* Total Answered */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">ATIVIDADE</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalAnswered}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Respondidas</p>
            </div>
          </div>

          {/* Average Success */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-[#FF3347]" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">MÉDIA</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.averageSuccess}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Acerto</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Users */}
          <button
            onClick={() => router.push('/admin/usuarios')}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-[#3D5AFE] to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Gerenciar Usuários
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visualizar, editar e gerenciar todos os usuários
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-2xl font-bold text-[#3D5AFE]">
                {stats.totalUsers}
              </span>
              <span className="text-sm text-gray-500">usuários ativos</span>
            </div>
          </button>

          {/* View Questions */}
          <button
            onClick={() => router.push('/admin/historico')}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-[#FF3347] to-red-600 rounded-xl group-hover:scale-110 transition-transform">
                <FileQuestion className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Histórico de Questões
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ver todas as questões respondidas por usuários
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-2xl font-bold text-[#FF3347]">
                {stats.totalAnswered}
              </span>
              <span className="text-sm text-gray-500">respostas</span>
            </div>
          </button>

          {/* Statistics */}
          <button
            onClick={() => alert('Em desenvolvimento')}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Estatísticas Avançadas
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Relatórios e análises detalhadas
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-2xl font-bold text-purple-600">
                {stats.averageSuccess}%
              </span>
              <span className="text-sm text-gray-500">taxa média</span>
            </div>
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-gradient-to-r from-[#FF3347] to-[#3D5AFE] rounded-xl p-6 text-white">
          <div className="flex items-center gap-4">
            <Settings className="h-12 w-12" />
            <div>
              <h3 className="text-xl font-bold mb-1">Bem-vindo ao Painel Admin</h3>
              <p className="text-white/80">
                Você está logado como <strong>{user.email}</strong> com permissões de administrador
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
