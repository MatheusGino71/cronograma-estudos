'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileQuestion,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { QuestaoHistorico } from '@/types/simulado'

interface QuestaoComUsuario extends QuestaoHistorico {
  userId: string
  userName: string
}

export default function AdminHistoricoPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  const [questoes, setQuestoes] = useState<QuestaoComUsuario[]>([])
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'acertos' | 'erros'>('todas')
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuestao, setSelectedQuestao] = useState<QuestaoComUsuario | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Carregar questões do localStorage ou Firebase
    const loadQuestoes = () => {
      const historico = localStorage.getItem('historico-questoes')
      
      if (historico) {
        const questoesLocal: QuestaoHistorico[] = JSON.parse(historico)
        
        // Simular dados de diferentes usuários
        const questoesComUsuarios: QuestaoComUsuario[] = questoesLocal.map((q, index) => ({
          ...q,
          userId: index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '3',
          userName: index % 3 === 0 ? 'João Silva' : index % 3 === 1 ? 'Maria Santos' : 'Pedro Costa'
        }))

        // Filtrar por usuário se especificado
        const questoesFiltradas = userId 
          ? questoesComUsuarios.filter(q => q.userId === userId)
          : questoesComUsuarios

        setQuestoes(questoesFiltradas)
      }
    }

    loadQuestoes()
  }, [userId])

  // Aplicar filtros
  const questoesFiltradas = questoes.filter(q => {
    const matchTipo = 
      filtroTipo === 'todas' ? true :
      filtroTipo === 'acertos' ? q.acertou :
      !q.acertou

    const matchDisciplina = 
      filtroDisciplina === 'todas' || q.disciplina === filtroDisciplina

    const matchSearch = 
      q.enunciado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.userName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchTipo && matchDisciplina && matchSearch
  })

  // Estatísticas
  const stats = {
    total: questoes.length,
    acertos: questoes.filter(q => q.acertou).length,
    erros: questoes.filter(q => !q.acertou).length,
    taxaAcerto: questoes.length > 0 
      ? Math.round((questoes.filter(q => q.acertou).length / questoes.length) * 100)
      : 0
  }

  const disciplinas = ['todas', ...new Set(questoes.map(q => q.disciplina))]

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
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF3347] mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Painel
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <FileQuestion className="h-8 w-8 text-[#FF3347]" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {userId ? 'Questões do Usuário' : 'Histórico Global de Questões'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.total} questões respondidas • {stats.taxaAcerto}% de acerto
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <FileQuestion className="h-8 w-8 text-purple-600" />
              <span className="text-xs text-gray-500">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.total}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Questões</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-xs text-gray-500">ACERTOS</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {stats.acertos}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Corretas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-8 w-8 text-[#FF3347]" />
              <span className="text-xs text-gray-500">ERROS</span>
            </div>
            <p className="text-3xl font-bold text-[#FF3347] mb-1">
              {stats.erros}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Incorretas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-[#3D5AFE]" />
              <span className="text-xs text-gray-500">TAXA</span>
            </div>
            <p className="text-3xl font-bold text-[#3D5AFE] mb-1">
              {stats.taxaAcerto}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Acerto</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar questão ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF3347] focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>

            {/* Tipo Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as 'todas' | 'acertos' | 'erros')}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF3347] focus:border-transparent text-gray-900 dark:text-white appearance-none"
              >
                <option value="todas">Todas as Questões</option>
                <option value="acertos">Apenas Acertos</option>
                <option value="erros">Apenas Erros</option>
              </select>
            </div>

            {/* Disciplina Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filtroDisciplina}
                onChange={(e) => setFiltroDisciplina(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF3347] focus:border-transparent text-gray-900 dark:text-white appearance-none"
              >
                {disciplinas.map(d => (
                  <option key={d} value={d}>
                    {d === 'todas' ? 'Todas as Disciplinas' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questoesFiltradas.map((questao, index) => (
            <div
              key={`${questao.questaoId}-${index}`}
              onClick={() => {
                setSelectedQuestao(questao)
                setShowModal(true)
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      questao.acertou
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {questao.acertou ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Acertou
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Errou
                        </span>
                      )}
                    </span>
                    <span className="px-3 py-1 bg-[#3D5AFE]/10 text-[#3D5AFE] rounded-full text-xs font-semibold">
                      {questao.disciplina}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium mb-3 line-clamp-2">
                    {questao.enunciado}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {questao.userName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(questao.dataResposta).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {questao.tempoResposta}s
                    </span>
                    {questao.tentativas > 1 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        {questao.tentativas}ª tentativa
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resposta do Usuário</p>
                  <p className={`font-semibold ${
                    questao.acertou ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {questao.respostaUsuario}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resposta Correta</p>
                  <p className="font-semibold text-green-600">
                    {questao.respostaCorreta}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {questoesFiltradas.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Nenhuma questão encontrada com os filtros selecionados
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedQuestao && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => {
            setShowModal(false)
            setSelectedQuestao(null)
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full p-8 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalhes da Questão
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedQuestao(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status e Info */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  selectedQuestao.acertou
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedQuestao.acertou ? '✓ Acertou' : '✗ Errou'}
                </span>
                <span className="px-4 py-2 bg-[#3D5AFE]/10 text-[#3D5AFE] rounded-lg text-sm font-semibold">
                  {selectedQuestao.disciplina}
                </span>
              </div>

              {/* Usuário e Data */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Usuário</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedQuestao.userName}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Data</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedQuestao.dataResposta).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tempo</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedQuestao.tempoResposta}s
                  </p>
                </div>
              </div>

              {/* Enunciado */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Enunciado:</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedQuestao.enunciado}
                </p>
              </div>

              {/* Alternativas */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Alternativas:</h3>
                <div className="space-y-3">
                  {selectedQuestao.alternativas.map((alt) => (
                    <div
                      key={alt.letra}
                      className={`p-4 rounded-lg border-2 ${
                        alt.correta
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : selectedQuestao.respostaUsuario === alt.letra && !selectedQuestao.acertou
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`font-bold px-3 py-1 rounded ${
                          alt.correta
                            ? 'bg-green-600 text-white'
                            : selectedQuestao.respostaUsuario === alt.letra && !selectedQuestao.acertou
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {alt.letra}
                        </span>
                        <p className="flex-1 text-gray-700 dark:text-gray-300">
                          {alt.texto}
                        </p>
                        {alt.correta && (
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        )}
                        {selectedQuestao.respostaUsuario === alt.letra && !selectedQuestao.acertou && (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
