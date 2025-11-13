'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, CheckCircle, XCircle, Clock } from 'lucide-react'
import { QuestaoHistorico } from '@/types/simulado'

export default function QuestoesRespondidasPage() {
  const router = useRouter()
  const [todasQuestoes, setTodasQuestoes] = useState<QuestaoHistorico[]>([])
  const [filtro, setFiltro] = useState<'todas' | 'acertos' | 'erros'>('todas')
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('todas')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = () => {
    const historico = localStorage.getItem('historico-questoes')
    if (historico) {
      const dados: QuestaoHistorico[] = JSON.parse(historico)
      // Ordenar por data mais recente
      dados.sort((a, b) => new Date(b.dataResposta).getTime() - new Date(a.dataResposta).getTime())
      setTodasQuestoes(dados)
    }
  }

  const questoesFiltradas = todasQuestoes.filter(q => {
    const passaFiltroTipo = filtro === 'todas' || 
      (filtro === 'acertos' && q.acertou) || 
      (filtro === 'erros' && !q.acertou)
    
    const passaFiltroDisciplina = disciplinaSelecionada === 'todas' || q.disciplina === disciplinaSelecionada
    
    return passaFiltroTipo && passaFiltroDisciplina
  })

  const disciplinas = Array.from(new Set(todasQuestoes.map(q => q.disciplina)))
  
  const totalAcertos = todasQuestoes.filter(q => q.acertou).length
  const totalErros = todasQuestoes.filter(q => !q.acertou).length
  const tempoMedio = todasQuestoes.length > 0 
    ? Math.round(todasQuestoes.reduce((acc, q) => acc + q.tempoResposta, 0) / todasQuestoes.length)
    : 0

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const verDetalhes = (questao: QuestaoHistorico) => {
    if (questao.acertou) {
      router.push('/questoes/acertos')
    } else {
      router.push('/questoes/erros')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/questoes')}
            className="hover:bg-[#3D5AFE]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#3D5AFE] flex items-center gap-2">
              <Target className="h-8 w-8" />
              Questões Respondidas
            </h1>
            <p className="text-muted-foreground">Histórico completo das suas respostas</p>
          </div>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-[#3D5AFE]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-[#3D5AFE]" />
              Total Respondidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">{todasQuestoes.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#FF3347]/30 cursor-pointer hover:shadow-lg transition-all" onClick={() => setFiltro('acertos')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#FF3347]" />
              Acertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">{totalAcertos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todasQuestoes.length > 0 ? Math.round((totalAcertos / todasQuestoes.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#3D5AFE]/30 cursor-pointer hover:shadow-lg transition-all" onClick={() => setFiltro('erros')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-[#3D5AFE]" />
              Erros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">{totalErros}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todasQuestoes.length > 0 ? Math.round((totalErros / todasQuestoes.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#FF3347]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF3347]" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">{tempoMedio}s</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtro por tipo */}
          <div>
            <h3 className="text-sm font-medium mb-2">Tipo de Resposta</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filtro === 'todas' ? 'default' : 'outline'}
                onClick={() => setFiltro('todas')}
                className={filtro === 'todas' ? 'bg-[#3D5AFE] hover:bg-[#3D5AFE]/90' : ''}
              >
                Todas ({todasQuestoes.length})
              </Button>
              <Button
                variant={filtro === 'acertos' ? 'default' : 'outline'}
                onClick={() => setFiltro('acertos')}
                className={filtro === 'acertos' ? 'bg-[#FF3347] hover:bg-[#FF3347]/90' : ''}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acertos ({totalAcertos})
              </Button>
              <Button
                variant={filtro === 'erros' ? 'default' : 'outline'}
                onClick={() => setFiltro('erros')}
                className={filtro === 'erros' ? 'bg-[#3D5AFE] hover:bg-[#3D5AFE]/90' : ''}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Erros ({totalErros})
              </Button>
            </div>
          </div>

          {/* Filtro por disciplina */}
          <div>
            <h3 className="text-sm font-medium mb-2">Disciplina</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={disciplinaSelecionada === 'todas' ? 'default' : 'outline'}
                onClick={() => setDisciplinaSelecionada('todas')}
                size="sm"
              >
                Todas
              </Button>
              {disciplinas.map(disciplina => (
                <Button
                  key={disciplina}
                  variant={disciplinaSelecionada === disciplina ? 'default' : 'outline'}
                  onClick={() => setDisciplinaSelecionada(disciplina)}
                  size="sm"
                >
                  {disciplina}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Questões */}
      {questoesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma questão encontrada</h3>
            <p className="text-muted-foreground text-center">
              Tente ajustar os filtros ou responda mais questões.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questoesFiltradas.map((questao) => (
            <Card 
              key={`${questao.questaoId}-${questao.dataResposta}`}
              className={`cursor-pointer hover:shadow-lg transition-all border-l-4 ${
                questao.acertou ? 'border-l-[#FF3347]' : 'border-l-[#3D5AFE]'
              }`}
              onClick={() => verDetalhes(questao)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="bg-[#3D5AFE]/10 text-[#3D5AFE]">
                        {questao.disciplina}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${questao.acertou ? 'text-[#FF3347] border-[#FF3347]' : 'text-[#3D5AFE] border-[#3D5AFE]'}`}
                      >
                        {questao.acertou ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correto
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorreto
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formatarData(questao.dataResposta)}
                      </Badge>
                      {questao.tempoResposta && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {questao.tempoResposta}s
                        </Badge>
                      )}
                      {questao.tentativas > 1 && (
                        <Badge variant="outline" className="text-xs text-[#FF3347]">
                          {questao.tentativas} tentativas
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {questao.enunciado}
                    </CardTitle>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Sua resposta: <span className={`font-medium ${questao.acertou ? 'text-[#FF3347]' : 'text-[#3D5AFE]'}`}>{questao.respostaUsuario}</span></span>
                      <span>•</span>
                      <span>Correta: <span className="font-medium text-[#FF3347]">{questao.respostaCorreta}</span></span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
