'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResultadoSimulado, ResultadoDisciplina } from "@/types/simulado"
import { StudyBlock } from "@/types"
import { DicasEstudo } from "@/components/simulado/DicasEstudo"
import { CronogramaPersonalizado } from "@/components/simulado/CronogramaPersonalizado"
import { useScheduleStore } from "@/store/schedule"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Trophy, 
  TrendingDown, 
  Clock, 
  BookOpen, 
  Calendar,
  CheckCircle, 
  XCircle, 
  Target,
  AlertTriangle
} from "lucide-react"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  mapearDisciplinaSimulado, 
  calcularPrioridade, 
  calcularHorasRecomendadas, 
  gerarTopicosEstudo 
} from "@/lib/simulado-cronograma"

interface ResultadoSimuladoProps {
  resultado: ResultadoSimulado
  onVoltarConfigurador: () => void
}

interface CronogramaItem {
  disciplina: string
  prioridade: 'alta' | 'media' | 'baixa'
  percentual: number
  horasRecomendadas: number
  topicos: string[]
}

export function ResultadoSimuladoComponent({ resultado, onVoltarConfigurador }: ResultadoSimuladoProps) {
  const { user } = useAuth()
  const addBlock = useScheduleStore((state) => state.add)
  const [cronogramaGerado, setCronogramaGerado] = React.useState(false)

  // Analisar áreas fracas e gerar cronograma
  const analisarAreasFragas = (): CronogramaItem[] => {
    return resultado.resultadosPorDisciplina
      .map(disciplina => {
        const prioridade = calcularPrioridade(disciplina.percentual)
        const horasRecomendadas = calcularHorasRecomendadas(prioridade)
        
        return {
          disciplina: disciplina.disciplina,
          prioridade,
          percentual: disciplina.percentual,
          horasRecomendadas,
          topicos: gerarTopicosEstudo(disciplina.disciplina, disciplina.percentual)
        }
      })
      .filter(item => item.prioridade !== 'baixa') // Focar apenas nas áreas que precisam melhorar
      .sort((a, b) => a.percentual - b.percentual) // Ordenar pelas piores notas
  }

  const gerarCronograma = () => {
    if (!user) {
      alert('Faça login para gerar cronograma personalizado')
      return
    }

    const areasFragas = analisarAreasFragas()
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() + 1) // Começar amanhã

    let diaAtual = 0

    areasFragas.forEach((area, index) => {
      const diasPorSemana = area.prioridade === 'alta' ? 5 : area.prioridade === 'media' ? 3 : 2
      const sessoesPorDia = area.prioridade === 'alta' ? 2 : 1

      // Gerar blocos de estudo para os próximos 15 dias
      for (let semana = 0; semana < 3; semana++) {
        for (let dia = 0; dia < diasPorSemana; dia++) {
          const dataBloco = addDays(dataInicio, diaAtual + dia + (semana * 7))
          
          for (let sessao = 0; sessao < sessoesPorDia; sessao++) {
            const horaInicio = sessao === 0 ? '19:00' : '20:30'
            const horaFim = sessao === 0 ? '20:15' : '21:45'
            
            const bloco: StudyBlock = {
              id: `simulado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              disciplineId: mapearDisciplinaSimulado(area.disciplina),
              title: `${area.disciplina} - Revisão Simulado (${area.percentual.toFixed(1)}%)`,
              date: format(dataBloco, 'yyyy-MM-dd'),
              start: horaInicio,
              end: horaFim,
              type: 'Estudo',
              pomodoros: area.prioridade === 'alta' ? 3 : 2,
              completed: false,
              userId: user.id
            }

            addBlock(bloco, user.id)
          }
        }
      }

      // Adicionar revisões espaçadas (3 e 7 dias depois)
      for (let revisao = 0; revisao < 2; revisao++) {
        const diasRevisao = revisao === 0 ? 3 : 7
        const dataRevisao = addDays(dataInicio, diaAtual + diasRevisao)
        
        const blocoRevisao: StudyBlock = {
          id: `revisao-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          disciplineId: mapearDisciplinaSimulado(area.disciplina),
          title: `${area.disciplina} - Revisão Espaçada`,
          date: format(dataRevisao, 'yyyy-MM-dd'),
          start: '18:00',
          end: '18:45',
          type: 'Revisão',
          pomodoros: 1,
          completed: false,
          userId: user.id
        }

        addBlock(blocoRevisao, user.id)
      }

      diaAtual += 2 // Espaçar disciplinas
    })

    setCronogramaGerado(true)
  }

  const areasFragas = analisarAreasFragas()
  const tempoFormatado = Math.floor(resultado.tempoTotal / 60) + 'min ' + (resultado.tempoTotal % 60) + 's'

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Resumo Executivo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Resultado do Simulado - 1ª Fase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{resultado.acertos}</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{resultado.totalQuestoes}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {((resultado.acertos / resultado.totalQuestoes) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Percentual</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{tempoFormatado}</div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
          </div>
          
          {/* Resumo de Áreas que Precisam de Atenção */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" />
              Áreas que Precisam de Atenção Especial
            </h3>
            <div className="flex flex-wrap gap-2">
              {areasFragas.filter(area => area.prioridade === 'alta').map((area, index) => (
                <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                  {area.disciplina} ({area.percentual.toFixed(1)}%)
                </Badge>
              ))}
              {areasFragas.filter(area => area.prioridade === 'alta').length === 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Parabéns! Nenhuma área crítica identificada
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Header do Resultado */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Resultado do Simulado
            </CardTitle>
            <Badge variant={resultado.percentualGeral >= 70 ? "default" : "destructive"}>
              {resultado.percentualGeral.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{resultado.acertos}</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{resultado.erros}</div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{resultado.totalQuestoes}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tempoFormatado}</div>
              <div className="text-sm text-muted-foreground">Tempo</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Aproveitamento Geral</span>
              <span className="text-sm text-muted-foreground">{resultado.percentualGeral.toFixed(1)}%</span>
            </div>
            <Progress value={resultado.percentualGeral} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Resultado por Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Desempenho por Disciplina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resultado.resultadosPorDisciplina.map((disciplina) => (
              <div key={disciplina.disciplina} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {disciplina.percentual >= 70 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : disciplina.percentual >= 50 ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{disciplina.disciplina}</div>
                    <div className="text-sm text-muted-foreground">
                      {disciplina.acertos}/{disciplina.total} questões
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{disciplina.percentual.toFixed(1)}%</div>
                  <Progress value={disciplina.percentual} className="w-20 h-2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Áreas Fracas */}
      {areasFragas.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Áreas que Precisam de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areasFragas.map((area) => (
                <div key={area.disciplina} className="p-4 border rounded-lg bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-red-900">{area.disciplina}</h3>
                    <Badge variant={area.prioridade === 'alta' ? 'destructive' : 'secondary'}>
                      Prioridade {area.prioridade}
                    </Badge>
                  </div>
                  <div className="text-sm text-red-700 mb-2">
                    Aproveitamento: {area.percentual.toFixed(1)}% - Recomendado: {area.horasRecomendadas}h/semana
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.topicos.map((topico) => (
                      <Badge key={topico} variant="outline" className="text-xs">
                        {topico}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geração de Cronograma */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Cronograma Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!cronogramaGerado ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Com base no seu desempenho, podemos gerar um cronograma de estudos personalizado
                focando nas disciplinas que você mais precisa melhorar.
              </p>
              {areasFragas.length > 0 ? (
                <Button onClick={gerarCronograma} className="bg-green-600 hover:bg-green-700">
                  <Target className="h-4 w-4 mr-2" />
                  Gerar Cronograma Personalizado
                </Button>
              ) : (
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-600">Parabéns! Excelente desempenho!</p>
                  <p className="text-sm text-muted-foreground">
                    Todas as disciplinas tiveram bom aproveitamento. Continue com a revisão regular.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-green-600">Cronograma Gerado com Sucesso!</h3>
                <p className="text-sm text-muted-foreground">
                  Foram adicionados blocos de estudo personalizados ao seu cronograma com foco nas áreas que precisam melhorar.
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/cronograma'}>
                <Calendar className="h-4 w-4 mr-2" />
                Ver Cronograma
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      {/* Cronograma Personalizado */}
      <CronogramaPersonalizado
        resultadosPorDisciplina={resultado.resultadosPorDisciplina}
        onSalvarCronograma={gerarCronograma}
        cronogramaGerado={cronogramaGerado}
      />

      {/* Dicas Personalizadas */}
      <DicasEstudo 
        resultadosPorDisciplina={resultado.resultadosPorDisciplina}
        percentualGeral={(resultado.acertos / resultado.totalQuestoes) * 100}
      />

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onVoltarConfigurador}>
          Fazer Novo Simulado
        </Button>
        <Button onClick={() => window.location.href = '/progresso'}>
          Ver Progresso Detalhado
        </Button>
      </div>
    </div>
  )
}
