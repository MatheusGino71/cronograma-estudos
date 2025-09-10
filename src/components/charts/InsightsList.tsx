'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProgressStore } from "@/store/progress"
import { AlertTriangle, CheckCircle, Lightbulb, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InsightsListProps {
  className?: string
}

const insightIcons = {
  warning: AlertTriangle,
  achievement: CheckCircle,
  suggestion: Lightbulb
}

const insightColors = {
  warning: {
    icon: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    border: 'border-l-orange-500'
  },
  achievement: {
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800 border-green-200',
    border: 'border-l-green-500'
  },
  suggestion: {
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800 border-red-200',
    border: 'border-l-red-500'
  }
}

export function InsightsList({ className }: InsightsListProps) {
  const { insights, generateInsights } = useProgressStore()
  const [dismissedInsights, setDismissedInsights] = React.useState<Set<string>>(new Set())
  
  React.useEffect(() => {
    // Gerar insights automaticamente quando o componente é montado
    generateInsights()
  }, [generateInsights])
  
  const handleDismiss = (insightId: string) => {
    setDismissedInsights(prev => new Set(prev).add(insightId))
  }
  
  const visibleInsights = insights.filter(insight => !dismissedInsights.has(insight.id))
  
  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'warning':
        return 'Atenção'
      case 'achievement':
        return 'Conquista'
      case 'suggestion':
        return 'Dica'
      default:
        return 'Info'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights Personalizados
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
          >
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleInsights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum insight disponível no momento</p>
            <p className="text-xs">Continue estudando para receber recomendações personalizadas!</p>
          </div>
        ) : (
          visibleInsights.map((insight) => {
            const Icon = insightIcons[insight.type]
            const colors = insightColors[insight.type]
            
            return (
              <div
                key={insight.id}
                className={cn(
                  "relative p-4 rounded-lg border-l-4 bg-gray-50/50",
                  colors.border
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn("h-5 w-5 mt-0.5", colors.icon)} />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", colors.badge)}>
                        {getInsightTypeLabel(insight.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(insight.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                    </div>
                    
                    {insight.action && (
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    onClick={() => handleDismiss(insight.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
        
        {/* Insights estáticos para demonstração */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground">💡 Dicas Gerais</h4>
          
          <div className="grid gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <span>🍅</span>
              <span>Use a técnica Pomodoro: 25min focado + 5min pausa</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span>🔄</span>
              <span>Revise o conteúdo após 1, 3 e 7 dias para fixar melhor</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <span>📊</span>
              <span>Faça simulados regularmente para testar seu conhecimento</span>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <span>⏰</span>
              <span>Estude nos mesmos horários para criar uma rotina</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
