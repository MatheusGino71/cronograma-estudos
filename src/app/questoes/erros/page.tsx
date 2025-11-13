'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, XCircle, Clock, Calendar, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { QuestaoHistorico } from '@/types/simulado'

export default function QuestoesErrosPage() {
  const router = useRouter()
  const [questoesErradas, setQuestoesErradas] = useState<QuestaoHistorico[]>([])
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('todas')
  const [questaoSelecionada, setQuestaoSelecionada] = useState<QuestaoHistorico | null>(null)
  const [modalAberta, setModalAberta] = useState(false)
  const [modoRefazer, setModoRefazer] = useState(false)
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null)
  const [respostaCorreta, setRespostaCorreta] = useState(false)
  const [mostrarResultado, setMostrarResultado] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    // Carregar histórico do localStorage
    const historico = localStorage.getItem('historico-questoes')
    if (historico) {
      const dados: QuestaoHistorico[] = JSON.parse(historico)
      const erradas = dados.filter(q => !q.acertou)
      setQuestoesErradas(erradas)
    }
  }

  const questoesFiltradas = disciplinaSelecionada === 'todas' 
    ? questoesErradas 
    : questoesErradas.filter(q => q.disciplina === disciplinaSelecionada)

  const disciplinas = Array.from(new Set(questoesErradas.map(q => q.disciplina)))

  const abrirQuestao = (questao: QuestaoHistorico) => {
    setQuestaoSelecionada(questao)
    setModalAberta(true)
    setModoRefazer(false)
    setRespostaSelecionada(null)
    setMostrarResultado(false)
  }

  const iniciarRefazer = () => {
    setModoRefazer(true)
    setRespostaSelecionada(null)
    setMostrarResultado(false)
  }

  const confirmarResposta = () => {
    if (respostaSelecionada === null || !questaoSelecionada) return

    const acertou = respostaSelecionada === questaoSelecionada.respostaCorreta
    setRespostaCorreta(acertou)
    setMostrarResultado(true)

    // Atualizar histórico no localStorage
    const historico = localStorage.getItem('historico-questoes')
    if (historico) {
      const dados: QuestaoHistorico[] = JSON.parse(historico)
      
      // Adicionar nova tentativa
      const novaTentativa: QuestaoHistorico = {
        ...questaoSelecionada,
        respostaUsuario: respostaSelecionada,
        acertou: acertou,
        dataResposta: new Date().toISOString(),
        tentativas: (questaoSelecionada.tentativas || 1) + 1
      }
      
      dados.push(novaTentativa)
      localStorage.setItem('historico-questoes', JSON.stringify(dados))

      // Atualizar estatísticas
      atualizarEstatisticas(acertou)
      
      // Se acertou, remover da lista de erros
      if (acertou) {
        setTimeout(() => {
          carregarDados()
          setModalAberta(false)
        }, 2000)
      }
    }
  }

  const atualizarEstatisticas = (acertou: boolean) => {
    const estatisticas = localStorage.getItem('estatisticas-questoes')
    if (estatisticas) {
      const dados = JSON.parse(estatisticas)
      dados.totalRespondidas += 1
      
      if (acertou) {
        dados.totalCorretas += 1
        dados.totalIncorretas = Math.max(0, dados.totalIncorretas - 1)
      } else {
        dados.totalIncorretas += 1
      }
      
      localStorage.setItem('estatisticas-questoes', JSON.stringify(dados))
    }
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

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/questoes')}
            className="hover:bg-[#FF3347]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#3D5AFE] flex items-center gap-2">
              <XCircle className="h-8 w-8" />
              Questões Erradas
            </h1>
            <p className="text-muted-foreground">Revise e refaça suas questões incorretas</p>
          </div>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-[#3D5AFE]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-[#3D5AFE]" />
              Total de Erros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">{questoesErradas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#FF3347]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#FF3347]" />
              Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">{disciplinas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#3D5AFE]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#3D5AFE]" />
              Múltiplas Tentativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#3D5AFE]">
              {questoesErradas.filter(q => (q.tentativas || 1) > 1).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#FF3347]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF3347]" />
              Últimas 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FF3347]">
              {questoesErradas.filter(q => {
                const diff = Date.now() - new Date(q.dataResposta).getTime()
                return diff < 24 * 60 * 60 * 1000
              }).length}
            </div>
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
              className={disciplinaSelecionada === 'todas' ? 'bg-[#3D5AFE] hover:bg-[#3D5AFE]/90' : ''}
            >
              Todas ({questoesErradas.length})
            </Button>
            {disciplinas.map(disciplina => (
              <Button
                key={disciplina}
                variant={disciplinaSelecionada === disciplina ? 'default' : 'outline'}
                onClick={() => setDisciplinaSelecionada(disciplina)}
                className={disciplinaSelecionada === disciplina ? 'bg-[#FF3347] hover:bg-[#FF3347]/90' : ''}
              >
                {disciplina} ({questoesErradas.filter(q => q.disciplina === disciplina).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Questões */}
      {questoesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-[#FF3347] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma questão errada!</h3>
            <p className="text-muted-foreground text-center">
              {disciplinaSelecionada === 'todas' 
                ? 'Você ainda não errou nenhuma questão.'
                : `Você não tem erros em ${disciplinaSelecionada}.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questoesFiltradas.map((questao) => (
            <Card 
              key={`${questao.questaoId}-${questao.dataResposta}`}
              className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-[#3D5AFE]"
              onClick={() => abrirQuestao(questao)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-[#3D5AFE]/10 text-[#3D5AFE]">
                        {questao.disciplina}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatarData(questao.dataResposta)}
                      </Badge>
                      {(questao.tentativas || 1) > 1 && (
                        <Badge variant="outline" className="text-xs text-[#FF3347]">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          {questao.tentativas} tentativas
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base line-clamp-2">
                      {questao.enunciado}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#FF3347] hover:bg-[#FF3347]/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      abrirQuestao(questao)
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refazer
                  </Button>
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
              {!modoRefazer && (
                <>
                  <Badge variant="outline" className="text-xs">
                    Erro registrado em {questaoSelecionada && formatarData(questaoSelecionada.dataResposta)}
                  </Badge>
                  {questaoSelecionada && (questaoSelecionada.tentativas || 1) > 1 && (
                    <Badge variant="outline" className="text-xs text-purple-500">
                      {questaoSelecionada.tentativas} tentativas
                    </Badge>
                  )}
                </>
              )}
            </div>
            <DialogTitle className="text-xl">{questaoSelecionada?.enunciado}</DialogTitle>
            {modoRefazer && (
              <DialogDescription className="text-[#FF3347] font-medium">
                Tente responder novamente esta questão
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {modoRefazer ? (
              <>
                <RadioGroup value={respostaSelecionada || ''} onValueChange={(value) => setRespostaSelecionada(value)}>
                  {questaoSelecionada?.alternativas.map((alternativa, index) => {
                    const letra = String.fromCharCode(65 + index)
                    return (
                      <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={letra} id={`alt-${index}`} className="mt-1" />
                        <Label htmlFor={`alt-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                          <span className="font-semibold mr-2">{letra})</span>
                          {alternativa.texto}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>

                {mostrarResultado && (
                  <Card className={respostaCorreta ? 'border-[#FF3347] bg-green-50' : 'border-[#3D5AFE] bg-red-50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        {respostaCorreta ? (
                          <>
                            <CheckCircle2 className="h-6 w-6 text-[#FF3347]" />
                            <div>
                              <p className="font-semibold text-[#FF3347]">Parabéns! Resposta correta!</p>
                              <p className="text-sm text-muted-foreground">Esta questão será removida da lista de erros.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-6 w-6 text-[#3D5AFE]" />
                            <div>
                              <p className="font-semibold text-[#3D5AFE]">Resposta incorreta</p>
                              <p className="text-sm text-muted-foreground">
                                A resposta correta é: <span className="font-bold text-[#FF3347]">{questaoSelecionada?.respostaCorreta}</span>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setModoRefazer(false)}>
                    Cancelar
                  </Button>
                  {!mostrarResultado && (
                    <Button 
                      onClick={confirmarResposta}
                      disabled={respostaSelecionada === null}
                      className="bg-[#FF3347] hover:bg-[#FF3347]/90"
                    >
                      Confirmar Resposta
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  {questaoSelecionada?.alternativas.map((alternativa, index) => {
                    const letra = String.fromCharCode(65 + index)
                    const isCorreta = letra === questaoSelecionada.respostaCorreta
                    const isRespostaUsuario = letra === questaoSelecionada.respostaUsuario
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          isCorreta
                            ? 'border-green-500 bg-green-50'
                            : isRespostaUsuario
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isCorreta && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />}
                          {isRespostaUsuario && !isCorreta && <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <span className="font-semibold mr-2">{letra})</span>
                            <span className={isCorreta ? 'text-green-700 font-medium' : isRespostaUsuario ? 'text-red-700' : ''}>
                              {alternativa.texto}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Card className="bg-muted/50 border-[#3D5AFE]/30">
                  <CardHeader>
                    <CardTitle className="text-base text-[#3D5AFE]">Informações da Tentativa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sua resposta:</span>
                      <span className="font-medium text-[#3D5AFE]">
                        {questaoSelecionada?.respostaUsuario}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resposta correta:</span>
                      <span className="font-medium text-[#FF3347]">
                        {questaoSelecionada?.respostaCorreta}
                      </span>
                    </div>
                    {questaoSelecionada?.tempoResposta && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo de resposta:</span>
                        <span className="font-medium">{questaoSelecionada.tempoResposta}s</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setModalAberta(false)}>
                    Fechar
                  </Button>
                  <Button 
                    onClick={iniciarRefazer}
                    className="bg-[#FF3347] hover:bg-[#FF3347]/90"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
