'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Brain, 
  Headphones, 
  FileText, 
  Sparkles,
  TrendingUp,
  BookOpen,
  Eye,
  Trash2,
  Video
} from 'lucide-react'
import { MindMapGenerator } from '@/components/notebook-ia/MindMapGenerator'
import { PodcastGenerator } from '@/components/notebook-ia/PodcastGenerator'
import { StudyAnalyzer } from '@/components/notebook-ia/StudyAnalyzer'
import VideoSummaryGenerator from '@/components/notebook-ia/VideoSummaryGenerator'

interface Aula {
  id: string
  titulo: string
  tipo: 'analise' | 'mapa-mental' | 'podcast'
  conteudo: any
  criadaEm: Date
  criadoEm: string
  visualizacoes: number
  tags: string[]
  disciplinas: string[]
  materia: string
  descricao?: string
  duracao?: number
  dados?: any
}

export default function NotebookIAPage() {
  const [activeTab, setActiveTab] = useState('analyzer')
  const [aulas, setAulas] = useState<Aula[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroMateria, setFiltroMateria] = useState('todas')
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

  // Cria uma nova aula
  const criarAula = (tipo: 'analise' | 'mapa-mental' | 'podcast', dados: any) => {
    const novaAula: Aula = {
      id: Date.now().toString(),
      titulo: dados.title || dados.central || `${tipo} - ${dados.subjects?.[0] || 'Estudo'}`,
      materia: dados.subjects?.join(', ') || dados.materia || tipo,
      descricao: dados.descricao || dados.description || '',
      tipo,
      conteudo: tipo === 'podcast' ? 'Podcast educativo com IA' : 
                tipo === 'mapa-mental' ? 'Mapa mental interativo' : 
                'Análise inteligente de conteúdo',
      criadaEm: new Date(),
      criadoEm: new Date().toISOString(),
      duracao: dados.duration,
      visualizacoes: 0,
      tags: dados.tags || [],
      disciplinas: dados.subjects || [],
      dados
    }
    salvarAulas([...aulas, novaAula])
  }

  // Filtra aulas
  const aulasFiltradas = aulas.filter(aula => {
    const matchTipo = filtroTipo === 'todos' || aula.tipo === filtroTipo
    const matchTexto = aula.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                      aula.materia.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                      aula.conteudo.toLowerCase().includes(filtroTexto.toLowerCase())
    const matchMateria = filtroMateria === 'todas' || aula.materia === filtroMateria
    return matchTipo && matchTexto && matchMateria
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

  // Visualizar aula
  const visualizarAula = (aula: Aula) => {
    setAulaAtiva(aula)
    // Atualiza visualizações
    const aulasAtualizadas = aulas.map(a => 
      a.id === aula.id ? { ...a, visualizacoes: a.visualizacoes + 1 } : a
    )
    salvarAulas(aulasAtualizadas)
  }

  // Excluir aula
  const excluirAula = (aulaId: string) => {
    const aulasAtualizadas = aulas.filter(a => a.id !== aulaId)
    salvarAulas(aulasAtualizadas)
  }

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'analise': return 'bg-blue-500'
      case 'mapa-mental': return 'bg-green-500'
      case 'podcast': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  // Se uma aula está ativa, mostra o conteúdo da aula
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
            ← Voltar para NotebookLM IA
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${getTipoCor(aulaAtiva.tipo)} rounded-lg text-white`}>
              {getTipoIcon(aulaAtiva.tipo)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{aulaAtiva.titulo}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{aulaAtiva.materia}</span>
                <span>•</span>
                <span>{new Date(aulaAtiva.criadoEm).toLocaleDateString('pt-BR')}</span>
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
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NotebookLM IA
            </h1>
            <p className="text-muted-foreground">
              Transforme seus estudos com IA: mapas mentais, podcasts e análises inteligentes
            </p>
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🚀 Nova API NotebookLM integrada! Análises mais inteligentes e conteúdo otimizado para concursos.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Mapas Mentais
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Headphones className="h-3 w-3" />
            Podcasts IA
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            Vídeos IA
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Análise de Progresso
          </Badge>
          <Badge variant="default" className="flex items-center gap-1 bg-green-600 text-white">
            <Sparkles className="h-3 w-3" />
            NotebookLM API Integrada
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analisar Estudos
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Mapa Mental
          </TabsTrigger>
          <TabsTrigger value="podcast" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            Podcast IA
          </TabsTrigger>
          <TabsTrigger value="video-summary" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Resumo em Vídeo
          </TabsTrigger>
          <TabsTrigger value="minhas-aulas" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Minhas Aulas ({aulas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="mt-6">
          <StudyAnalyzer />
        </TabsContent>

        <TabsContent value="mindmap" className="mt-6">
          <MindMapGenerator />
        </TabsContent>

        <TabsContent value="podcast" className="mt-6">
          <PodcastGenerator />
        </TabsContent>

        <TabsContent value="video-summary" className="mt-6">
          <VideoSummaryGenerator />
        </TabsContent>

        <TabsContent value="minhas-aulas" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Minhas Aulas</h2>
                <p className="text-muted-foreground">
                  Todas as suas aulas criadas e organizadas por disciplina
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Pesquisar aulas..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filtroMateria} onValueChange={setFiltroMateria}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por matéria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as matérias</SelectItem>
                  {Array.from(new Set(aulas.map(a => a.materia))).map(materia => (
                    <SelectItem key={materia} value={materia}>
                      {materia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="analise">Análise de Estudos</SelectItem>
                  <SelectItem value="mapa-mental">Mapa Mental</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Aulas */}
            {aulasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhuma aula encontrada</h3>
                <p className="text-muted-foreground">
                  {aulas.length === 0 
                    ? "Crie sua primeira aula usando uma das ferramentas acima!"
                    : "Tente ajustar os filtros para encontrar suas aulas."
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {aulasFiltradas.map((aula) => (
                  <Card key={aula.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {aula.tipo === 'analise' && <FileText className="h-4 w-4 text-blue-500" />}
                          {aula.tipo === 'mapa-mental' && <Brain className="h-4 w-4 text-green-500" />}
                          {aula.tipo === 'podcast' && <Headphones className="h-4 w-4 text-purple-500" />}
                          <Badge variant={
                            aula.tipo === 'analise' ? 'default' :
                            aula.tipo === 'mapa-mental' ? 'secondary' : 'outline'
                          }>
                            {aula.tipo === 'analise' ? 'Análise' :
                             aula.tipo === 'mapa-mental' ? 'Mapa Mental' : 'Podcast'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{aula.titulo}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{aula.materia}</p>
                        {aula.descricao && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {aula.descricao}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Criada em: {new Date(aula.criadoEm).toLocaleDateString('pt-BR')}</span>
                          {aula.visualizacoes > 0 && (
                            <span>{aula.visualizacoes} visualização{aula.visualizacoes !== 1 ? 'ões' : ''}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => visualizarAula(aula)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => excluirAula(aula.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Brain className="h-5 w-5" />
              Mapas Mentais IA
            </CardTitle>
            <CardDescription>
              Visualize seus estudos em mapas mentais interativos gerados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Conexões inteligentes entre tópicos</li>
              <li>• Hierarquia visual de conceitos</li>
              <li>• Export em alta qualidade</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Headphones className="h-5 w-5" />
              Podcasts de Estudo
            </CardTitle>
            <CardDescription>
              Transforme conteúdos em podcasts narrados com vozes naturais de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Narração com vozes humanas realistas</li>
              <li>• Múltiplos formatos e durações</li>
              <li>• Download para estudo offline</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Video className="h-5 w-5" />
              Resumos em Vídeo
            </CardTitle>
            <CardDescription>
              Crie vídeos educativos personalizados sobre qualquer tópico jurídico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Vídeos gerados com IA avançada</li>
              <li>• Múltiplos formatos: aula, resumo, revisão</li>
              <li>• Qualidade HD e 4K disponível</li>
            </ul>
          </CardContent>
        </Card>        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              Análise Inteligente
            </CardTitle>
            <CardDescription>
              Insights sobre seu progresso e recomendações personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Identificação de pontos fracos</li>
              <li>• Sugestões de melhoria</li>
              <li>• Cronograma otimizado</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}