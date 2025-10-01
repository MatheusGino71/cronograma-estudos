'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisciplineCard } from "@/components/disciplines/DisciplineCard"
import { DisciplineTable } from "@/components/disciplines/DisciplineTable"
import { useFilteredDisciplines, useDisciplineStats } from "@/hooks/useDisciplines"
import { useDisciplineStore } from "@/store/discipline"
import { Discipline } from "@/types"
import { Grid3X3, List, Heart, GitCompare, Star, TrendingUp, BookOpen, Clock } from "lucide-react"

export default function DisciplinasPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'table'>('grid')
  const router = useRouter()
  
  const { data: disciplines = [], isLoading } = useFilteredDisciplines()
  const { data: stats = [] } = useDisciplineStats()
  const { favorites, comparison, clearComparison } = useDisciplineStore()
  
  const totalDisciplines = disciplines.length
  const totalHoursStudied = stats.reduce((sum, stat) => sum + (stat.totalHours || 0), 0)
  const averageProgress = stats.length > 0 
    ? Math.round(stats.reduce((sum, stat) => sum + (stat.progress || 0), 0) / stats.length)
    : 0
  
  const handleViewDetails = (discipline: Discipline) => {
    router.push(`/disciplinas/${discipline.id}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando disciplinas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disciplinas de Direito</h1>
          <p className="text-muted-foreground">
            Explore todas as disciplinas jurídicas, compare conteúdos e adicione ao seu cronograma de estudos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Favoritos ({favorites.length})
          </Button>
          
          {comparison.length > 0 && (
            <Button variant="secondary" size="sm">
              <GitCompare className="h-4 w-4 mr-2" />
              Comparar ({comparison.length})
            </Button>
          )}
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Disciplinas
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisciplines}</div>
            <p className="text-xs text-muted-foreground">
              Disponíveis no catálogo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Estudadas
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursStudied}h</div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso Médio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Across all disciplines
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favoritos
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
            <p className="text-xs text-muted-foreground">
              Disciplinas marcadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero/Banner Section */}
      <Card className="bg-gradient-to-r from-red-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                ⚖️ Domine todas as áreas do Direito
              </h2>
              <p className="text-red-100 max-w-2xl">
                Nosso catálogo conta com 12 disciplinas jurídicas essenciais, 
                organizadas por nível de dificuldade e banca examinadora. 
                Desde Direito Constitucional até áreas especializadas como Direito Ambiental e Previdenciário.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-red-900">
                  ⚖️ Conteúdo jurídico atualizado
                </Badge>
                <Badge variant="secondary" className="text-red-900">
                  📚 Doutrina e jurisprudência
                </Badge>
                <Badge variant="secondary" className="text-red-900">
                  🏆 Aprovação em concursos
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm">
                <strong>92%</strong> de aprovação<br/>
                em concursos jurídicos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comparison Panel */}
      {comparison.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Comparação ({comparison.length}/3)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearComparison}>
                Limpar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {comparison.map(disciplineId => {
                const discipline = disciplines.find(d => d.id === disciplineId)
                const stat = stats.find(s => s.id === disciplineId)
                
                if (!discipline) return null
                
                return (
                  <Card key={disciplineId} className="bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{discipline.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Nível:</span>
                        <Badge variant="secondary">{discipline.level}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span>{Math.round(discipline.durationMin / 60)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progresso:</span>
                        <span>{stat?.progress || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materiais:</span>
                        <span>
                          {(discipline.materials?.videos || 0) + 
                           (discipline.materials?.pdfs || 0) + 
                           (discipline.materials?.exercises || 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas as Disciplinas</CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as 'grid' | 'table')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Grade
                  </TabsTrigger>
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Tabela
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {disciplines.map((discipline) => {
                const stat = stats.find(s => s.id === discipline.id)
                return (
                  <DisciplineCard
                    key={discipline.id}
                    discipline={discipline}
                    progress={stat?.progress}
                    onViewDetails={handleViewDetails}
                  />
                )
              })}
            </div>
          ) : (
            <DisciplineTable onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>
      
      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>❓ Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Como adicionar uma disciplina ao cronograma?</h4>
            <p className="text-sm text-muted-foreground">
              Clique nos botões de ação rápida (25min, Rev, Sim) ou use &quot;Adicionar ao cronograma&quot; 
              na visualização detalhada.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Posso comparar diferentes disciplinas?</h4>
            <p className="text-sm text-muted-foreground">
              Sim! Clique no ícone &quot;+&quot; em até 3 disciplinas para compará-las lado a lado.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Como funciona o sistema de favoritos?</h4>
            <p className="text-sm text-muted-foreground">
              Clique no ícone de coração para salvar suas disciplinas preferidas. 
              Elas ficam sempre acessíveis no topo da página.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
