'use client'

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDisciplines } from "@/hooks/useDisciplines"
import { useDisciplineStore } from "@/store/discipline"
import { carregarQuestoes, filtrarQuestoesPorDisciplina, embaralharArray, type QuestaoAgrupada } from "@/lib/questoes-loader"
import { getConteudoPorDisciplina, getTotalTempoEstimado } from "@/lib/conteudo-disciplinas"
import { 
  ArrowLeft, 
  Heart, 
  Plus, 
  Clock, 
  BookOpen, 
  GraduationCap,
  Star,
  FileText,
  Download,
  CheckCircle,
  Target,
  Lightbulb,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  List,
  ChevronRight
} from "lucide-react"

const levelColors = {
  'Iniciante': 'bg-green-100 text-green-800 border-green-200',
  'Intermediário': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Avançado': 'bg-red-100 text-red-800 border-red-200'
}

const levelIcons = {
  'Iniciante': '🌱',
  'Intermediário': '🌿', 
  'Avançado': '🌳'
}

export default function DisciplineDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: disciplines = [] } = useDisciplines()
  const { 
    isFavorite, 
    addToFavorites, 
    removeFromFavorites,
    addToComparison,
    canAddToComparison 
  } = useDisciplineStore()

  const [questoesDisciplina, setQuestoesDisciplina] = React.useState<QuestaoAgrupada[]>([])
  const [carregandoQuestoes, setCarregandoQuestoes] = React.useState(true)

  const disciplineId = params.id as string
  const discipline = disciplines.find(d => d.id === disciplineId)

  React.useEffect(() => {
    if (!discipline && disciplines.length > 0) {
      router.push('/disciplinas')
    }
  }, [discipline, disciplines, router])

  // Carrega as questões
  React.useEffect(() => {
    async function loadQuestoes() {
      setCarregandoQuestoes(true)
      const todasQuestoes = await carregarQuestoes()
      
      if (discipline) {
        const questoesFiltradas = filtrarQuestoesPorDisciplina(todasQuestoes, discipline.name)
        setQuestoesDisciplina(embaralharArray(questoesFiltradas))
      }
      
      setCarregandoQuestoes(false)
    }
    
    loadQuestoes()
  }, [discipline])

  if (!discipline) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando disciplina...</p>
        </div>
      </div>
    )
  }

  const isFav = isFavorite(discipline.id)

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(discipline.id)
    } else {
      addToFavorites(discipline.id)
    }
  }

  const handleAddToComparison = () => {
    if (canAddToComparison()) {
      addToComparison(discipline.id)
    }
  }

  // Progresso real seria calculado baseado nas atividades concluídas
  const progress = 0

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{discipline.name}</h1>
          <p className="text-muted-foreground">{discipline.board}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isFav ? "default" : "outline"}
            size="sm"
            onClick={handleToggleFavorite}
            className="gap-2"
          >
            <Heart className={isFav ? "fill-current" : ""} />
            {isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToComparison}
            disabled={!canAddToComparison()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Comparar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={levelColors[discipline.level]}>
              {levelIcons[discipline.level]} {discipline.level}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(discipline.durationMin / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {discipline.durationMin} minutos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div>{discipline.materials?.videos || 0} vídeos</div>
              <div>{discipline.materials?.exercises || 0} exercícios</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="study-plan">Plano de Estudo</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Descrição da Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {discipline.description}
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tópicos Abordados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {discipline.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Topics */}
          {discipline.keyTopics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Tópicos Essenciais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {discipline.keyTopics.map((topic, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Tips */}
          {discipline.studyTips && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Dicas de Estudo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discipline.studyTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Conteúdo Programático Detalhado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Conteúdo Programático Completo
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Todos os tópicos que você precisa dominar em {discipline.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getConteudoPorDisciplina(discipline.id).map((topico, index) => (
                  <div key={topico.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-lg">{topico.titulo}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-11 mb-3">
                          {topico.descricao}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          topico.importancia === 'alta' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : topico.importancia === 'média'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {topico.importancia === 'alta' ? '⚠️ Alta' : topico.importancia === 'média' ? '📌 Média' : '📍 Baixa'}
                      </Badge>
                    </div>

                    <div className="ml-11 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>Tempo estimado: {topico.tempoEstimado} minutos</span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Subtópicos:</p>
                        <div className="grid gap-2">
                          {topico.subtopicos.map((subtopico, subIndex) => (
                            <div key={subIndex} className="flex items-start gap-2 text-sm">
                              <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{subtopico}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tempo Total */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-700" />
                    <span className="font-semibold text-blue-900">Tempo Total Estimado:</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-700">
                      {Math.floor(getTotalTempoEstimado(discipline.id) / 60)}h {getTotalTempoEstimado(discipline.id) % 60}min
                    </div>
                    <p className="text-xs text-blue-600">{getTotalTempoEstimado(discipline.id)} minutos totais</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          {/* Questões Reais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Questões Reais de Concursos ({questoesDisciplina.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Questões autênticas de concursos anteriores filtradas especificamente para {discipline.name}
              </p>
            </CardHeader>
            <CardContent>
              {carregandoQuestoes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Carregando questões...</p>
                </div>
              ) : questoesDisciplina.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nenhuma questão encontrada para esta disciplina ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {questoesDisciplina.slice(0, 20).map((questao, index) => (
                    <div key={questao.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50">
                            Questão {index + 1}
                          </Badge>
                          <Badge variant="secondary">
                            {questao.area}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                      </div>
                      
                      <div 
                        className="text-sm mb-3 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: questao.enunciado }}
                      />
                      
                      <div className="grid grid-cols-1 gap-2">
                        {questao.alternativas.slice(0, 2).map((alt) => (
                          <div 
                            key={alt.letra}
                            className={`text-xs p-2 rounded border ${
                              alt.correta ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <span className="font-bold">{alt.letra})</span> 
                            <span 
                              className="ml-1 line-clamp-1"
                              dangerouslySetInnerHTML={{ __html: alt.descricao }}
                            />
                          </div>
                        ))}
                        {questao.alternativas.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            + {questao.alternativas.length - 2} alternativas...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {questoesDisciplina.length > 20 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Exibindo 20 de {questoesDisciplina.length} questões disponíveis.
                    <Button variant="link" className="p-0 h-auto text-blue-700 underline ml-1">
                      Ver todas no simulado
                    </Button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Materials */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDFs e Materiais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Apostilas</span>
                    <span className="font-medium">{discipline.materials?.pdfs || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resumos</span>
                    <span className="font-medium">{discipline.materials?.resumos || 0}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Baixar Todos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Simulados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Disponíveis</span>
                    <span className="font-medium">{discipline.materials?.simulados || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Concluídos</span>
                    <span className="font-medium">{Math.floor((discipline.materials?.simulados || 0) * 0.3)}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Fazer Simulado
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Bibliografia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Livros indicados</span>
                    <span className="font-medium">
                      {discipline.detailedContent?.bibliography?.length || 3}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Jurisprudências</span>
                    <span className="font-medium">
                      {discipline.detailedContent?.jurisprudence?.length || 15}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Ver Bibliografia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="study-plan" className="space-y-6">
          {/* Study Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma Sugerido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Semana 1-2</h4>
                    <p className="text-sm text-green-600 mb-3">Conceitos Fundamentais</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Introdução e conceitos básicos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Exercícios introdutórios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Revisão diária (30min)</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Iniciar Fase 1
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h4 className="font-semibold text-yellow-700 mb-2">Semana 3-4</h4>
                    <p className="text-sm text-yellow-600 mb-3">Aprofundamento</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Tópicos intermediários</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Casos práticos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Jurisprudência relevante</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3" disabled>
                      Aguardando Fase 1
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <h4 className="font-semibold text-red-700 mb-2">Semana 5-6</h4>
                    <p className="text-sm text-red-600 mb-3">Consolidação</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Revisão geral</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Simulados intensivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Questões comentadas</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3" disabled>
                      Aguardando Fase 2
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Customizable Study Plan */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Personalizar Cronograma
                  </h4>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hours-per-week">Horas por semana</Label>
                      <Select defaultValue="10">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 horas/semana</SelectItem>
                          <SelectItem value="10">10 horas/semana</SelectItem>
                          <SelectItem value="15">15 horas/semana</SelectItem>
                          <SelectItem value="20">20 horas/semana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="exam-date">Data do Exame (opcional)</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar ao Cronograma
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Estatísticas da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Estudantes ativos</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">1,234</span>
                      <Badge variant="secondary" className="text-xs">↑ +15%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Taxa de aprovação</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">87%</span>
                      <Progress value={87} className="w-16 h-2" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Tempo médio de estudo</span>
                    <span className="font-medium">45h</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Dificuldade percebida</span>
                    <Badge className={levelColors[discipline.level]}>
                      {discipline.level}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Ranking de Bancas</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>1. CESPE/CEBRASPE</span>
                        <span className="text-muted-foreground">32%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>2. FCC</span>
                        <span className="text-muted-foreground">28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>3. FGV</span>
                        <span className="text-muted-foreground">19%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Seu Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Aulas assistidas</span>
                      <span className="font-medium">
                        {Math.floor(progress * Math.min(discipline.materials?.videos || 0, 40) / 100)}/{Math.min(discipline.materials?.videos || 0, 40)}
                      </span>
                    </div>
                    <Progress value={progress} className="mb-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Meta: 2 aulas/dia</span>
                      <span>{progress}% concluído</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Exercícios resolvidos</span>
                      <span className="font-medium">
                        {Math.floor(progress * Math.min(discipline.materials?.exercises || 0, 40) / 100)}/{Math.min(discipline.materials?.exercises || 0, 40)}
                      </span>
                    </div>
                    <Progress value={progress} className="mb-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Acertos: {Math.floor(progress * 0.8)}%</span>
                      <span>Média da turma: 75%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Tempo estudado</span>
                      <span className="font-medium">{Math.floor(progress * 45 / 100)}h / 45h</span>
                    </div>
                    <Progress value={progress} className="mb-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Esta semana: 8h</span>
                      <span>Sequência: 5 dias</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">A+</div>
                      <div className="text-xs text-green-600">Nota atual</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">15°</div>
                      <div className="text-xs text-blue-600">Ranking turma</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Baixar Relatório Completo
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Target className="h-4 w-4" />
                      Definir Metas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Evolução Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-sm w-8">{day}</span>
                      <Progress value={0} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8">
                        0h
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Desempenho por Tópico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discipline.tags.slice(0, 5).map((tag) => (
                    <div key={tag} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{tag}</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Metas e Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Estudante Dedicado</p>
                      <p className="text-xs text-muted-foreground">5 dias consecutivos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Primeira Aula</p>
                      <p className="text-xs text-muted-foreground">Completada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg opacity-60">
                    <Target className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Maratonista</p>
                      <p className="text-xs text-muted-foreground">50 horas de estudo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Study Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Para Melhorar</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Exercícios de {discipline.tags[0]}</p>
                        <p className="text-xs text-muted-foreground">
                          Acertos abaixo da média (65%). Pratique mais questões.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Consistência de Estudos</p>
                        <p className="text-xs text-muted-foreground">
                          Tente manter pelo menos 1h/dia para melhor retenção.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Próximos Passos</h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Aula Recomendada</p>
                        <p className="text-xs text-muted-foreground">
                          Aula 12 - {discipline.tags[1] || 'Tópico Avançado'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <Target className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Simulado Preparado</p>
                        <p className="text-xs text-muted-foreground">
                          Você está pronto para o simulado intermediário!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
