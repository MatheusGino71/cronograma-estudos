'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProgressStore } from "@/store/progress"
import { TrendingUp, TrendingDown, Target, Clock, BookOpen, RotateCcw } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function KpiCard({ title, value, subtitle, icon, trend, trendValue }: KpiCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiGrid() {
  const { getKPIs } = useProgressStore()
  const kpis = getKPIs()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Horas Semanais"
        value={`${kpis.weeklyHours}h`}
        subtitle="Esta semana"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        trend={kpis.weeklyHours > 20 ? 'up' : kpis.weeklyHours < 10 ? 'down' : 'neutral'}
        trendValue={kpis.weeklyHours > 20 ? '+15% vs semana passada' : undefined}
      />
      
      <KpiCard
        title="Horas Mensais"
        value={`${kpis.monthlyHours}h`}
        subtitle="Últimos 30 dias"
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        trend={kpis.monthlyHours > 80 ? 'up' : 'neutral'}
        trendValue={kpis.monthlyHours > 80 ? 'Meta atingida!' : undefined}
      />
      
      <KpiCard
        title="Aderência"
        value={`${kpis.adherencePercentage}%`}
        subtitle="Taxa de cumprimento"
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
        trend={kpis.adherencePercentage >= 80 ? 'up' : kpis.adherencePercentage < 60 ? 'down' : 'neutral'}
        trendValue={
          kpis.adherencePercentage >= 80 ? 'Excelente!' : 
          kpis.adherencePercentage < 60 ? 'Precisa melhorar' : 
          'Bom desempenho'
        }
      />
      
      <KpiCard
        title="Revisões"
        value={kpis.revisionsUpToDate}
        subtitle="Em dia"
        icon={<RotateCcw className="h-4 w-4 text-muted-foreground" />}
        trend="up"
        trendValue="Sistema 1-3-7 ativo"
      />
    </div>
  )
}
