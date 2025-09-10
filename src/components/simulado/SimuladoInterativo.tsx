'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Questao, RespostaUsuario, ConfigSimulado } from "@/types/simulado"
import { carregarQuestoes } from "@/lib/carrega-questoes"
import { embaralharQuestoes, calcularEstatisticas } from "@/lib/simulado-utils"
import { cn } from "@/lib/utils"

interface SimuladoInterativoProps {
  config: ConfigSimulado;
  onFinished?: (resultado: any) => void;
}

export function SimuladoInterativo({ config, onFinished }: SimuladoInterativoProps) {
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<RespostaUsuario[]>([])
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null)
  const [mostrandoResposta, setMostrandoResposta] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null)
  const [tempoQuestao, setTempoQuestao] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  
  // Timer
  useEffect(() => {
    if (!tempoInicio || finalizado) return
    
    const interval = setInterval(() => {
      setTempoQuestao(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [tempoInicio, finalizado])
  
  // Carregar questões
  useEffect(() => {
    async function inicializar() {
      setCarregando(true)
      try {
        const todasQuestoes = await carregarQuestoes()
        
        let questoesFiltradas = todasQuestoes
        
        // Filtrar por disciplinas se especificado
        if (config.disciplinas && config.disciplinas.length > 0) {
          questoesFiltradas = todasQuestoes.filter(q => 
            config.disciplinas!.includes(q.disciplina)
          )
        }
        
        // Embaralhar questões
        const questoesEmbaralhadas = embaralharQuestoes(questoesFiltradas)
        
        // Limitar número de questões
        const questoesFinais = config.numeroQuestoes 
          ? questoesEmbaralhadas.slice(0, config.numeroQuestoes)
          : questoesEmbaralhadas
          
        setQuestoes(questoesFinais)
        setTempoInicio(new Date())
      } catch {
        // Erro ao carregar questões
      } finally {
        setCarregando(false)
      }
    }
    
    inicializar()
  }, [config])
  
  const questao = questoes[questaoAtual]
  const progresso = questoes.length > 0 ? ((questaoAtual + 1) / questoes.length) * 100 : 0
  
  const handleSelecionarResposta = (letra: string) => {
    if (mostrandoResposta) return
    setRespostaSelecionada(letra)
  }
  
  const handleConfirmarResposta = () => {
    if (!respostaSelecionada || !questao) return
    
    const alternativaCorreta = questao.alternativas.find(alt => alt.correta)
    const respostaCorreta = respostaSelecionada === alternativaCorreta?.letra
    
    const novaResposta: RespostaUsuario = {
      questaoId: questao.id,
      alternativaSelecionada: respostaSelecionada,
      correta: respostaCorreta,
      tempo: tempoQuestao
    }
    
    setRespostas(prev => [...prev, novaResposta])
    
    if (config.mostrarGabarito) {
      setMostrandoResposta(true)
    } else {
      proximaQuestao()
    }
  }
  
  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1)
      setRespostaSelecionada(null)
      setMostrandoResposta(false)
      setTempoQuestao(0)
    } else {
      finalizarSimulado()
    }
  }
  
  const finalizarSimulado = () => {
    setFinalizado(true)
    const resultado = calcularEstatisticas(respostas, questoes)
    onFinished?.(resultado)
  }
  
  const reiniciar = () => {
    setQuestaoAtual(0)
    setRespostas([])
    setRespostaSelecionada(null)
    setMostrandoResposta(false)
    setTempoInicio(new Date())
    setTempoQuestao(0)
    setFinalizado(false)
  }
  
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  if (carregando) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
          <p>Carregando questões...</p>
        </CardContent>
      </Card>
    )
  }
  
  if (questoes.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma questão encontrada.</p>
        </CardContent>
      </Card>
    )
  }
  
  if (finalizado) {
    const stats = calcularEstatisticas(respostas, questoes)
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Simulado Concluído!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.acertos}</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.erros}</div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.percentualGeral.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Aproveitamento</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatarTempo(stats.tempoTotal)}
              </div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
          </div>
          
          {/* Resultados por Disciplina */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Desempenho por Disciplina</h3>
            <div className="space-y-2">
              {stats.resultadosPorDisciplina.map((disc) => (
                <div key={disc.disciplina} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{disc.disciplina}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {disc.acertos}/{disc.total}
                    </span>
                    <div className="w-20">
                      <Progress value={disc.percentual} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">
                      {disc.percentual.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={reiniciar} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Refazer Simulado
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Questão {questaoAtual + 1} de {questoes.length}
            </CardTitle>
            <Badge variant="secondary" className="mt-2">
              {questao.disciplina}
            </Badge>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatarTempo(tempoQuestao)}</span>
            </div>
            <Progress value={progresso} className="w-32 mt-2" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enunciado */}
        <div className="prose prose-sm max-w-none">
          <p className="text-base leading-relaxed">{questao.enunciado}</p>
        </div>
        
        {/* Alternativas */}
        <div className="space-y-3">
          {questao.alternativas.map((alternativa, index) => {
            let buttonClass = "w-full text-left p-4 border rounded-lg transition-all hover:bg-gray-50"
            
            if (mostrandoResposta) {
              if (alternativa.correta) {
                buttonClass += " bg-green-100 border-green-500 text-green-800"
              } else if (alternativa.letra === respostaSelecionada) {
                buttonClass += " bg-red-100 border-red-500 text-red-800"
              }
            } else if (alternativa.letra === respostaSelecionada) {
              buttonClass += " bg-red-100 border-red-500"
            }
            
            return (
              <button
                key={`questao-${questaoAtual}-${questao.id}-alt-${alternativa.letra}-idx-${index}`}
                onClick={() => handleSelecionarResposta(alternativa.letra)}
                disabled={mostrandoResposta}
                className={cn(buttonClass)}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[24px]">
                    {alternativa.letra})
                  </span>
                  <span className="flex-1">{alternativa.texto}</span>
                  {mostrandoResposta && alternativa.correta && (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                  {mostrandoResposta && 
                   !alternativa.correta && 
                   alternativa.letra === respostaSelecionada && (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Ações */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {respostas.length} de {questoes.length} respondidas
          </div>
          
          <div className="flex gap-2">
            {!mostrandoResposta ? (
              <Button 
                onClick={handleConfirmarResposta} 
                disabled={!respostaSelecionada}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirmar Resposta
              </Button>
            ) : (
              <Button onClick={proximaQuestao} className="bg-red-600 hover:bg-red-700">
                {questaoAtual < questoes.length - 1 ? 'Próxima Questão' : 'Finalizar'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
