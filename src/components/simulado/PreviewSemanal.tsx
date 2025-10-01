'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResultadoDisciplina } from "@/types/simulado"
import { Calendar, Clock, ChevronRight } from "lucide-react"

interface PreviewSemanalProps {
  resultadosPorDisciplina: ResultadoDisciplina[]
}

interface SessaoEstudo {
  horario: string
  disciplina: string
  topico: string
  duracao: string
  prioridade: 'alta' | 'media' | 'baixa'
}

interface DiaSemana {
  dia: string
  sessoes: SessaoEstudo[]
}

export function PreviewSemanal({ resultadosPorDisciplina }: PreviewSemanalProps) {
  
  const gerarCronogramaSemanal = (): DiaSemana[] => {
    const diasSemana = [
      { dia: 'Segunda', sessoes: [] as SessaoEstudo[] },
      { dia: 'Terça', sessoes: [] as SessaoEstudo[] },
      { dia: 'Quarta', sessoes: [] as SessaoEstudo[] },
      { dia: 'Quinta', sessoes: [] as SessaoEstudo[] },
      { dia: 'Sexta', sessoes: [] as SessaoEstudo[] },
      { dia: 'Sábado', sessoes: [] as SessaoEstudo[] },
      { dia: 'Domingo', sessoes: [] as SessaoEstudo[] }
    ]

    // Disciplinas por prioridade
    const disciplinasAlta = resultadosPorDisciplina.filter(d => d.percentual < 60)
    const disciplinasMedia = resultadosPorDisciplina.filter(d => d.percentual >= 60 && d.percentual < 80)
    const disciplinasBaixa = resultadosPorDisciplina.filter(d => d.percentual >= 80)

    // Horários disponíveis
    const horariosMananha = ['08:00-09:00', '09:00-10:00']
    const horariosNoite = ['19:00-20:00', '20:00-21:00', '21:00-22:00']

    let indexDisciplinaAlta = 0
    let indexDisciplinaMedia = 0
    let indexDisciplinaBaixa = 0

    // Preencher segunda a sexta (dias úteis)
    for (let diaIndex = 0; diaIndex < 5; diaIndex++) {
      const dia = diasSemana[diaIndex]
      
      // Prioridade alta - 2 sessões por dia
      if (disciplinasAlta.length > 0) {
        const disciplina = disciplinasAlta[indexDisciplinaAlta % disciplinasAlta.length]
        
        // Sessão da manhã (sábado)
        if (diaIndex === 5) {
          dia.sessoes.push({
            horario: horariosMananha[0],
            disciplina: disciplina.disciplina,
            topico: 'Teoria e Conceitos',
            duracao: '1h',
            prioridade: 'alta'
          })
        }
        
        // Sessões da noite
        dia.sessoes.push({
          horario: horariosNoite[0],
          disciplina: disciplina.disciplina,
          topico: 'Exercícios Práticos',
          duracao: '1h',
          prioridade: 'alta'
        })
        
        dia.sessoes.push({
          horario: horariosNoite[1],
          disciplina: disciplina.disciplina,
          topico: 'Questões Comentadas',
          duracao: '1h',
          prioridade: 'alta'
        })
        
        indexDisciplinaAlta++
      }
      
      // Prioridade média - 1 sessão por dia (3 dias por semana)
      if (disciplinasMedia.length > 0 && diaIndex % 2 === 0) {
        const disciplina = disciplinasMedia[indexDisciplinaMedia % disciplinasMedia.length]
        
        dia.sessoes.push({
          horario: horariosNoite[2],
          disciplina: disciplina.disciplina,
          topico: 'Revisão e Exercícios',
          duracao: '1h',
          prioridade: 'media'
        })
        
        indexDisciplinaMedia++
      }
    }

    // Sábado - Disciplinas baixa prioridade e revisão
    if (disciplinasBaixa.length > 0) {
      const disciplina = disciplinasBaixa[indexDisciplinaBaixa % disciplinasBaixa.length]
      
      diasSemana[5].sessoes.push({
        horario: horariosMananha[1],
        disciplina: disciplina.disciplina,
        topico: 'Revisão Espaçada',
        duracao: '1h',
        prioridade: 'baixa'
      })
    }

    // Domingo - Simulado e revisão geral
    diasSemana[6].sessoes.push({
      horario: '14:00-17:00',
      disciplina: 'Simulado Geral',
      topico: 'Teste de Conhecimentos',
      duracao: '3h',
      prioridade: 'alta'
    })

    return diasSemana
  }

  const cronograma = gerarCronogramaSemanal()

  const getPrioridadeColor = (prioridade: 'alta' | 'media' | 'baixa') => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getDuracaoTotal = () => {
    return cronograma.reduce((total, dia) => {
      return total + dia.sessoes.reduce((diarioTotal, sessao) => {
        const horas = parseInt(sessao.duracao.replace('h', ''))
        return diarioTotal + horas
      }, 0)
    }, 0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Preview da Primeira Semana
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cronograma detalhado baseado nas suas áreas de melhoria - Total: {getDuracaoTotal()}h semanais
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cronograma.map((dia, index) => (
            <Card key={`dia-${dia.dia}-${index}`} className={`${dia.sessoes.length > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{dia.dia}</span>
                  <Badge variant="outline" className="text-xs">
                    {dia.sessoes.length === 0 ? 'Descanso' : `${dia.sessoes.length} sessões`}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {dia.sessoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Dia de descanso ou atividades livres
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dia.sessoes.map((sessao, sessaoIndex) => (
                      <div key={`sessao-${dia.dia}-${sessaoIndex}-${sessao.disciplina}`} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-2 text-sm font-medium min-w-0 flex-1">
                          <Clock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          <span className="text-blue-600 font-mono text-xs">
                            {sessao.horario}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{sessao.disciplina}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPrioridadeColor(sessao.prioridade)}`}
                            >
                              {sessao.prioridade}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{sessao.topico}</p>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Legenda */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold mb-3 text-sm">Legenda de Prioridades:</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded border border-red-300"></div>
              <span>Alta: &lt;60% (foco intensivo)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 rounded border border-yellow-300"></div>
              <span>Média: 60-79% (melhoria)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded border border-green-300"></div>
              <span>Baixa: ≥80% (manutenção)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
