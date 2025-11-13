'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Calendar, Target, TrendingUp } from 'lucide-react'
import { QuestaoHistorico } from '@/types/simulado'

export default function QuestoesAcertosPage() {
  const router = useRouter()
  const [questoesCorretas, setQuestoesCorretas] = useState<QuestaoHistorico[]>([])
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('todas')
  const [questaoSelecionada, setQuestaoSelecionada] = useState<QuestaoHistorico | null>(null)
  const [modalAberta, setModalAberta] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = () => {
    const historico = localStorage.getItem('historico-questoes')
    if (historico) {
      const dados: QuestaoHistorico[] = JSON.parse(historico)
      const corretas = dados.filter(q => q.acertou)
      setQuestoesCorretas(corretas)
    }
  }

  const questoesFiltradas = disciplinaSelecionada === 'todas' 
    ? questoesCorretas 
    : questoesCorretas.filter(q => q.disciplina === disciplinaSelecionada)

  const disciplinas = Array.from(new Set(questoesCorretas.map(q => q.disciplina)))

  const abrirQuestao = (questao: QuestaoHistorico) => {
    setQuestaoSelecionada(questao)
    setModalAberta(true)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calcular tempo médio de resposta
  const tempoMedio = questoesCorretas.length > 0 
    ? Math.round(questoesCorretas.reduce((acc, q) => acc + q.tempoResposta, 0) / questoesCorretas.length)
    : 0

  // Questões de primeira tentativa
  const primeiraTentativa = questoesCorretas.filter(q => q.tentativas === 1).length

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/questoes')}
            className="hover:bg-green-500/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#FF3347] flex items-center gap-2">
              <CheckCircle className="h-8 w-8" />
              Questões Corretas
            </h1>
            <p className="text-muted-foreground">Revise suas questões acertadas</p>
          </div>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-[#FF3347]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#FF3347]" />
              Total de Acertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">{questoesCorretas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#3D5AFE]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-[#3D5AFE]" />
              Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">{disciplinas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#FF3347]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#FF3347]" />
              Primeira Tentativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">
              {primeiraTentativa}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {questoesCorretas.length > 0 ? Math.round((primeiraTentativa / questoesCorretas.length) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#3D5AFE]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#3D5AFE]" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">{tempoMedio}s</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por questão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={disciplinaSelecionada === 'todas' ? 'default' : 'outline'}
              onClick={() => setDisciplinaSelecionada('todas')}
              className={disciplinaSelecionada === 'todas' ? 'bg-[#FF3347] hover:bg-[#FF3347]/90' : ''}
            >
              Todas ({questoesCorretas.length})
            </Button>
            {disciplinas.map(disciplina => (
              <Button
                key={disciplina}
                variant={disciplinaSelecionada === disciplina ? 'default' : 'outline'}
                onClick={() => setDisciplinaSelecionada(disciplina)}
                className={disciplinaSelecionada === disciplina ? 'bg-[#3D5AFE] hover:bg-[#3D5AFE]/90' : ''}
              >
                {disciplina} ({questoesCorretas.filter(q => q.disciplina === disciplina).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Questões */}
      {questoesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma questão correta ainda</h3>
            <p className="text-muted-foreground text-center">
              {disciplinaSelecionada === 'todas' 
                ? 'Você ainda não acertou nenhuma questão.'
                : `Você não tem acertos em ${disciplinaSelecionada}.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questoesFiltradas.map((questao) => (
            <Card 
              key={`${questao.questaoId}-${questao.dataResposta}`}
              className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-[#FF3347]"
              onClick={() => abrirQuestao(questao)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-[#3D5AFE]/10 text-[#3D5AFE]">
                        {questao.disciplina}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-[#FF3347]">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Correto
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatarData(questao.dataResposta)}
                      </Badge>
                      {questao.tentativas > 1 && (
                        <Badge variant="outline" className="text-xs text-[#3D5AFE]">
                          {questao.tentativas}ª tentativa
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {questao.enunciado}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Questão */}
      <Dialog open={modalAberta} onOpenChange={setModalAberta}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-[#3D5AFE]/10 text-[#3D5AFE]">
                {questaoSelecionada?.disciplina}
              </Badge>
              <Badge variant="outline" className="text-xs text-[#FF3347]">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resposta Correta
              </Badge>
              <Badge variant="outline" className="text-xs">
                {questaoSelecionada && formatarData(questaoSelecionada.dataResposta)}
              </Badge>
            </div>
            <DialogTitle className="text-xl">{questaoSelecionada?.enunciado}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              {questaoSelecionada?.alternativas.map((alternativa, index) => {
                const letra = String.fromCharCode(65 + index)
                const isCorreta = letra === questaoSelecionada.respostaCorreta
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      isCorreta ? 'border-[#FF3347] bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorreta && <CheckCircle className="h-5 w-5 text-[#FF3347] mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <Label className="flex-1 cursor-pointer text-sm leading-relaxed">
                          <span className="font-semibold mr-2">{letra})</span>
                          <span className={isCorreta ? 'text-[#FF3347] font-medium' : ''}>
                            {alternativa.texto}
                          </span>
                        </Label>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Card className="bg-green-50 border-[#FF3347]/30">
              <CardHeader>
                <CardTitle className="text-base text-[#FF3347]">Informações da Resposta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sua resposta:</span>
                  <span className="font-medium text-[#FF3347]">
                    {questaoSelecionada?.respostaUsuario}
                  </span>
                </div>
                {questaoSelecionada?.tempoResposta && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo de resposta:</span>
                    <span className="font-medium">{questaoSelecionada.tempoResposta}s</span>
                  </div>
                )}
                {questaoSelecionada?.tentativas && questaoSelecionada.tentativas > 1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tentativas:</span>
                    <span className="font-medium">{questaoSelecionada.tentativas}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setModalAberta(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
