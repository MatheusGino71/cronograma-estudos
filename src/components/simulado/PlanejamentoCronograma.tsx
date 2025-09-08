'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResultadoSimulado } from '@/types/simulado'
import { toast } from 'sonner'
import { useScheduleStore } from '@/store/schedule'
import { 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Play
} from 'lucide-react'

interface PlanejamentoCronogramaProps {
  resultado: ResultadoSimulado
  onVoltarSimulado: () => void
}

export function PlanejamentoCronograma({ resultado, onVoltarSimulado }: PlanejamentoCronogramaProps) {
  const [horasSemanais, setHorasSemanais] = useState([20])
  const [periodoEstudo, setPeriodoEstudo] = useState('8-semanas')
  const [foco, setFoco] = useState('equilibrado')
  
  const addBlock = useScheduleStore((state) => state.add)

  // Função para baixar cronograma em PDF
  const handleBaixarPDF = async () => {
    try {
      // Importação dinâmica do jsPDF
      const { default: jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      
      // Cabeçalho
      doc.setFontSize(20)
      doc.text('Cronograma de Estudos Personalizado', pageWidth / 2, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' })
      doc.text(`Desempenho no Simulado: ${resultado.percentualGeral.toFixed(1)}%`, pageWidth / 2, 40, { align: 'center' })
      
      let yPosition = 60
      
      // Análise de performance
      doc.setFontSize(16)
      doc.text('Análise de Performance', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(10)
      disciplinasComAnalise.forEach((disc, index) => {
        const prioridade = disc.prioridade === 'alta' ? 'ALTA' : 
                          disc.prioridade === 'media' ? 'MÉDIA' : 'BAIXA'
        doc.text(`• ${disc.disciplina}: ${disc.percentual.toFixed(1)}% - Prioridade: ${prioridade}`, 25, yPosition)
        yPosition += 8
        
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
      })
      
      // Cronograma semanal
      yPosition += 10
      doc.setFontSize(16)
      doc.text('Cronograma Semanal Sugerido', 20, yPosition)
      yPosition += 15
      
      doc.setFontSize(10)
      const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const horasPorDia = horasSemanais[0] / 6
      
      diasSemana.forEach((dia, index) => {
        doc.text(`${dia}-feira:`, 25, yPosition)
        yPosition += 6
        
        disciplinasComAnalise.slice(0, 2).forEach(disc => {
          doc.text(`  • ${disc.disciplina}: ${(horasPorDia / 2).toFixed(1)}h`, 30, yPosition)
          yPosition += 6
        })
        
        yPosition += 5
      })
      
      // Salvar PDF
      doc.save(`cronograma-estudos-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success('Cronograma baixado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    }
  }

  // Função para salvar no cronograma do usuário
  const handleSalvarCronograma = () => {
    try {
      const agora = new Date()
      const horasPorDia = horasSemanais[0] / 6
      
      disciplinasComAnalise.forEach((disc, disciplinaIndex) => {
        // Criar blocos para cada disciplina baseado na prioridade
        const blocosParaDisciplina = disc.prioridade === 'alta' ? 6 : 
                                   disc.prioridade === 'media' ? 4 : 2
        
        for (let semana = 0; semana < 4; semana++) {
          for (let dia = 0; dia < blocosParaDisciplina; dia++) {
            const dataBloco = new Date(agora)
            dataBloco.setDate(agora.getDate() + (semana * 7) + (dia + disciplinaIndex) % 7)
            
            const horaInicio = 8 + (dia * 2) % 10 // Distribui entre 8h e 18h
            const horaFim = horaInicio + (horasPorDia / blocosParaDisciplina * 7) // Converte para duração
            
            addBlock({
              id: `sim-${Date.now()}-${disciplinaIndex}-${semana}-${dia}`,
              disciplineId: `disc-${disc.disciplina.toLowerCase().replace(/\s+/g, '-')}`,
              title: `Estudo: ${disc.disciplina}`,
              date: dataBloco.toISOString().split('T')[0],
              start: `${horaInicio.toString().padStart(2, '0')}:00`,
              end: `${Math.floor(horaFim).toString().padStart(2, '0')}:${Math.floor((horaFim % 1) * 60).toString().padStart(2, '0')}`,
              completed: false,
              userId: 'current-user', // TODO: pegar do contexto de auth
              type: 'Estudo',
              pomodoros: Math.ceil((horaFim - horaInicio) * 2) // 1 pomodoro = 30min
            })
          }
        }
      })
      
      toast.success(`Cronograma salvo! ${disciplinasComAnalise.length} disciplinas adicionadas ao seu cronograma.`)
      
    } catch (error) {
      console.error('Erro ao salvar cronograma:', error)
      toast.error('Erro ao salvar cronograma. Tente novamente.')
    }
  }

  // Análise do desempenho para priorização
  const disciplinasComAnalise = resultado.resultadosPorDisciplina
    .map(disc => ({
      ...disc,
      prioridade: disc.percentual < 50 ? 'alta' : disc.percentual < 70 ? 'media' : 'baixa',
      statusPerformance: disc.percentual < 50 ? 'critico' : disc.percentual < 70 ? 'atencao' : 'bom'
    }))
    .sort((a, b) => a.percentual - b.percentual) // Ordenar por pior desempenho primeiro

  // Gerar cronograma baseado no desempenho
  const gerarCronograma = () => {
    const totalHoras = horasSemanais[0]
    let distribuicaoHoras: Record<string, number> = {}

    if (foco === 'pontos-fracos') {
      // Foco nas disciplinas com pior desempenho
      const disciplinasCriticas = disciplinasComAnalise.filter(d => d.prioridade === 'alta')
      const disciplinasMedias = disciplinasComAnalise.filter(d => d.prioridade === 'media')
      const disciplinasBoas = disciplinasComAnalise.filter(d => d.prioridade === 'baixa')

      const horasParaCriticas = Math.floor(totalHoras * 0.6)
      const horasParaMedias = Math.floor(totalHoras * 0.3)
      const horasParaBoas = totalHoras - horasParaCriticas - horasParaMedias

      disciplinasCriticas.forEach((disc, index) => {
        distribuicaoHoras[disc.disciplina] = Math.floor(horasParaCriticas / disciplinasCriticas.length)
      })
      disciplinasMedias.forEach((disc, index) => {
        distribuicaoHoras[disc.disciplina] = Math.floor(horasParaMedias / disciplinasMedias.length)
      })
      disciplinasBoas.forEach((disc, index) => {
        distribuicaoHoras[disc.disciplina] = Math.floor(horasParaBoas / disciplinasBoas.length)
      })
    } else if (foco === 'equilibrado') {
      // Distribuição mais equilibrada, mas ainda priorizando pontos fracos
      disciplinasComAnalise.forEach(disc => {
        if (disc.prioridade === 'alta') {
          distribuicaoHoras[disc.disciplina] = Math.floor(totalHoras * 0.4 / disciplinasComAnalise.filter(d => d.prioridade === 'alta').length)
        } else if (disc.prioridade === 'media') {
          distribuicaoHoras[disc.disciplina] = Math.floor(totalHoras * 0.35 / disciplinasComAnalise.filter(d => d.prioridade === 'media').length)
        } else {
          distribuicaoHoras[disc.disciplina] = Math.floor(totalHoras * 0.25 / disciplinasComAnalise.filter(d => d.prioridade === 'baixa').length)
        }
      })
    } else {
      // Revisão geral - distribuição uniforme
      const horasPorDisciplina = Math.floor(totalHoras / disciplinasComAnalise.length)
      disciplinasComAnalise.forEach(disc => {
        distribuicaoHoras[disc.disciplina] = horasPorDisciplina
      })
    }

    return distribuicaoHoras
  }

  const cronogramaSemanal = gerarCronograma()

  // Distribuição por dias da semana
  const gerarCronogramaDiario = () => {
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    const cronogramaDiario: Record<string, Array<{disciplina: string, horas: number}>> = {}

    dias.forEach(dia => {
      cronogramaDiario[dia] = []
    })

    // Distribuir disciplinas pelos dias
    let diaIndex = 0
    Object.entries(cronogramaSemanal).forEach(([disciplina, horasTotal]) => {
      const sessoesPorSemana = Math.ceil(horasTotal / 2) // Máximo 2h por sessão
      const horasPorSessao = horasTotal / sessoesPorSemana

      for (let i = 0; i < sessoesPorSemana; i++) {
        const dia = dias[diaIndex % dias.length]
        cronogramaDiario[dia].push({
          disciplina,
          horas: Number(horasPorSessao.toFixed(1))
        })
        diaIndex++
      }
    })

    return cronogramaDiario
  }

  const cronogramaDiario = gerarCronogramaDiario()

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins}min ${secs}s`
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critico': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'atencao': return <TrendingUp className="h-4 w-4 text-yellow-600" />
      case 'bom': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-blue-600" />
            Planejamento de Estudos Personalizado
          </CardTitle>
          <p className="text-muted-foreground">
            Baseado na sua performance no simulado, criamos um cronograma otimizado para seus pontos de melhoria.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="analise" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analise">📊 Análise</TabsTrigger>
          <TabsTrigger value="configuracao">⚙️ Configuração</TabsTrigger>
          <TabsTrigger value="cronograma">📅 Cronograma</TabsTrigger>
          <TabsTrigger value="metas">🎯 Metas</TabsTrigger>
        </TabsList>

        {/* Análise do Desempenho */}
        <TabsContent value="analise" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumo Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Geral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {resultado.percentualGeral.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Aproveitamento Total</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Acertos:</span>
                    <span className="font-medium text-green-600">{resultado.acertos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Erros:</span>
                    <span className="font-medium text-red-600">{resultado.erros}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo:</span>
                    <span className="font-medium">{formatarTempo(resultado.tempoTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status por Disciplina */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Performance por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disciplinasComAnalise.map((disciplina) => (
                    <div key={disciplina.disciplina} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(disciplina.statusPerformance)}
                        <div>
                          <div className="font-medium">{disciplina.disciplina}</div>
                          <div className="text-sm text-muted-foreground">
                            {disciplina.acertos}/{disciplina.total} questões
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getPrioridadeColor(disciplina.prioridade)}>
                          {disciplina.prioridade === 'alta' ? 'Prioridade Alta' : 
                           disciplina.prioridade === 'media' ? 'Prioridade Média' : 'Manter Nível'}
                        </Badge>
                        <div className="w-20">
                          <Progress value={disciplina.percentual} className="h-2" />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {disciplina.percentual.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuração do Cronograma */}
        <TabsContent value="configuracao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalizar Cronograma</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ajuste as configurações para criar um cronograma adequado à sua rotina.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horas de Estudo por Semana</label>
                  <div className="px-3">
                    <Slider
                      value={horasSemanais}
                      onValueChange={setHorasSemanais}
                      max={50}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5h</span>
                      <span className="font-medium">{horasSemanais[0]}h/semana</span>
                      <span>50h</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Período de Estudo</label>
                  <Select value={periodoEstudo} onValueChange={setPeriodoEstudo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-semanas">4 Semanas (Revisão Intensiva)</SelectItem>
                      <SelectItem value="8-semanas">8 Semanas (Preparação Padrão)</SelectItem>
                      <SelectItem value="12-semanas">12 Semanas (Preparação Completa)</SelectItem>
                      <SelectItem value="16-semanas">16 Semanas (Preparação Longa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estratégia de Foco</label>
                  <Select value={foco} onValueChange={setFoco}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pontos-fracos">Foco nos Pontos Fracos (60%)</SelectItem>
                      <SelectItem value="equilibrado">Abordagem Equilibrada</SelectItem>
                      <SelectItem value="revisao">Revisão Geral Uniforme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cronograma Semanal */}
        <TabsContent value="cronograma" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de Horas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribuição Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(cronogramaSemanal).map(([disciplina, horas]) => {
                    const disc = disciplinasComAnalise.find(d => d.disciplina === disciplina)
                    return (
                      <div key={disciplina} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            disc?.prioridade === 'alta' ? 'bg-red-500' :
                            disc?.prioridade === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <span className="font-medium">{disciplina}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{horas}h</div>
                          <div className="text-xs text-muted-foreground">por semana</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cronograma Diário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Cronograma Diário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(cronogramaDiario).map(([dia, sessoes]) => (
                    <div key={dia} className="space-y-2">
                      <div className="font-medium text-sm">{dia}</div>
                      {sessoes.length > 0 ? (
                        <div className="space-y-1 pl-4">
                          {sessoes.map((sessao, index) => (
                            <div key={index} className="flex items-center justify-between text-sm py-1 px-2 bg-gray-50 rounded">
                              <span>{sessao.disciplina}</span>
                              <span className="text-muted-foreground">{sessao.horas}h</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground pl-4">Dia livre</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metas e Recomendações */}
        <TabsContent value="metas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disciplinasComAnalise.filter(d => d.prioridade === 'alta').map((disciplina) => (
                    <div key={disciplina.disciplina} className="p-3 border-l-4 border-red-500 bg-red-50">
                      <div className="font-medium">{disciplina.disciplina}</div>
                      <div className="text-sm text-muted-foreground">
                        Meta: Aumentar de {disciplina.percentual.toFixed(1)}% para 70%
                      </div>
                      <div className="text-sm mt-1">
                        📚 Dedicar {cronogramaSemanal[disciplina.disciplina]}h por semana
                      </div>
                    </div>
                  ))}
                  {disciplinasComAnalise.filter(d => d.prioridade === 'media').map((disciplina) => (
                    <div key={disciplina.disciplina} className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                      <div className="font-medium">{disciplina.disciplina}</div>
                      <div className="text-sm text-muted-foreground">
                        Meta: Consolidar conhecimento acima de 80%
                      </div>
                      <div className="text-sm mt-1">
                        📚 Dedicar {cronogramaSemanal[disciplina.disciplina]}h por semana
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recomendações de Estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Técnica Recomendada</div>
                    <div className="text-sm text-blue-700 mt-1">
                      {foco === 'pontos-fracos' 
                        ? 'Foco intensivo nas disciplinas com baixo desempenho, seguido de revisão das outras.'
                        : foco === 'equilibrado'
                        ? 'Equilibre o tempo entre todas as disciplinas, priorizando ligeiramente os pontos fracos.'
                        : 'Revisão uniforme para manter o nível em todas as disciplinas.'
                      }
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>💡 Dicas Gerais:</strong>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Faça pausas de 15min a cada 2h de estudo</li>
                      <li>• Revise os conteúdos das disciplinas críticas 2x por semana</li>
                      <li>• Resolva simulados semanais para acompanhar progresso</li>
                      <li>• Dedique 20% do tempo para revisão geral</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={onVoltarSimulado} variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Fazer Novo Simulado
            </Button>
            <Button onClick={handleBaixarPDF}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Cronograma PDF
            </Button>
            <Button onClick={handleSalvarCronograma}>
              <Calendar className="h-4 w-4 mr-2" />
              Salvar no Meu Cronograma
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
