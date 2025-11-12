'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResultadoDisciplina } from "@/types/simulado"
import { 
  Lightbulb, 
  BookOpen, 
  Target, 
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface DicasEstudoProps {
  resultadosPorDisciplina: ResultadoDisciplina[]
  percentualGeral: number
}

interface DicaEstudo {
  titulo: string
  descricao: string
  tipo: 'urgente' | 'importante' | 'melhoria' | 'excelencia'
  icon: React.ComponentType<{ className?: string }>
}

export function DicasEstudo({ resultadosPorDisciplina, percentualGeral }: DicasEstudoProps) {
  const gerarDicas = (): DicaEstudo[] => {
    const dicas: DicaEstudo[] = []

    // Análise geral
    if (percentualGeral < 50) {
      dicas.push({
        titulo: "Revisar Metodologia de Estudo",
        descricao: "Considere reorganizar sua metodologia. Foque em compreensão antes de memorização, e pratique mais questões comentadas.",
        tipo: 'urgente',
        icon: AlertCircle
      })
    } else if (percentualGeral < 70) {
      dicas.push({
        titulo: "Intensificar Treinamento",
        descricao: "Seu desempenho está no caminho certo. Aumente a frequência de simulados e foque nas disciplinas com menor rendimento.",
        tipo: 'importante', 
        icon: Target
      })
    } else {
      dicas.push({
        titulo: "Manter Consistência",
        descricao: "Excelente desempenho! Mantenha a rotina de estudos e foque em revisões espaçadas para consolidar o conhecimento.",
        tipo: 'excelencia',
        icon: TrendingUp
      })
    }

    // Análise por disciplina
    const disciplinasFragas = resultadosPorDisciplina.filter(d => d.percentual < 60)
    const disciplinasMedias = resultadosPorDisciplina.filter(d => d.percentual >= 60 && d.percentual < 80)
    const disciplinasBoas = resultadosPorDisciplina.filter(d => d.percentual >= 80)

    if (disciplinasFragas.length > 0) {
      const piorDisciplina = disciplinasFragas.reduce((prev, curr) => 
        prev.percentual < curr.percentual ? prev : curr
      )
      
      dicas.push({
        titulo: `Priorizar ${piorDisciplina.disciplina}`,
        descricao: `Esta disciplina teve o menor aproveitamento (${piorDisciplina.percentual.toFixed(1)}%). Dedique pelo menos 40% do seu tempo de estudo a ela nas próximas semanas.`,
        tipo: 'urgente',
        icon: AlertCircle
      })
    }

    if (disciplinasMedias.length > 0) {
      dicas.push({
        titulo: "Fortalecer Disciplinas Médias",
        descricao: `${disciplinasMedias.length} disciplina(s) estão em nível intermediário. Com foco específico, podem facilmente chegar ao nível de excelência.`,
        tipo: 'importante',
        icon: BookOpen
      })
    }

    if (disciplinasBoas.length > 0) {
      dicas.push({
        titulo: "Manter Disciplinas Fortes",
        descricao: `${disciplinasBoas.length} disciplina(s) estão com excelente aproveitamento. Mantenha com revisões periódicas e questões avançadas.`,
        tipo: 'melhoria',
        icon: TrendingUp
      })
    }

    // Dicas específicas de metodologia
    const tempoMedioResposta = calcularTempoMedioResposta()
    
    if (tempoMedioResposta > 180) { // mais de 3 minutos por questão
      dicas.push({
        titulo: "Otimizar Tempo de Resposta",
        descricao: "Você está gastando muito tempo por questão. Pratique técnicas de resolução rápida e marque questões para revisão posterior.",
        tipo: 'importante',
        icon: Clock
      })
    } else if (tempoMedioResposta < 60) { // menos de 1 minuto por questão
      dicas.push({
        titulo: "Ler com Mais Atenção",
        descricao: "Você está muito rápido nas respostas. Isso pode indicar leitura superficial. Reserve tempo para análise cuidadosa de cada questão.",
        tipo: 'importante',
        icon: BookOpen
      })
    }

    return dicas
  }

  const calcularTempoMedioResposta = (): number => {
    // Cálculo baseado nos resultados por disciplina
    // Retorna 0 até que tenhamos dados reais de tempo
    return 0
  }

  const dicas = gerarDicas()

  const getCardStyle = (tipo: DicaEstudo['tipo']) => {
    switch (tipo) {
      case 'urgente':
        return 'border-l-4 border-l-red-500 bg-red-50'
      case 'importante':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50'
      case 'melhoria':
        return 'border-l-4 border-l-blue-500 bg-blue-50'
      case 'excelencia':
        return 'border-l-4 border-l-green-500 bg-green-50'
    }
  }

  const getBadgeStyle = (tipo: DicaEstudo['tipo']) => {
    switch (tipo) {
      case 'urgente':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'importante':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'melhoria':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'excelencia':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Dicas Personalizadas de Estudo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dicas.map((dica, index) => (
            <Card key={`dica-${dica.titulo}-${index}`} className={getCardStyle(dica.tipo)}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <dica.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{dica.titulo}</h3>
                      <Badge variant="outline" className={getBadgeStyle(dica.tipo)}>
                        {dica.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{dica.descricao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recursos Adicionais */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Recursos Recomendados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              📚 Simulados por Disciplina
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              📝 Questões Comentadas
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              🎯 Plano de Estudo Personalizado
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              📊 Relatório de Evolução
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
