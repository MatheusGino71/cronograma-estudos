'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultadoDisciplina } from "@/types/simulado"
import { 
  BookOpen, 
  Clock, 
  Target, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Video, 
  PenTool, 
  Users,
  Brain,
  Lightbulb,
  Trophy,
  Star,
  PlayCircle,
  Download,
  Timer
} from "lucide-react"

interface MetodoEstudoPersonalizadoProps {
  resultados: ResultadoDisciplina[]
  percentualGeral: number
  questoesCorretas: number
  totalQuestoes: number
  tempoTotal: string
  onIniciarPlano?: () => void
}

interface PlanoEstudo {
  disciplina: string
  prioridade: 'critica' | 'alta' | 'media' | 'baixa'
  horasSemanais: number
  metodos: string[]
  recursos: {
    tipo: 'video' | 'texto' | 'exercicios' | 'simulados' | 'grupo'
    nome: string
    duracao: string
    descricao: string
  }[]
  cronogramaSemanal: {
    dia: string
    atividades: {
      horario: string
      atividade: string
      tipo: 'teoria' | 'pratica' | 'revisao'
      duracao: number
    }[]
  }[]
}

export default function MetodoEstudoPersonalizado({
  resultados,
  percentualGeral,
  questoesCorretas,
  totalQuestoes,
  tempoTotal,
  onIniciarPlano
}: MetodoEstudoPersonalizadoProps) {
  const [planoGerado, setPlanoGerado] = useState(false)
  const [planoAtivo, setPlanoAtivo] = useState<PlanoEstudo[]>([])

  // Análise da performance para gerar prioridades
  const analisarPerformance = () => {
    return resultados.map(resultado => {
      const percentual = (resultado.acertos / resultado.total) * 100
      let prioridade: 'critica' | 'alta' | 'media' | 'baixa'
      let horasSemanais: number
      
      if (percentual === 0) {
        prioridade = 'critica'
        horasSemanais = 8
      } else if (percentual < 30) {
        prioridade = 'alta'
        horasSemanais = 6
      } else if (percentual < 60) {
        prioridade = 'media'
        horasSemanais = 4
      } else {
        prioridade = 'baixa'
        horasSemanais = 2
      }

      return {
        disciplina: resultado.disciplina,
        percentual,
        prioridade,
        horasSemanais
      }
    })
  }

  // Gerar plano de estudo completo
  const gerarPlanoEstudo = () => {
    const analise = analisarPerformance()
    
    const planos: PlanoEstudo[] = analise.map(item => {
      const metodos = gerarMetodos(item.prioridade, item.percentual)
      const recursos = gerarRecursos(item.disciplina, item.prioridade)
      const cronogramaSemanal = gerarCronogramaSemanal(item.disciplina, item.horasSemanais)

      return {
        disciplina: item.disciplina,
        prioridade: item.prioridade,
        horasSemanais: item.horasSemanais,
        metodos,
        recursos,
        cronogramaSemanal
      }
    })

    setPlanoAtivo(planos)
    setPlanoGerado(true)
  }

  const gerarMetodos = (prioridade: string, percentual: number) => {
    const metodosBase = [
      'Leitura dirigida com fichamento',
      'Resolução de questões comentadas',
      'Mapas mentais e resumos',
      'Simulados temáticos'
    ]

    const metodosAvancados = [
      'Técnica Pomodoro (25min estudo + 5min pausa)',
      'Flashcards para memorização',
      'Grupos de estudo online',
      'Revisão espaçada',
      'Ensinar o conteúdo (técnica Feynman)'
    ]

    if (prioridade === 'critica') {
      return [...metodosBase, ...metodosAvancados.slice(0, 3)]
    } else if (prioridade === 'alta') {
      return [...metodosBase, ...metodosAvancados.slice(0, 2)]
    } else {
      return metodosBase
    }
  }

  const gerarRecursos = (disciplina: string, prioridade: string) => {
    const recursosBase = [
      {
        tipo: 'video' as const,
        nome: `Curso Completo de ${disciplina}`,
        duracao: '40h',
        descricao: 'Videoaulas completas com professor especialista'
      },
      {
        tipo: 'texto' as const,
        nome: `Manual de ${disciplina}`,
        duracao: '200 páginas',
        descricao: 'Material didático atualizado com a legislação'
      },
      {
        tipo: 'exercicios' as const,
        nome: `1000 Questões de ${disciplina}`,
        duracao: '50h prática',
        descricao: 'Questões comentadas e organizadas por tópico'
      }
    ]

    if (prioridade === 'critica') {
      return [
        ...recursosBase,
        {
          tipo: 'simulados' as const,
          nome: `Simulados Intensivos de ${disciplina}`,
          duracao: '20h',
          descricao: 'Simulados semanais com correção detalhada'
        },
        {
          tipo: 'grupo' as const,
          nome: `Grupo de Estudos - ${disciplina}`,
          duracao: '2h/semana',
          descricao: 'Discussões e esclarecimento de dúvidas'
        }
      ]
    }

    return recursosBase
  }

  const gerarCronogramaSemanal = (disciplina: string, horasSemanais: number) => {
    const diasEstudo = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const horasPorDia = Math.ceil(horasSemanais / 6)
    
    return diasEstudo.map(dia => ({
      dia,
      atividades: [
        {
          horario: '06:00 - 07:00',
          atividade: `Teoria - ${disciplina}`,
          tipo: 'teoria' as const,
          duracao: 60
        },
        {
          horario: '19:00 - 20:00',
          atividade: `Exercícios - ${disciplina}`,
          tipo: 'pratica' as const,
          duracao: 60
        }
      ].slice(0, horasPorDia)
    }))
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 border-red-300 text-red-800'
      case 'alta': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'media': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'baixa': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getIconeRecurso = (tipo: string) => {
    switch (tipo) {
      case 'video': return <Video className="h-4 w-4" />
      case 'texto': return <FileText className="h-4 w-4" />
      case 'exercicios': return <PenTool className="h-4 w-4" />
      case 'simulados': return <Target className="h-4 w-4" />
      case 'grupo': return <Users className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Brain className="h-8 w-8" />
          🎯 Método de Estudo Personalizado
        </CardTitle>
        <p className="text-purple-100">
          Plano completo baseado na sua performance atual ({percentualGeral.toFixed(1)}%)
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        {!planoGerado ? (
          <div className="text-center space-y-6">
            {/* Análise Rápida */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">Performance Atual</h3>
                  <p className="text-2xl font-bold text-blue-600">{percentualGeral.toFixed(1)}%</p>
                  <p className="text-sm text-blue-700">{questoesCorretas}/{totalQuestoes} questões</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-4 text-center">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800">Tempo Gasto</h3>
                  <p className="text-2xl font-bold text-purple-600">{tempoTotal}</p>
                  <p className="text-sm text-purple-700">Tempo total</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4 text-center">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Meta</h3>
                  <p className="text-2xl font-bold text-green-600">80%+</p>
                  <p className="text-sm text-green-700">Aprovação esperada</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                O que o seu plano vai incluir:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Cronograma semanal detalhado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Métodos de estudo específicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Recursos recomendados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Prioridades por disciplina</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Técnicas de memorização</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Sistema de acompanhamento</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={gerarPlanoEstudo}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Brain className="mr-3 h-6 w-6" />
              🚀 Gerar Meu Plano de Estudo Personalizado
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="visao-geral" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
              <TabsTrigger value="recursos">Recursos</TabsTrigger>
              <TabsTrigger value="metodos">Métodos</TabsTrigger>
            </TabsList>

            <TabsContent value="visao-geral" className="space-y-6">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl border-2 border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-800">Seu Plano Foi Criado!</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Baseado na sua performance de {percentualGeral.toFixed(1)}%, criamos um plano personalizado 
                  focando nas áreas que mais precisam de atenção.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="font-semibold">Disciplinas Prioritárias</p>
                    <p className="text-2xl font-bold text-red-600">
                      {planoAtivo.filter(p => p.prioridade === 'critica' || p.prioridade === 'alta').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="font-semibold">Horas Semanais</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {planoAtivo.reduce((total, p) => total + p.horasSemanais, 0)}h
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold">Meta de Melhoria</p>
                    <p className="text-2xl font-bold text-green-600">+60%</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {planoAtivo.map((plano, index) => (
                  <Card key={`plano-${plano.disciplina}-${index}`} className={`border-l-4 ${
                    plano.prioridade === 'critica' ? 'border-l-red-500' :
                    plano.prioridade === 'alta' ? 'border-l-orange-500' :
                    plano.prioridade === 'media' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{plano.disciplina}</h3>
                        <Badge className={getPrioridadeColor(plano.prioridade)}>
                          {plano.prioridade.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Horas Semanais:</p>
                          <p className="text-lg font-bold">{plano.horasSemanais}h</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Métodos:</p>
                          <p className="text-lg font-bold">{plano.metodos.length} técnicas</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Recursos:</p>
                          <p className="text-lg font-bold">{plano.recursos.length} materiais</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cronograma" className="space-y-6">
              {planoAtivo.map((plano, index) => (
                <Card key={`cronograma-${plano.disciplina}-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {plano.disciplina} - {plano.horasSemanais}h/semana
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plano.cronogramaSemanal.map((dia, diaIndex) => (
                        <Card key={`dia-cronograma-${plano.disciplina}-${diaIndex}`} className="bg-blue-50">
                          <CardHeader className="pb-3">
                            <h4 className="font-semibold text-blue-800">{dia.dia}</h4>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {dia.atividades.map((atividade, atividadeIndex) => (
                              <div key={`atividade-${plano.disciplina}-${diaIndex}-${atividadeIndex}`} className="flex items-center gap-2 mb-2 p-2 bg-white rounded border">
                                <Timer className="h-4 w-4 text-blue-500" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{atividade.horario}</p>
                                  <p className="text-xs text-gray-600">{atividade.atividade}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {atividade.tipo}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recursos" className="space-y-6">
              {planoAtivo.map((plano, index) => (
                <Card key={`recursos-${plano.disciplina}-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recursos para {plano.disciplina}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {plano.recursos.map((recurso, recursoIndex) => (
                        <Card key={`recurso-${plano.disciplina}-${recursoIndex}`} className="bg-gray-50">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {getIconeRecurso(recurso.tipo)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{recurso.nome}</h4>
                                <p className="text-sm text-gray-600 mb-2">{recurso.descricao}</p>
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline">{recurso.duracao}</Badge>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Acessar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="metodos" className="space-y-6">
              {planoAtivo.map((plano, index) => (
                <Card key={`metodos-${plano.disciplina}-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Métodos para {plano.disciplina}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {plano.metodos.map((metodo, metodoIndex) => (
                        <div key={`metodo-${plano.disciplina}-${metodoIndex}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{metodo}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {planoGerado && (
          <div className="mt-8 text-center">
            <Button 
              onClick={onIniciarPlano}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
            >
              <PlayCircle className="mr-3 h-5 w-5" />
              🎯 Iniciar Plano de Estudos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
