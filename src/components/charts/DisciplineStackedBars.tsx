'use client'

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDisciplineStats } from "@/hooks/useDisciplines"
import { disciplines } from "@/lib/seed"
import { BarChart3 } from "lucide-react"

interface DisciplineStackedBarsProps {
  className?: string
}

export function DisciplineStackedBars({ className }: DisciplineStackedBarsProps) {
  const { data: stats = [] } = useDisciplineStats()
  
  const chartData = React.useMemo(() => {
    return stats
      .filter(stat => stat.totalHours > 0) // Apenas disciplinas com estudo
      .sort((a, b) => (b.totalHours || 0) - (a.totalHours || 0)) // Ordenar por horas
      .slice(0, 8) // Top 8
      .map(stat => {
        const discipline = disciplines.find(d => d.id === stat.id)
        return {
          name: discipline?.name.split(' ').slice(0, 2).join(' ') || 'Disciplina', // Nome abreviado
          fullName: discipline?.name || 'Disciplina',
          totalHours: stat.totalHours || 0,
          completedHours: stat.completedHours || 0,
          remainingHours: (stat.totalHours || 0) - (stat.completedHours || 0),
          progress: stat.progress || 0
        }
      })
  }, [stats])
  
  const totalHours = chartData.reduce((sum, item) => sum + item.totalHours, 0)
  const completedHours = chartData.reduce((sum, item) => sum + item.completedHours, 0)
  const overallProgress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição por Disciplina
          </CardTitle>
          <div className="text-right text-sm">
            <div className="text-2xl font-bold text-red-600">{overallProgress}%</div>
            <div className="text-muted-foreground">Progresso geral</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.fullName}</p>
                        <p className="text-green-600">
                          Concluído: {data.completedHours}h
                        </p>
                        <p className="text-gray-600">
                          Pendente: {data.remainingHours}h
                        </p>
                        <p className="text-red-600">
                          Total: {data.totalHours}h
                        </p>
                        <p className="text-purple-600">
                          Progresso: {data.progress}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar
                dataKey="completedHours"
                stackId="hours"
                fill="#10b981"
                name="Horas Concluídas"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="remainingHours"
                stackId="hours"
                fill="#d1d5db"
                name="Horas Pendentes"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{completedHours.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">Total Concluído</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">{(totalHours - completedHours).toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">Total Pendente</div>
          </div>
        </div>
        
        {chartData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum dado de estudo disponível</p>
            <p className="text-xs">Comece a estudar para ver seus gráficos!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
