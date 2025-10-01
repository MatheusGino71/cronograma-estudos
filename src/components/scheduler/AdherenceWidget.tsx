'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAdherence, useWeeklyStats, useStudyStreak } from "@/hooks/useSchedule"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Target, Flame, Clock, BookOpen } from "lucide-react"

interface AdherenceWidgetProps {
  className?: string
}

export function AdherenceWidget({ className }: AdherenceWidgetProps) {
  const { totalBlocks, completedBlocks, adherence } = useAdherence()
  const { plannedHours, completedHours, plannedBlocks, completedBlocks: weeklyCompleted } = useWeeklyStats()
  const streak = useStudyStreak()
  
  // Dados para o gráfico de barras (últimos 7 dias)
  const weeklyData = React.useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Mock data - seria calculado com dados reais
      const planned = Math.floor(Math.random() * 4) + 1
      const completed = Math.floor(Math.random() * planned)
      
      data.push({
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        planned,
        completed,
        date: dateStr
      })
    }
    return data
  }, [])
  
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getAdherenceBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default' as const
    if (percentage >= 60) return 'secondary' as const
    return 'destructive' as const
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Aderência Geral */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Aderência Geral
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className={getAdherenceColor(adherence)}>{adherence}%</span>
              {adherence >= 75 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <Progress value={adherence} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedBlocks} de {totalBlocks} blocos concluídos
            </p>
            <Badge variant={getAdherenceBadgeVariant(adherence)} className="text-xs">
              {adherence >= 80 ? 'Excelente' : adherence >= 60 ? 'Bom' : 'Precisa melhorar'}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Horas Semanais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Horas Semanais
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {completedHours}h <span className="text-sm font-normal text-muted-foreground">/ {plannedHours}h</span>
            </div>
            <Progress value={(completedHours / plannedHours) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {weeklyCompleted} de {plannedBlocks} sessões concluídas
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Sequência de Estudos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sequência
          </CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold flex items-center gap-1">
              {streak} 
              <span className="text-lg">🔥</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {streak === 0 ? 'Inicie sua sequência hoje!' : 
               streak === 1 ? 'Dia consecutivo' : 
               'Dias consecutivos'}
            </p>
            {streak >= 7 && (
              <Badge variant="default" className="text-xs">
                Sequência incrível! 🎉
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Gráfico Semanal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Últimos 7 dias
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <Bar 
                  dataKey="completed" 
                  fill="#dc2626" 
                  radius={[2, 2, 0, 0]}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completed === entry.planned ? '#10b981' : '#dc2626'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Planejado vs Realizado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
