'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Bookmark, BookmarkCheck, Clock } from 'lucide-react'
import { carregarQuestoesDoFirebase } from '@/lib/migrador-questoes'
import type { Questao } from '@/types/simulado'

// Função para decodificar HTML entities e remover tags
function decodeHTMLContent(text: string): string {
  if (!text) return ''
  
  // Primeiro decodifica entidades HTML
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&nbsp;': ' ',
    '&apos;': "'",
  }
  
  let decoded = text
  
  // Decodifica entidades conhecidas
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  })
  
  // Remove tags HTML comuns mas preserva o conteúdo
  decoded = decoded
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<strong>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<b>/gi, '')
    .replace(/<\/b>/gi, '')
    .replace(/<i>/gi, '')
    .replace(/<\/i>/gi, '')
    .replace(/<em>/gi, '')
    .replace(/<\/em>/gi, '')
    .replace(/<u>/gi, '')
    .replace(/<\/u>/gi, '')
  
  // Remove qualquer outra tag HTML restante
  decoded = decoded.replace(/<[^>]+>/g, '')
  
  // Limpa múltiplas quebras de linha
  decoded = decoded.replace(/\n{3,}/g, '\n\n')
  
  return decoded.trim()
}

// Adapter para converter Questao (Firebase) para QuestaoAgrupada (formato antigo)
interface QuestaoAgrupada {
  id: string
  area: string
  enunciado: string
  alternativas: Array<{
    letra: string
    descricao: string
    correta: boolean
  }>
}

function converterQuestaoFirebase(questao: Questao): QuestaoAgrupada {
  return {
    id: `firebase-${questao.id}`,
    area: questao.disciplina,
    enunciado: decodeHTMLContent(questao.enunciado),
    alternativas: questao.alternativas.map(alt => ({
      letra: alt.letra,
      descricao: decodeHTMLContent(alt.texto),
      correta: alt.correta
    }))
  }
}

