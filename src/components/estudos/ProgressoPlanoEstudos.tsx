'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  Calendar, 
  Trophy,
  TrendingUp,
  BookOpen,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Star
} from "lucide-react"

interface AtividadeEstudo {
  id: string
  disciplina: string
  tipo: 'teoria' | 'pratica' | 'revisao'
  titulo: string
  duracao: number
  concluida: boolean
  dataVencimento: Date
  prioridade: 'alta' | 'media' | 'baixa'
}

interface ProgressoPlanoEstudosProps {
  atividades: AtividadeEstudo[]
  onAtualizarProgresso?: (atividadeId: string, concluida: boolean) => void
}

export default function ProgressoPlanoEstudos({ atividades, onAtualizarProgresso }: ProgressoPlanoEstudosProps) {
  const [atividadesLocais, setAtividadesLocais] = useState<AtividadeEstudo[]>(atividades)
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'concluidas'>('todas')
  
  useEffect(() => {
    setAtividadesLocais(atividades)
  }, [atividades])

  const handleConcluirAtividade = (atividadeId: string) => {
    setAtividadesLocais(prev => 
      prev.map(atividade => 
        atividade.id === atividadeId 
          ? { ...atividade, concluida: !atividade.concluida }
          : atividade
      )
    )
    
    const atividade = atividadesLocais.find(a => a.id === atividadeId)
    if (atividade && onAtualizarProgresso) {
      onAtualizarProgresso(atividadeId, !atividade.concluida)
    }
  }

  const calcularEstatisticas = () => {
    const total = atividadesLocais.length
    const concluidas = atividadesLocais.filter(a => a.concluida).length
    const porcentagem = total > 0 ? (concluidas / total) * 100 : 0
    
    const horasTotal = atividadesLocais.reduce((acc, a) => acc + a.duracao, 0)
    const horasConcluidas = atividadesLocais
      .filter(a => a.concluida)
      .reduce((acc, a) => acc + a.duracao, 0)
    
    const atividadesHoje = atividadesLocais.filter(a => {
      const hoje = new Date()
      const dataAtividade = new Date(a.dataVencimento)
      return dataAtividade.toDateString() === hoje.toDateString()
    })

    return {
      total,
      concluidas,
      porcentagem,
      horasTotal,
      horasConcluidas,
      atividadesHoje: atividadesHoje.length,
      atividadesHojeConcluidas: atividadesHoje.filter(a => a.concluida).length
    }
  }

  const filtrarAtividades = () => {
    switch (filtro) {
      case 'pendentes':
        return atividadesLocais.filter(a => !a.concluida)
      case 'concluidas':
        return atividadesLocais.filter(a => a.concluida)
      default:
        return atividadesLocais
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-300'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'teoria': return <BookOpen className="h-4 w-4" />
      case 'pratica': return <Target className="h-4 w-4" />
      case 'revisao': return <RotateCcw className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const stats = calcularEstatisticas()
  const atividadesFiltradas = filtrarAtividades()

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            📊 Progresso do Plano de Estudos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.porcentagem.toFixed(1)}%</div>
              <div className="text-blue-100">Progresso Geral</div>
              <Progress value={stats.porcentagem} className="mt-2 bg-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.concluidas}/{stats.total}</div>
              <div className="text-blue-100">Atividades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.horasConcluidas}h</div>
              <div className="text-blue-100">de {stats.horasTotal}h estudadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.atividadesHojeConcluidas}/{stats.atividadesHoje}</div>
              <div className="text-blue-100">Hoje</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividades de Estudo
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={filtro === 'todas' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFiltro('todas')}
              >
                Todas ({stats.total})
              </Button>
              <Button 
                variant={filtro === 'pendentes' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFiltro('pendentes')}
              >
                Pendentes ({stats.total - stats.concluidas})
              </Button>
              <Button 
                variant={filtro === 'concluidas' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFiltro('concluidas')}
              >
                Concluídas ({stats.concluidas})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {atividadesFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filtro === 'todas' && 'Nenhuma atividade encontrada'}
                  {filtro === 'pendentes' && 'Parabéns! Todas as atividades foram concluídas!'}
                  {filtro === 'concluidas' && 'Nenhuma atividade concluída ainda'}
                </p>
              </div>
            ) : (
              atividadesFiltradas.map((atividade) => (
                <Card 
                  key={atividade.id} 
                  className={`border-l-4 ${
                    atividade.concluida 
                      ? 'border-l-green-500 bg-green-50' 
                      : atividade.prioridade === 'alta' 
                        ? 'border-l-red-500' 
                        : atividade.prioridade === 'media'
                          ? 'border-l-yellow-500'
                          : 'border-l-green-500'
                  }`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={atividade.concluida}
                        onCheckedChange={() => handleConcluirAtividade(atividade.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${atividade.concluida ? 'line-through text-gray-500' : ''}`}>
                            {atividade.titulo}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {atividade.disciplina}
                          </Badge>
                          <Badge className={getPrioridadeColor(atividade.prioridade)}>
                            {atividade.prioridade}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {getTipoIcon(atividade.tipo)}
                            <span className="capitalize">{atividade.tipo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{atividade.duracao}min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(atividade.dataVencimento).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {atividade.concluida ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConcluirAtividade(atividade.id)}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Motivação e Conquistas */}
      {stats.porcentagem > 0 && (
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="text-xl font-bold text-yellow-800">
                  {stats.porcentagem >= 80 && '🏆 Excelente progresso!'}
                  {stats.porcentagem >= 60 && stats.porcentagem < 80 && '🎯 Muito bem!'}
                  {stats.porcentagem >= 40 && stats.porcentagem < 60 && '📈 Continue assim!'}
                  {stats.porcentagem >= 20 && stats.porcentagem < 40 && '💪 Você está no caminho certo!'}
                  {stats.porcentagem < 20 && '🚀 Vamos começar!'}
                </h3>
                <p className="text-yellow-700">
                  Você já concluiu {stats.porcentagem.toFixed(1)}% do seu plano de estudos.
                  {stats.porcentagem >= 50 && ' Você está na metade do caminho!'}
                  {stats.porcentagem >= 80 && ' Parabéns pelo comprometimento!'}
                </p>
              </div>
            </div>
            
            {stats.atividadesHoje > 0 && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">📅 Meta de Hoje:</h4>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(stats.atividadesHojeConcluidas / stats.atividadesHoje) * 100} 
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-yellow-700">
                    {stats.atividadesHojeConcluidas}/{stats.atividadesHoje}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
