'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiGrid } from "@/components/charts/KpiCard"
import { TrendChart } from "@/components/charts/TrendChart"
import { DisciplineStackedBars } from "@/components/charts/DisciplineStackedBars"
import { WeeklyHeatmap } from "@/components/charts/WeeklyHeatmap"
import { InsightsList } from "@/components/charts/InsightsList"
import { useProgressStore } from "@/store/progress"
import { useScheduleStore } from "@/store/schedule"
import { Download, FileText, BarChart3, Calendar } from "lucide-react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ProgressoPage() {
  const { getKPIs, logs } = useProgressStore()
  const { blocks } = useScheduleStore()
  const [isExporting, setIsExporting] = React.useState(false)
  const dashboardRef = React.useRef<HTMLDivElement>(null)
  
  const kpis = getKPIs()
  
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return
    
    setIsExporting(true)
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`relatorio-progresso-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleExportCSV = () => {
    const csvData = blocks.map(block => ({
      Data: block.date,
      Disciplina: block.disciplineId,
      Titulo: block.title,
      Tipo: block.type,
      Inicio: block.start,
      Fim: block.end,
      Concluido: block.completed ? 'Sim' : 'Não',
      Pomodoros: block.pomodoros || 0
    }))
    
    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `dados-estudo-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progresso & Analytics</h1>
          <p className="text-muted-foreground">
            Acompanhe seu desempenho e receba insights personalizados
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </Button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div ref={dashboardRef} className="space-y-8">
        {/* KPIs */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Indicadores Principais
          </h2>
          <KpiGrid />
        </section>
        
        {/* Charts Grid */}
        <section className="grid gap-8 lg:grid-cols-2">
          <TrendChart />
          <DisciplineStackedBars />
        </section>
        
        {/* Heatmap */}
        <section>
          <WeeklyHeatmap />
        </section>
        
        {/* Insights */}
        <section>
          <InsightsList />
        </section>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              Resumo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Horas planejadas:</span>
              <span className="font-medium">{kpis.weeklyHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxa de aderência:</span>
              <span className={`font-medium ${kpis.adherencePercentage >= 80 ? 'text-green-600' : kpis.adherencePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {kpis.adherencePercentage}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Disciplinas ativas:</span>
              <span className="font-medium">{kpis.activeDisciplines}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Resumo Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Horas estudadas:</span>
              <span className="font-medium">{kpis.monthlyHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Logs de progresso:</span>
              <span className="font-medium">{logs.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Revisões em dia:</span>
              <span className="font-medium">{kpis.revisionsUpToDate}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {kpis.adherencePercentage < 60 && (
              <p className="text-orange-600">• Considere reduzir 10% da carga horária</p>
            )}
            {kpis.weeklyHours > 40 && (
              <p className="text-red-600">• Inclua mais pausas e descanso</p>
            )}
            {kpis.adherencePercentage >= 80 && (
              <p className="text-green-600">• Parabéns! Continue assim! 🎉</p>
            )}
            <p className="text-muted-foreground">• Mantenha constância nos estudos</p>
            <p className="text-muted-foreground">• Faça simulados regularmente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
