'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScheduleStore } from "@/store/schedule"
import { format, startOfWeek, addDays, eachDayOfInterval, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeeklyHeatmapProps {
  className?: string
}

export function WeeklyHeatmap({ className }: WeeklyHeatmapProps) {
  const { blocks } = useScheduleStore()
  
  // Gerar dados para as últimas 12 semanas
  const heatmapData = React.useMemo(() => {
    const weeks = []
    const today = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(addDays(today, -i * 7), { locale: ptBR })
      const weekEnd = endOfWeek(weekStart, { locale: ptBR })
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
      
      const weekData = {
        weekStart: format(weekStart, 'dd/MM', { locale: ptBR }),
        days: weekDays.map(day => {
          const dayStr = format(day, 'yyyy-MM-dd')
          const dayBlocks = blocks.filter(block => block.date === dayStr)
          const completedBlocks = dayBlocks.filter(block => block.completed)
          
          const plannedMinutes = dayBlocks.reduce((sum, block) => {
            const start = new Date(`2000-01-01T${block.start}`)
            const end = new Date(`2000-01-01T${block.end}`)
            return sum + (end.getTime() - start.getTime()) / (1000 * 60)
          }, 0)
          
          const completedMinutes = completedBlocks.reduce((sum, block) => {
            const start = new Date(`2000-01-01T${block.start}`)
            const end = new Date(`2000-01-01T${block.end}`)
            return sum + (end.getTime() - start.getTime()) / (1000 * 60)
          }, 0)
          
          const intensity = plannedMinutes > 0 ? completedMinutes / plannedMinutes : 0
          
          return {
            date: dayStr,
            dayName: format(day, 'EEEEE', { locale: ptBR }), // Primeira letra
            plannedHours: Math.round(plannedMinutes / 60 * 10) / 10,
            completedHours: Math.round(completedMinutes / 60 * 10) / 10,
            intensity, // 0 a 1
            blocksCount: dayBlocks.length,
            completedCount: completedBlocks.length
          }
        })
      }
      
      weeks.push(weekData)
    }
    
    return weeks
  }, [blocks])
  
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 border-gray-200'
    if (intensity < 0.25) return 'bg-red-100 border-red-200'
    if (intensity < 0.5) return 'bg-red-200 border-red-300'
    if (intensity < 0.75) return 'bg-red-400 border-red-500'
    return 'bg-red-600 border-red-700'
  }
  
  const getIntensityLabel = (intensity: number) => {
    if (intensity === 0) return 'Nenhuma atividade'
    if (intensity < 0.25) return 'Baixa aderência'
    if (intensity < 0.5) return 'Aderência moderada'
    if (intensity < 0.75) return 'Boa aderência'
    return 'Excelente aderência'
  }
  
  const totalDays = heatmapData.reduce((sum, week) => sum + week.days.length, 0)
  const activeDays = heatmapData.reduce((sum, week) => 
    sum + week.days.filter(day => day.intensity > 0).length, 0
  )
  const averageIntensity = heatmapData.reduce((sum, week) => 
    sum + week.days.reduce((daySum, day) => daySum + day.intensity, 0), 0
  ) / totalDays

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mapa de Calor - Últimas 12 semanas
          </CardTitle>
          <div className="text-right text-sm">
            <div className="text-lg font-semibold text-red-600">
              {activeDays}/{totalDays}
            </div>
            <div className="text-muted-foreground">Dias ativos</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legenda dos dias da semana */}
        <div className="grid grid-cols-8 gap-1 text-xs text-center">
          <div></div> {/* Espaço para labels das semanas */}
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
            <div key={`day-header-${day}-${index}`} className="font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Heatmap */}
        <div className="space-y-1">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-8 gap-1">
              {/* Label da semana */}
              <div className="text-xs text-muted-foreground flex items-center">
                {week.weekStart}
              </div>
              
              {/* Dias da semana */}
              {week.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "w-6 h-6 rounded-sm border cursor-pointer transition-all hover:scale-110",
                    getIntensityColor(day.intensity)
                  )}
                  title={`${format(new Date(day.date), 'dd/MM/yyyy', { locale: ptBR })}\n${getIntensityLabel(day.intensity)}\nPlanejado: ${day.plannedHours}h\nCumprido: ${day.completedHours}h\nBlocos: ${day.completedCount}/${day.blocksCount}`}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Legenda de intensidade */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100 border-gray-200 border" />
              <div className="w-3 h-3 rounded-sm bg-red-100 border-red-200 border" />
              <div className="w-3 h-3 rounded-sm bg-red-200 border-red-300 border" />
              <div className="w-3 h-3 rounded-sm bg-red-400 border-red-500 border" />
              <div className="w-3 h-3 rounded-sm bg-red-600 border-red-700 border" />
            </div>
            <span className="text-muted-foreground">Mais</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Aderência média: {Math.round(averageIntensity * 100)}%
          </div>
        </div>
        
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">{activeDays}</div>
            <div className="text-xs text-muted-foreground">Dias Ativos</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {Math.round(averageIntensity * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Aderência Média</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">
              {Math.round((activeDays / totalDays) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Constância</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