export default function PraticaQuestoesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [questoes, setQuestoes] = useState<QuestaoAgrupada[]>([])
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [respostasUsuario, setRespostasUsuario] = useState<Record<number, string>>({})
  const [revelarResposta, setRevelarResposta] = useState<Record<number, boolean>>({})
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [tempoInicio] = useState(Date.now())
  const [tempoDecorrido, setTempoDecorrido] = useState(0)

  useEffect(() => {
    async function carregarQuestoes() {
      try {
        const disciplinaId = searchParams.get('disciplina')
        const quantidade = Number(searchParams.get('quantidade')) || 10
        
        // Carrega questões do Firebase
        const questoesFirebase = await carregarQuestoesDoFirebase()
        
        // Filtra por disciplina se necessário
        let questoesFiltradas = questoesFirebase
        if (disciplinaId && disciplinaId !== 'todas') {
          questoesFiltradas = questoesFirebase.filter(q => 
            q.disciplina.toLowerCase().includes(disciplinaId.toLowerCase())
          )
        }
        
        // Embaralha e limita quantidade
        const questoesEmbaralhadas = questoesFiltradas
          .sort(() => Math.random() - 0.5)
          .slice(0, quantidade)
        
        // Converte para formato do componente
        const questoesConvertidas = questoesEmbaralhadas.map(converterQuestaoFirebase)
        
        setQuestoes(questoesConvertidas)
      } catch (error) {
        console.error('Erro ao carregar questões:', error)
      } finally {
        setLoading(false)
      }
    }
    
    carregarQuestoes()
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoDecorrido(Math.floor((Date.now() - tempoInicio) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [tempoInicio])

  const questaoAtual = questoes[indiceAtual]

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60)
    const sec = segundos % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleResposta = (letra: string) => {
    setRespostasUsuario(prev => ({
      ...prev,
      [indiceAtual]: letra
    }))
  }

  const handleRevelarResposta = () => {
    setRevelarResposta(prev => ({
      ...prev,
      [indiceAtual]: true
    }))
  }

  const handleMarcar = () => {
    setMarcadas(prev => {
      const novoSet = new Set(prev)
      if (novoSet.has(indiceAtual)) {
        novoSet.delete(indiceAtual)
      } else {
        novoSet.add(indiceAtual)
      }
      return novoSet
    })
  }

  const handleProxima = () => {
    if (indiceAtual < questoes.length - 1) {
      setIndiceAtual(prev => prev + 1)
    }
  }

  const handleAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(prev => prev - 1)
    }
  }

  const handleFinalizar = () => {
    const tempoTotal = Date.now() - tempoInicio
    const respondidas = Object.keys(respostasUsuario).length
    const corretas = questoes.filter((q, idx) => {
      const resposta = respostasUsuario[idx]
      return q.alternativas.find(a => a.letra === resposta)?.correta
    }).length
    const incorretas = respondidas - corretas

    const resultado = {
      questoes: questoes.map((q, idx) => ({
        id: q.id,
        area: q.area,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        respostaUsuario: {
          alternativaSelecionada: respostasUsuario[idx] || null,
          correta: respostasUsuario[idx] 
            ? q.alternativas.find(a => a.letra === respostasUsuario[idx])?.correta || false
            : null
        }
      })),
      estatisticas: {
        total: questoes.length,
        respondidas,
        corretas,
        incorretas,
        porcentagem: respondidas > 0 ? Math.round((corretas / respondidas) * 100) : 0,
        tempoTotal
      }
    }

    sessionStorage.setItem('resultado-pratica', JSON.stringify(resultado))
    sessionStorage.setItem('questoes-pratica', JSON.stringify(questoes))
    router.push('/questoes/resultado')
  }

  const questoesRespondidas = Object.keys(respostasUsuario).length
  const progressoPercentual = (questoesRespondidas / questoes.length) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-10">
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-4 bg-primary/10 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-muted-foreground">Carregando questões...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!questaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-10 text-center space-y-4">
            <p className="text-lg">Nenhuma questão disponível.</p>
            <Button onClick={() => router.push('/questoes')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Questões
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const respostaSelecionada = respostasUsuario[indiceAtual]
  const revelar = revelarResposta[indiceAtual]
  const alternativaCorreta = questaoAtual.alternativas.find(a => a.correta)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Top Bar - Estilo QConcursos */}
      <div className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push('/questoes')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sair
            </Button>
            
            <div className="flex items-center gap-6">
              {/* Progress */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Respondidas: {questoesRespondidas}/{questoes.length}
                </span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressoPercentual}%` }}
                  />
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-semibold">{formatarTempo(tempoDecorrido)}</span>
              </div>

              {/* Bookmark */}
              <Button
                variant={marcadas.has(indiceAtual) ? "default" : "outline"}
                size="sm"
                onClick={handleMarcar}
              >
                {marcadas.has(indiceAtual) ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>

              {/* Finish */}
              <Button size="sm" onClick={handleFinalizar} variant="secondary">
                Finalizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Mapa de Questões */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Questões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {questoes.map((_, idx) => {
                    const respondida = respostasUsuario[idx]
                    const marcada = marcadas.has(idx)
                    const ativa = idx === indiceAtual
                    const revelada = revelarResposta[idx]

                    let className = "w-10 h-10 p-0 font-semibold"
                    if (ativa) className += " ring-2 ring-primary"
                    if (revelada && respostasUsuario[idx]) {
                      const questao = questoes[idx]
                      const acertou = questao.alternativas.find(a => a.letra === respostasUsuario[idx])?.correta
                      className += acertou ? " bg-green-500 text-white hover:bg-green-600" : " bg-red-500 text-white hover:bg-red-600"
                    } else if (respondida) {
                      className += " bg-primary/20 hover:bg-primary/30"
                    }
                    if (marcada) className += " border-2 border-amber-500"

                    return (
                      <Button
                        key={`questao-nav-${idx}`}
                        variant={ativa && !revelada ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIndiceAtual(idx)}
                        className={className}
                        title={`Questão ${idx + 1}${marcada ? ' (Marcada)' : ''}`}
                      >
                        {idx + 1}
                      </Button>
                    )
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-4 pt-4 border-t space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-500 rounded" />
                    <span>Marcada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/20 rounded border" />
                    <span>Respondida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span>Correta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />
                    <span>Incorreta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Card */}
            <Card>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-semibold">
                      Questão {indiceAtual + 1}
                    </Badge>
                    <Badge variant="outline">{questaoAtual.area}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {questaoAtual.enunciado}
                  </p>
                </div>

                <RadioGroup
                  value={respostaSelecionada}
                  onValueChange={handleResposta}
                  disabled={revelar}
                  className="space-y-3"
                >
                  {questaoAtual.alternativas.map((alternativa) => {
                    const isCorreta = alternativa.correta
                    const isSelecionada = respostaSelecionada === alternativa.letra
                    const mostrarFeedback = revelar

                    let borderClass = "border-2"
                    let bgClass = "bg-card hover:bg-muted/50"
                    
                    if (mostrarFeedback && isCorreta) {
                      borderClass = "border-2 border-green-500"
                      bgClass = "bg-green-50 dark:bg-green-950/30"
                    } else if (mostrarFeedback && isSelecionada && !isCorreta) {
                      borderClass = "border-2 border-red-500"
                      bgClass = "bg-red-50 dark:bg-red-950/30"
                    } else if (isSelecionada) {
                      borderClass = "border-2 border-primary"
                      bgClass = "bg-primary/5"
                    }

                    return (
                      <div
                        key={`${questaoAtual.id}-alt-${alternativa.letra}`}
                        className={`
                          relative flex items-start space-x-3 rounded-lg p-4
                          transition-all duration-200 cursor-pointer
                          ${borderClass} ${bgClass}
                        `}
                      >
                        <RadioGroupItem
                          value={alternativa.letra}
                          id={`${questaoAtual.id}-${alternativa.letra}`}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={`${questaoAtual.id}-${alternativa.letra}`}
                          className="flex-1 cursor-pointer leading-relaxed"
                        >
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted font-semibold text-sm mr-3">
                            {alternativa.letra}
                          </span>
                          {alternativa.descricao}
                        </Label>
                        
                        {mostrarFeedback && isCorreta && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        )}
                        {mostrarFeedback && isSelecionada && !isCorreta && (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>

                {/* Feedback Section */}
                <div className="mt-6">
                  {!revelar ? (
                    <Button
                      onClick={handleRevelarResposta}
                      disabled={!respostaSelecionada}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      Responder
                    </Button>
                  ) : (
                    <Card className={`
                      ${respostaSelecionada === alternativaCorreta?.letra 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
                        : 'border-red-500 bg-red-50 dark:bg-red-950/30'}
                    `}>
                      <CardContent className="py-4">
                        {respostaSelecionada === alternativaCorreta?.letra ? (
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-green-700 dark:text-green-400">
                                Parabéns! Resposta correta ✓
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Você acertou a alternativa {alternativaCorreta?.letra}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="font-semibold text-red-700 dark:text-red-400 mb-2">
                                Resposta incorreta
                              </p>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="text-muted-foreground">Sua resposta:</span>{' '}
                                  <span className="font-semibold">{respostaSelecionada}</span>
                                </p>
                                <p>
                                  <span className="text-muted-foreground">Resposta correta:</span>{' '}
                                  <span className="font-semibold text-green-600">{alternativaCorreta?.letra}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleAnterior}
                disabled={indiceAtual === 0}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <Button
                onClick={handleProxima}
                disabled={indiceAtual === questoes.length - 1}
                size="lg"
              >
                Próxima
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
