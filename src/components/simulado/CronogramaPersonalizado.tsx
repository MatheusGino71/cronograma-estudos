'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResultadoDisciplina } from "@/types/simulado"
import { PreviewSemanal } from "@/components/simulado/PreviewSemanal"
import { Calendar, Clock, Target, BookOpen, CheckCircle2, AlertTriangle, Award } from "lucide-react"

interface CronogramaPersonalizadoProps {
  resultadosPorDisciplina: ResultadoDisciplina[]
  onSalvarCronograma: () => void
  cronogramaGerado: boolean
}

interface ItemCronograma {
  disciplina: string
  prioridade: 'alta' | 'media' | 'baixa'
  horasSemanais: number
  diasPorSemana: number
  percentualAtual: number
  metaPercentual: number
  topicos: string[]
  cor: string
}

export function CronogramaPersonalizado({ 
  resultadosPorDisciplina, 
  onSalvarCronograma,
  cronogramaGerado 
}: CronogramaPersonalizadoProps) {
  
  const gerarItensCronograma = (): ItemCronograma[] => {
    return resultadosPorDisciplina.map(disciplina => {
      let prioridade: 'alta' | 'media' | 'baixa' = 'baixa'
      let horasSemanais = 3
      let diasPorSemana = 2
      let cor = 'bg-green-100 border-green-200'
      
      if (disciplina.percentual < 60) {
        prioridade = 'alta'
        horasSemanais = 12
        diasPorSemana = 5
        cor = 'bg-red-100 border-red-200'
      } else if (disciplina.percentual < 80) {
        prioridade = 'media'
        horasSemanais = 6
        diasPorSemana = 3
        cor = 'bg-yellow-100 border-yellow-200'
      }

      const metaPercentual = Math.min(disciplina.percentual + 20, 95)
      
      const topicos = gerarTopicosEstudo(disciplina.disciplina, prioridade)

      return {
        disciplina: disciplina.disciplina,
        prioridade,
        horasSemanais,
        diasPorSemana,
        percentualAtual: disciplina.percentual,
        metaPercentual,
        topicos,
        cor
      }
    }).sort((a, b) => {
      const prioridadeOrdem = { 'alta': 0, 'media': 1, 'baixa': 2 }
      return prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
    })
  }

  const gerarTopicosEstudo = (disciplina: string, prioridade: 'alta' | 'media' | 'baixa'): string[] => {
    const topicosBase: Record<string, string[]> = {
      'Português': ['Interpretação de Texto', 'Gramática', 'Redação', 'Literatura'],
      'Matemática': ['Álgebra', 'Geometria', 'Estatística', 'Funções'],
      'História': ['História do Brasil', 'História Geral', 'Atualidades', 'Cronologia'],
      'Geografia': ['Geografia Física', 'Geografia Humana', 'Geopolítica', 'Cartografia'],
      'Física': ['Mecânica', 'Termodinâmica', 'Eletromagnetismo', 'Óptica'],
      'Química': ['Química Orgânica', 'Química Inorgânica', 'Físico-Química', 'Estequiometria'],
      'Biologia': ['Citologia', 'Genética', 'Ecologia', 'Evolução'],
      'Filosofia': ['Ética', 'Lógica', 'Filosofia Política', 'Metafísica'],
      'Sociologia': ['Teorias Sociológicas', 'Movimentos Sociais', 'Globalização', 'Cultura'],
      'Inglês': ['Reading', 'Grammar', 'Vocabulary', 'Text Interpretation'],
      'Espanhol': ['Lectura', 'Gramática', 'Vocabulario', 'Interpretación']
    }

    const topicos = topicosBase[disciplina] || ['Conceitos Básicos', 'Exercícios', 'Teoria', 'Prática']
    
    // Retorna mais tópicos para prioridades mais altas
    switch (prioridade) {
      case 'alta': return topicos
      case 'media': return topicos.slice(0, 3)
      case 'baixa': return topicos.slice(0, 2)
    }
  }

  const itensCronograma = gerarItensCronograma()
  const totalHoras = itensCronograma.reduce((acc, item) => acc + item.horasSemanais, 0)

  const getPrioridadeBadge = (prioridade: 'alta' | 'media' | 'baixa') => {
    const config = {
      'alta': { label: 'Prioridade Alta', className: 'bg-red-100 text-red-800 border-red-200' },
      'media': { label: 'Prioridade Média', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'baixa': { label: 'Prioridade Baixa', className: 'bg-green-100 text-green-800 border-green-200' }
    }
    return config[prioridade]
  }

  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-6 w-6" />
          🎯 Seu Cronograma Personalizado de Estudos
        </CardTitle>
        <p className="text-blue-100">
          📊 Baseado no seu desempenho no simulado - Plano inteligente de 3 semanas para maximizar seus resultados
        </p>
      </CardHeader>
      <CardContent>
        {/* Alerta Especial para Baixo Desempenho */}
        {itensCronograma.filter(i => i.prioridade === 'alta').length >= 3 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-bold text-red-800">⚠️ Atenção: Cronograma Intensivo Recomendado!</h4>
                <p className="text-red-700 text-sm mt-1">
                  Seu desempenho indica necessidade de foco especial. Este cronograma foi otimizado para recuperação rápida nas áreas críticas.
                  <strong> Siga rigorosamente por 3 semanas para ver melhorias significativas!</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resumo Geral - Mais Impactante */}
        <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 shadow-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🚀 Seu Plano de Ação Personalizado</h3>
            <p className="text-gray-600">Baseado na análise do seu desempenho, este cronograma foi criado especificamente para você!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800 text-lg">Dedicação Total</span>
              </div>
              <span className="text-3xl font-extrabold text-blue-900">{totalHoras}h</span>
              <p className="text-sm text-blue-700 mt-1">por semana</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800 text-lg">Disciplinas</span>
              </div>
              <span className="text-3xl font-extrabold text-green-900">{itensCronograma.length}</span>
              <p className="text-sm text-green-700 mt-1">para estudar</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-bold text-red-800 text-lg">Prioridade Alta</span>
              </div>
              <span className="text-3xl font-extrabold text-red-900">
                {itensCronograma.filter(i => i.prioridade === 'alta').length}
              </span>
              <p className="text-sm text-red-700 mt-1">áreas críticas</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-center text-yellow-800 font-medium">
              💡 <strong>Dica:</strong> Foque {Math.round((itensCronograma.filter(i => i.prioridade === 'alta').length / itensCronograma.length) * 100)}% do seu tempo nas disciplinas de prioridade alta para maximizar seus resultados!
            </p>
          </div>
        </div>

        {/* Lista de Disciplinas */}
        <div className="space-y-4">
          {itensCronograma.map((item, index) => (
            <Card key={`cronograma-item-${item.disciplina}-${index}`} className={`${item.cor} border`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{item.disciplina}</h3>
                      <Badge variant="outline" className={getPrioridadeBadge(item.prioridade).className}>
                        {getPrioridadeBadge(item.prioridade).label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          <strong>{item.horasSemanais}h/semana</strong> ({item.diasPorSemana} dias)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span className="text-sm">
                          Meta: <strong>{item.metaPercentual}%</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm">
                          Atual: <strong>{item.percentualAtual.toFixed(1)}%</strong>
                        </span>
                      </div>
                    </div>

                    {/* Progresso Atual vs Meta */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso para a Meta</span>
                        <span>{item.percentualAtual.toFixed(1)}% / {item.metaPercentual}%</span>
                      </div>
                      <Progress 
                        value={(item.percentualAtual / item.metaPercentual) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Tópicos de Estudo */}
                    <div>
                      <span className="text-sm font-medium">Focar em:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.topicos.map((topico, idx) => (
                          <Badge key={`topico-${item.disciplina}-${idx}-${topico}`} variant="secondary" className="text-xs">
                            {topico}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cronograma das 3 Semanas */}
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Distribuição das 3 Semanas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Semana 1: Foco Intensivo
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Concentração total nas disciplinas de prioridade alta
                </p>
                <ul className="text-xs space-y-1">
                  {itensCronograma
                    .filter(i => i.prioridade === 'alta')
                    .map((item, idx) => (
                      <li key={`alta-${item.disciplina}-${idx}`} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        {item.disciplina}: {item.horasSemanais}h
                      </li>
                    ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Semana 2: Balanceamento
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Equilibrio entre áreas fracas e consolidação
                </p>
                <ul className="text-xs space-y-1">
                  {itensCronograma
                    .filter(i => i.prioridade === 'media')
                    .map((item, idx) => (
                      <li key={`media-${item.disciplina}-${idx}`} className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-yellow-500" />
                        {item.disciplina}: {item.horasSemanais}h
                      </li>
                    ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Semana 3: Revisão Geral
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Revisão espaçada e simulados finais
                </p>
                <ul className="text-xs space-y-1">
                  {itensCronograma
                    .filter(i => i.prioridade === 'baixa')
                    .map((item, idx) => (
                      <li key={`baixa-${item.disciplina}-${idx}`} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {item.disciplina}: {item.horasSemanais}h
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview da Primeira Semana */}
        <PreviewSemanal resultadosPorDisciplina={resultadosPorDisciplina} />

        {/* Botão para Salvar - Mais Destacado */}
        <div className="mt-8 text-center">
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">🎯 Pronto para Começar?</h4>
            <p className="text-green-700 text-sm">
              Clique abaixo para salvar este cronograma personalizado no seu sistema e começar sua jornada de estudos otimizada!
            </p>
          </div>
          
          <Button 
            onClick={onSalvarCronograma}
            disabled={cronogramaGerado}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {cronogramaGerado ? (
              <>
                <CheckCircle2 className="mr-3 h-5 w-5" />
                ✅ Cronograma Salvo com Sucesso!
              </>
            ) : (
              <>
                <Calendar className="mr-3 h-5 w-5" />
                🚀 Salvar Meu Cronograma Personalizado
              </>
            )}
          </Button>
        </div>

        {cronogramaGerado && (
          <div className="mt-6 p-5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl shadow-md">
            <div className="flex items-center gap-3 text-green-800 mb-3">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-bold text-lg">🎉 Perfeito! Seu cronograma está pronto!</span>
            </div>
            <p className="text-green-700 mb-3">
              Seu cronograma personalizado foi salvo com sucesso! Agora você pode acompanhar seu progresso e seguir o plano otimizado.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => window.location.href = '/cronograma'} className="border-green-500 text-green-700 hover:bg-green-50">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Meu Cronograma
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/progresso'} className="border-blue-500 text-blue-700 hover:bg-blue-50">
                <Target className="h-4 w-4 mr-2" />
                Acompanhar Progresso
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
