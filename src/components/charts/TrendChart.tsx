'use client'

import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useScheduleStore } from "@/store/schedule"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TrendingUp } from "lucide-react"

interface TrendChartProps {
  className?: string
}

export function TrendChart({ className }: TrendChartProps) {
  const { blocks } = useScheduleStore()
  
  const chartData = React.useMemo(() => {
    const today = new Date()
    const thirtyDaysAgo = subDays(today, 29) // Últimos 30 dias
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today })
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayBlocks = blocks.filter(block => block.date === dayStr)
      const completedBlocks = dayBlocks.filter(block => block.completed)
      
      // Calcular horas planejadas e cumpridas
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
      
      return {
        date: format(day, 'dd/MM', { locale: ptBR }),
        fullDate: dayStr,
        plannedHours: Math.round(plannedMinutes / 60 * 10) / 10,
        completedHours: Math.round(completedMinutes / 60 * 10) / 10,
        adherence: plannedMinutes > 0 ? Math.round((completedMinutes / plannedMinutes) * 100) : 0
      }
    })
  }, [blocks])
  
  const totalPlanned = chartData.reduce((sum, day) => sum + day.plannedHours, 0)
  const totalCompleted = chartData.reduce((sum, day) => sum + day.completedHours, 0)
  const overallAdherence = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução das Horas de Estudo
          </CardTitle>
          <div className="text-right text-sm">
            <div className="text-2xl font-bold text-red-600">{overallAdherence}%</div>
            <div className="text-muted-foreground">Aderência geral</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-red-600">
                          Planejado: {data.plannedHours}h
                        </p>
                        <p className="text-green-600">
                          Cumprido: {data.completedHours}h
                        </p>
                        <p className="text-purple-600">
                          Aderência: {data.adherence}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="plannedHours"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Horas Planejadas"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="completedHours"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Horas Cumpridas"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-semibold text-red-600">{totalPlanned.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">Total Planejado</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">{totalCompleted.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">Total Cumprido</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">{(totalPlanned - totalCompleted).toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">Diferença</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
