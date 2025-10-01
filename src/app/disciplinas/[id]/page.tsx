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
import { DisciplinePodcastGenerator } from "@/components/disciplines/DisciplinePodcastGenerator"
import { 
  ArrowLeft, 
  Heart, 
  Plus, 
  Clock, 
  BookOpen, 
  GraduationCap,
  Star,
  Video,
  FileText,
  Download,
  Play,
  CheckCircle,
  Target,
  Lightbulb,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Settings
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

  const disciplineId = params.id as string
  const discipline = disciplines.find(d => d.id === disciplineId)

  React.useEffect(() => {
    if (!discipline && disciplines.length > 0) {
      router.push('/disciplinas')
    }
  }, [discipline, disciplines, router])

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

  const progress = Math.floor(Math.random() * 100) // Mock progress

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
          {/* Content Structure */}
          {discipline.contentStructure && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Estrutura do Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discipline.contentStructure.map((module, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{module.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      <div className="space-y-1">
                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center gap-2">
                            <div className="h-1 w-1 bg-gray-400 rounded-full" />
                            <span className="text-sm">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          {/* Materials */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Vídeo Aulas ({Math.min(discipline.materials?.videos || 0, 40)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[...Array(Math.min(discipline.materials?.videos || 0, 40))].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Play className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Aula {index + 1} - {discipline.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 30) + 15} min • 
                            {Math.random() > 0.5 ? ' Concluída' : ' Não assistida'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Play className="h-3 w-3" />
                          Assistir
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(discipline.materials?.videos || 0) > 40 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Exibindo 40 de {discipline.materials?.videos} aulas. 
                      <Button variant="link" className="p-0 h-auto text-blue-700 underline ml-1">
                        Ver todas
                      </Button>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Listas de Exercícios ({Math.min(discipline.materials?.exercises || 0, 40)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {[...Array(Math.min(discipline.materials?.exercises || 0, 40))].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Lista {index + 1} - {discipline.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 20) + 5} questões • 
                            Nível {['Fácil', 'Médio', 'Difícil'][Math.floor(Math.random() * 3)]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={Math.floor(Math.random() * 100)} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(Math.random() * 100)}% concluído
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <FileText className="h-3 w-3" />
                          Resolver
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(discipline.materials?.exercises || 0) > 40 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Exibindo 40 de {discipline.materials?.exercises} listas. 
                      <Button variant="link" className="p-0 h-auto text-blue-700 underline ml-1">
                        Ver todas
                      </Button>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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

          {/* Seção de Podcast com IA */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
                  <span className="text-white text-sm">✨</span>
                </div>
                Podcast Educativo com IA
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Transforme o conteúdo desta disciplina em um podcast personalizado usando inteligência artificial
              </p>
            </CardHeader>
            <CardContent>
              <DisciplinePodcastGenerator discipline={discipline} />
            </CardContent>
          </Card>
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
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-sm w-8">{day}</span>
                      <Progress value={Math.random() * 100} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8">
                        {Math.floor(Math.random() * 4)}h
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
                  {discipline.tags.slice(0, 5).map((tag, index) => (
                    <div key={tag} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{tag}</span>
                        <span className="font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 40) + 60} className="h-2" />
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
