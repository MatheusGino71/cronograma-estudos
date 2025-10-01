'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useNotebookIA } from '@/hooks/useNotebookIA'
import { 
  Headphones, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Volume2,
  Sparkles,
  FileText,
  Mic,
  Users,
  Clock,
  Loader2
} from 'lucide-react'
import { Discipline } from '@/types'

interface PodcastData {
  title: string
  duration: string
  speakers: string[]
  segments: PodcastSegment[]
  audioUrl?: string
}

interface PodcastSegment {
  speaker: string
  text: string
  timestamp: string
  duration: number
}

interface DisciplinePodcastGeneratorProps {
  discipline: Discipline
  compact?: boolean
}

export function DisciplinePodcastGenerator({ discipline, compact = false }: DisciplinePodcastGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('conversation')
  const [selectedVoices, setSelectedVoices] = useState('mixed')
  const [podcast, setPodcast] = useState<PodcastData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  const { isLoading: isGenerating, generatePodcast: generateWithIA } = useNotebookIA()

  const podcastStyles = {
    conversation: 'Conversa Natural entre Professor e Aluno',
    interview: 'Entrevista com Especialista',
    explanation: 'Explicação Detalhada do Conteúdo',
    debate: 'Debate Acadêmico sobre o Tema',
    summary: 'Resumo Rápido dos Pontos Principais'
  }

  const voiceOptions = {
    mixed: 'Professor (Masculino) e Aluna (Feminino)',
    male: 'Dois Professores (Masculino)',
    female: 'Duas Professoras (Feminino)',
    single: 'Narrador Único'
  }

  // Pré-popula o conteúdo com informações da disciplina
  const handleOpenDialog = () => {
    if (!content) {
      const disciplineContent = `
Disciplina: ${discipline.name}
Banca: ${discipline.board}
Nível: ${discipline.level}
Descrição: ${discipline.description}

Tópicos principais para abordar no podcast:
- Conceitos fundamentais da disciplina
- Pontos mais importantes para concursos
- Dicas de estudo e memorização
- Exercícios práticos
- Jurisprudência relevante (se aplicável)

${discipline.materials ? `
Material disponível:
- Vídeos: ${discipline.materials.videos || 0}
- PDFs: ${discipline.materials.pdfs || 0}
- Exercícios: ${discipline.materials.exercises || 0}
` : ''}

Por favor, crie um podcast educativo e envolvente sobre esta disciplina.
      `.trim()
      
      setContent(disciplineContent)
    }
    setIsOpen(true)
  }

  const generatePodcast = async () => {
    if (!content.trim()) return

    setGenerationProgress(0)
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const result = await generateWithIA(content, selectedStyle, selectedVoices)
      
      clearInterval(progressInterval)
      setGenerationProgress(100)
      
      if (result.success && result.data) {
        const podcastData = result.data as PodcastData
        setPodcast(podcastData)
      } else {
        // Gera um podcast mockado específico para a disciplina
        const mockPodcast: PodcastData = {
          title: `Podcast Educativo - ${discipline.name}`,
          duration: '15:30',
          speakers: ['Prof. Marina (Especialista)', 'João (Estudante)'],
          segments: [
            {
              speaker: 'Prof. Marina',
              text: `Olá, João! Hoje vamos explorar os conceitos fundamentais de ${discipline.name}. Esta é uma disciplina ${discipline.level.toLowerCase()} e muito importante para concursos públicos.`,
              timestamp: '00:00',
              duration: 12
            },
            {
              speaker: 'João',
              text: `Perfeito, professora! Eu estou estudando esta matéria há algumas semanas. Quais são os pontos mais cobrados em provas?`,
              timestamp: '00:12',
              duration: 8
            },
            {
              speaker: 'Prof. Marina',
              text: `Excelente pergunta! Em ${discipline.name}, os examinadores costumam focar em aspectos práticos e teóricos fundamentais. Vamos abordar cada um deles de forma didática.`,
              timestamp: '00:20',
              duration: 10
            },
            {
              speaker: 'João',
              text: `Isso é muito útil! Você tem alguma dica de como memorizar melhor esses conceitos?`,
              timestamp: '00:30',
              duration: 6
            },
            {
              speaker: 'Prof. Marina',
              text: `Sim! Uma técnica muito eficaz é criar mapas mentais e fazer exercícios práticos regularmente. Também recomendo revisar o conteúdo em intervalos espaçados.`,
              timestamp: '00:36',
              duration: 12
            }
          ]
        }
        setPodcast(mockPodcast)
      }
    } catch (error) {
      console.error('Erro ao gerar podcast:', error)
      clearInterval(progressInterval)
      setGenerationProgress(0)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Aqui você implementaria a lógica real de reprodução de áudio
  }

  const downloadPodcast = () => {
    // Implementar download do podcast
    console.log('Download do podcast iniciado...')
  }

  const sharePodcast = () => {
    // Implementar compartilhamento
    console.log('Compartilhar podcast...')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpenDialog}
          className={compact 
            ? "h-6 px-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            : "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          }
          size={compact ? "sm" : "default"}
        >
          <Headphones className={compact ? "h-3 w-3" : "mr-2 h-4 w-4"} />
          {!compact && "Gerar Podcast com IA"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Gerador de Podcast - {discipline.name}
          </DialogTitle>
          <DialogDescription>
            Transforme o conteúdo da disciplina em um podcast educativo com IA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!podcast ? (
            <>
              {/* Configurações do Podcast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estilo do Podcast</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(podcastStyles).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Vozes</label>
                  <Select value={selectedVoices} onValueChange={setSelectedVoices}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(voiceOptions).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conteúdo do Podcast */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Conteúdo para o Podcast</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva o conteúdo que você quer transformar em podcast..."
                  className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  O conteúdo foi pré-preenchido com informações da disciplina. Você pode editar conforme necessário.
                </p>
              </div>

              {/* Botão de Gerar */}
              <div className="flex justify-center">
                <Button 
                  onClick={generatePodcast}
                  disabled={isGenerating || !content.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Podcast...
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Gerar Podcast
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bar durante geração */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gerando seu podcast educativo...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}
            </>
          ) : (
            /* Podcast Gerado */
            <div className="space-y-6">
              {/* Header do Podcast */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5 text-purple-500" />
                        {podcast.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {podcast.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {podcast.speakers.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadPodcast}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={sharePodcast}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Player Controls */}
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayPause}
                      className="h-12 w-12"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <div className="flex-1">
                      <Progress value={30} className="w-full h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>02:15</span>
                        <span>{podcast.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <div className="w-16">
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transcrição */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Transcrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {podcast.segments.map((segment, index) => (
                      <div key={index} className="flex gap-3">
                        <Badge variant="outline" className="shrink-0">
                          {segment.timestamp}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-purple-600 mb-1">
                            {segment.speaker}
                          </div>
                          <p className="text-sm leading-relaxed">{segment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Botão para gerar novo podcast */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setPodcast(null)}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Novo Podcast
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}