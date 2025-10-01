'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  PlayCircle, 
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Share2,
  Brain,
  Headphones,
  FileText,
  Sparkles
} from 'lucide-react'
import { MindMapGenerator } from '@/components/notebook-ia/MindMapGenerator'
import { PodcastGenerator } from '@/components/notebook-ia/PodcastGenerator'
import { StudyAnalyzer } from '@/components/notebook-ia/StudyAnalyzer'

interface Aula {
  id: string
  titulo: string
  disciplina: string
  tipo: 'analise' | 'mapa-mental' | 'podcast'
  conteudo: string
  dataCriacao: Date
  duracao?: string
  visualizacoes: number
  status: 'concluida' | 'em-andamento' | 'agendada'
  dados?: any
}

export default function AulasPage() {
  const [activeTab, setActiveTab] = useState('minhas-aulas')
  const [aulas, setAulas] = useState<Aula[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroText, setFiltroText] = useState('')
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null)

  // Carrega aulas salvas do localStorage
  useEffect(() => {
    const aulasStorage = localStorage.getItem('mindlegal-aulas')
    if (aulasStorage) {
      const aulasData = JSON.parse(aulasStorage)
      setAulas(aulasData.map((aula: any) => ({
        ...aula,
        dataCriacao: new Date(aula.dataCriacao)
      })))
    }
  }, [])

  // Salva aulas no localStorage
  const salvarAulas = (novasAulas: Aula[]) => {
    localStorage.setItem('mindlegal-aulas', JSON.stringify(novasAulas))
    setAulas(novasAulas)
  }

  // Filtra aulas
  const aulasFiltradas = aulas.filter(aula => {
    const matchTipo = filtroTipo === 'todos' || aula.tipo === filtroTipo
    const matchTexto = aula.titulo.toLowerCase().includes(filtroText.toLowerCase()) ||
                      aula.disciplina.toLowerCase().includes(filtroText.toLowerCase()) ||
                      aula.conteudo.toLowerCase().includes(filtroText.toLowerCase())
    return matchTipo && matchTexto
  })

  const abrirAula = (aula: Aula) => {
    setAulaAtiva(aula)
    // Atualiza visualizações
    const aulasAtualizadas = aulas.map(a => 
      a.id === aula.id ? { ...a, visualizacoes: a.visualizacoes + 1 } : a
    )
    salvarAulas(aulasAtualizadas)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'analise': return <FileText className="h-4 w-4" />
      case 'mapa-mental': return <Brain className="h-4 w-4" />
      case 'podcast': return <Headphones className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'analise': return 'Análise'
      case 'mapa-mental': return 'Mapa Mental'
      case 'podcast': return 'Podcast'
      default: return 'Aula'
    }
  }

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'analise': return 'bg-blue-500'
      case 'mapa-mental': return 'bg-green-500'
      case 'podcast': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (aulaAtiva) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header da Aula */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setAulaAtiva(null)}
            className="mb-4"
          >
            ← Voltar para Minhas Aulas
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${getTipoCor(aulaAtiva.tipo)} rounded-lg`}>
              {getTipoIcon(aulaAtiva.tipo)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{aulaAtiva.titulo}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{aulaAtiva.disciplina}</span>
                <span>•</span>
                <span>{aulaAtiva.dataCriacao.toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {aulaAtiva.visualizacoes} visualizações
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da Aula */}
        <div className="space-y-6">
          {aulaAtiva.tipo === 'analise' && (
            <StudyAnalyzer />
          )}
          
          {aulaAtiva.tipo === 'mapa-mental' && (
            <MindMapGenerator />
          )}
          
          {aulaAtiva.tipo === 'podcast' && (
            <PodcastGenerator />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Minhas Aulas
            </h1>
            <p className="text-muted-foreground">
              Acesse e gerencie todas as suas aulas criadas com IA
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Análises Inteligentes
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Mapas Mentais
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Headphones className="h-3 w-3" />
            Podcasts IA
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="minhas-aulas" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Minhas Aulas ({aulas.length})
          </TabsTrigger>
          <TabsTrigger value="criar-aula" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Nova Aula
          </TabsTrigger>
        </TabsList>

        {/* Tab: Minhas Aulas */}
        <TabsContent value="minhas-aulas" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título, disciplina ou conteúdo..."
                      value={filtroText}
                      onChange={(e) => setFiltroText(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="analise">Análises</option>
                    <option value="mapa-mental">Mapas Mentais</option>
                    <option value="podcast">Podcasts</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Aulas */}
          {aulasFiltradas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {aulas.length === 0 ? 'Nenhuma aula criada ainda' : 'Nenhuma aula encontrada'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {aulas.length === 0 
                    ? 'Comece criando sua primeira aula com IA na aba "Criar Nova Aula"'
                    : 'Tente ajustar os filtros para encontrar suas aulas'
                  }
                </p>
                <Button 
                  onClick={() => setActiveTab('criar-aula')}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeira Aula
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aulasFiltradas.map((aula) => (
                <Card key={aula.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 ${getTipoCor(aula.tipo)} rounded text-white`}>
                          {getTipoIcon(aula.tipo)}
                        </div>
                        <Badge variant="outline">
                          {getTipoLabel(aula.tipo)}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {aula.titulo}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {aula.disciplina} • {aula.conteudo.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {aula.dataCriacao.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {aula.visualizacoes}
                      </div>
                    </div>
                    <Button 
                      onClick={() => abrirAula(aula)}
                      className="w-full gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Abrir Aula
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Criar Nova Aula */}
        <TabsContent value="criar-aula" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-5 w-5" />
                  Análise Inteligente
                </CardTitle>
                <CardDescription>
                  Analise conteúdos de estudo com insights avançados da IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                  <li>• Identificação de disciplinas</li>
                  <li>• Pontos fortes e fracos</li>
                  <li>• Recomendações personalizadas</li>
                  <li>• Dados do Firebase</li>
                </ul>
                <StudyAnalyzer onAulaCriada={(dados) => {
                  const novaAula: Aula = {
                    id: Date.now().toString(),
                    titulo: `Análise - ${dados.subjects?.[0] || 'Estudo'}`,
                    disciplina: dados.subjects?.join(', ') || 'Geral',
                    tipo: 'analise',
                    conteudo: 'Análise inteligente de conteúdo',
                    dataCriacao: new Date(),
                    visualizacoes: 0,
                    status: 'concluida',
                    dados
                  }
                  salvarAulas([...aulas, novaAula])
                  setActiveTab('minhas-aulas')
                }} />
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Brain className="h-5 w-5" />
                  Mapa Mental
                </CardTitle>
                <CardDescription>
                  Visualize conceitos em mapas mentais interativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                  <li>• Estrutura hierárquica</li>
                  <li>• Múltiplos temas visuais</li>
                  <li>• Export em SVG</li>
                  <li>• Baseado no Firebase</li>
                </ul>
                <MindMapGenerator onAulaCriada={(dados) => {
                  const novaAula: Aula = {
                    id: Date.now().toString(),
                    titulo: `Mapa Mental - ${dados.central || 'Conceitos'}`,
                    disciplina: 'Mapa Mental',
                    tipo: 'mapa-mental',
                    conteudo: 'Mapa mental interativo',
                    dataCriacao: new Date(),
                    visualizacoes: 0,
                    status: 'concluida',
                    dados
                  }
                  salvarAulas([...aulas, novaAula])
                  setActiveTab('minhas-aulas')
                }} />
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Headphones className="h-5 w-5" />
                  Podcast IA
                </CardTitle>
                <CardDescription>
                  Escute conteúdos em podcasts narrados por vozes IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground mb-4">
                  <li>• Vozes ElevenLabs Premium</li>
                  <li>• Duração de 15+ minutos</li>
                  <li>• Questões reais do Firebase</li>
                  <li>• Download para offline</li>
                </ul>
                <PodcastGenerator onAulaCriada={(dados) => {
                  const novaAula: Aula = {
                    id: Date.now().toString(),
                    titulo: dados.title || 'Podcast Educativo',
                    disciplina: 'Podcast',
                    tipo: 'podcast',
                    conteudo: 'Podcast educativo com IA',
                    dataCriacao: new Date(),
                    duracao: dados.duration,
                    visualizacoes: 0,
                    status: 'concluida',
                    dados
                  }
                  salvarAulas([...aulas, novaAula])
                  setActiveTab('minhas-aulas')
                }} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}