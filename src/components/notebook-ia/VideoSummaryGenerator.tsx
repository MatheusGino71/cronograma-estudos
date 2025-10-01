'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Video, 
  Play, 
  Pause,
  Download, 
  Share2, 
  Clock, 
  BookOpen,
  Eye,
  Loader2,
  Sparkles,
  Trash2
} from 'lucide-react'

// Componente de Thumbnail para vídeos
interface VideoThumbnailProps {
  video: VideoSummary
}

function VideoThumbnail({ video }: VideoThumbnailProps) {
  const [thumbnailError, setThumbnailError] = useState(false)
  
  const generateCompactThumbnail = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = 320
    canvas.height = 180

    // Background gradient mais sutil
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1e40af')
    gradient.addColorStop(0.5, '#dc2626')
    gradient.addColorStop(1, '#059669')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Overlay suave
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Título compacto
    ctx.fillStyle = 'white'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    
    const title = video.titulo.length > 25 ? video.titulo.substring(0, 22) + '...' : video.titulo
    ctx.fillText(title, canvas.width / 2, 60)

    // Tópico
    ctx.font = '12px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(video.topico, canvas.width / 2, 85)

    // Ícone de play central menor
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2 + 10, 20, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 6, canvas.height / 2 + 4)
    ctx.lineTo(canvas.width / 2 + 8, canvas.height / 2 + 10)
    ctx.lineTo(canvas.width / 2 - 6, canvas.height / 2 + 16)
    ctx.closePath()
    ctx.fill()

    // Badge de qualidade compacto
    ctx.fillStyle = 'rgba(220, 38, 38, 0.9)'
    ctx.fillRect(canvas.width - 60, 10, 50, 20)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 10px Arial'
    ctx.fillText(video.qualidade, canvas.width - 35, 23)

    // Uma disciplina principal
    if (video.disciplinas.length > 0) {
      const disciplina = video.disciplinas[0]
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(10, canvas.height - 25, 120, 15)
      
      ctx.fillStyle = '#fbbf24'
      ctx.font = 'bold 9px Arial'
      ctx.textAlign = 'left'
      const disciplinaText = disciplina.length > 15 ? disciplina.substring(0, 12) + '...' : disciplina
      ctx.fillText(disciplinaText, 15, canvas.height - 13)
    }

    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const thumbnailSrc = generateCompactThumbnail()

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-red-500 to-blue-600">
      {thumbnailSrc && !thumbnailError ? (
        <img 
          src={thumbnailSrc}
          alt={video.titulo}
          className="w-full h-full object-cover"
          onError={() => setThumbnailError(true)}
          onLoad={() => setThumbnailError(false)}
        />
      ) : (
        /* Fallback visual sempre visível */
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="h-8 w-8 mx-auto mb-1 opacity-80" />
            <p className="text-xs font-medium px-2">
              {video.titulo.length > 25 ? video.titulo.substring(0, 22) + '...' : video.titulo}
            </p>
            <p className="text-xs opacity-75 mt-1">{video.duracao}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente do Player de Vídeo
interface VideoPlayerProps {
  video: VideoSummary
}

function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(300) // 5 minutos em segundos como exemplo

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Aqui seria integrado com um player real
    if (!isPlaying) {
      // Simula progresso do vídeo
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(interval)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  // Função para gerar thumbnail dinâmico
  const generateThumbnail = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = 640
    canvas.height = 360

    // Background gradient educativo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1e40af') // blue-800
    gradient.addColorStop(0.3, '#dc2626') // red-600
    gradient.addColorStop(0.7, '#059669') // emerald-600
    gradient.addColorStop(1, '#7c2d12') // red-900

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Padrão de fundo sutil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.fillRect(i, j, 20, 20)
      }
    }

    // Título principal
    ctx.fillStyle = 'white'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    const title = video.titulo.length > 35 ? video.titulo.substring(0, 32) + '...' : video.titulo
    ctx.fillText(title, canvas.width / 2, 120)

    // Subtítulo/tópico
    ctx.font = '20px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(video.topico, canvas.width / 2, 160)

    // Badge de duração
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.fillStyle = 'rgba(220, 38, 38, 0.9)'
    ctx.fillRect(canvas.width - 100, 20, 80, 35)
    ctx.fillStyle = 'white'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(video.duracao + ' min', canvas.width - 60, 42)

    // Badge de qualidade
    ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'
    ctx.fillRect(20, 20, 70, 35)
    ctx.fillStyle = 'white'
    ctx.fillText(video.qualidade, 55, 42)

    // Ícone de play central
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 2
    
    // Círculo do botão play
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2 + 20, 30, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Triângulo do play
    ctx.fillStyle = '#dc2626'
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 8, canvas.height / 2 + 8)
    ctx.lineTo(canvas.width / 2 + 12, canvas.height / 2 + 20)
    ctx.lineTo(canvas.width / 2 - 8, canvas.height / 2 + 32)
    ctx.closePath()
    ctx.fill()

    // Tags de disciplinas na parte inferior
    const disciplinas = video.disciplinas.slice(0, 3)
    disciplinas.forEach((disciplina, index) => {
      const x = 30 + (index * 180)
      const y = canvas.height - 50
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(x - 10, y, 160, 30)
      
      ctx.fillStyle = '#fbbf24'
      ctx.font = 'bold 13px Arial'
      ctx.textAlign = 'left'
      const disciplinaText = disciplina.length > 20 ? disciplina.substring(0, 17) + '...' : disciplina
      ctx.fillText(disciplinaText, x, y + 20)
    })

    // Texto "CONCURSO" no canto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(20, canvas.height - 90, 120, 25)
    ctx.fillStyle = '#22d3ee'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('📚 CONCURSO', 80, canvas.height - 72)

    return canvas.toDataURL('image/jpeg', 0.9)
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Área do vídeo com thumbnail gerado */}
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={generateThumbnail() || undefined}
          alt={video.titulo}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback se a geração da imagem falhar
            e.currentTarget.style.display = 'none'
          }}
        />
        
        {/* Fallback para quando a imagem não carrega */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
          <div className="text-center text-white">
            <button 
              onClick={togglePlay}
              className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors mb-4"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>
            <p className="text-lg font-semibold mb-1">{video.titulo}</p>
            <p className="text-sm opacity-75">
              {isPlaying ? 'Reproduzindo...' : 'Clique para reproduzir'}
            </p>
          </div>
        </div>
        
        {/* Overlay de controles */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <button 
            onClick={togglePlay}
            className="bg-red-600/90 hover:bg-red-700 rounded-full p-3 transition-all transform hover:scale-110"
          >
            {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-0.5" />}
          </button>
        </div>
        
        {/* Badge de qualidade */}
        <div className="absolute top-4 right-4 bg-emerald-600 px-2 py-1 rounded text-white text-sm font-medium">
          {video.qualidade}
        </div>
      </div>

      {/* Controles do player */}
      <div className="bg-gray-900 p-4">
        {/* Barra de progresso */}
        <div className="mb-3">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-red-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="hover:text-red-400 transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="hover:text-red-400 transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="hover:text-red-400 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface VideoSummary {
  id: string
  titulo: string
  topico: string
  duracao: string
  formatoVideo: string
  qualidade: string
  criadoEm: string
  status: 'processando' | 'concluido' | 'erro'
  videoUrl?: string
  thumbnailUrl?: string
  transcricao?: string
  pontosChave: string[]
  disciplinas: string[]
}

export default function VideoSummaryGenerator() {
  const [topico, setTopico] = useState('')
  const [detalhes, setDetalhes] = useState('')
  const [duracao, setDuracao] = useState('5-10')
  const [formatoVideo, setFormatoVideo] = useState('explicativo')
  const [qualidade, setQualidade] = useState('1080p')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [videosSalvos, setVideosSalvos] = useState<VideoSummary[]>([])
  const [videoAtivo, setVideoAtivo] = useState<VideoSummary | null>(null)

  // Carregar vídeos salvos do localStorage com validação robusta
  useEffect(() => {
    const loadVideos = () => {
      try {
        const videosSalvosStorage = localStorage.getItem('mindlegal-videos')
        
        if (!videosSalvosStorage) {
          console.log('Nenhum vídeo salvo encontrado no localStorage')
          return
        }

        const videos = JSON.parse(videosSalvosStorage)
        
        // Validação da estrutura dos dados
        if (!Array.isArray(videos)) {
          console.warn('Dados de vídeos inválidos no localStorage (não é array), limpando...')
          localStorage.removeItem('mindlegal-videos')
          return
        }

        // Filtrar e validar vídeos
        const videosValidados: VideoSummary[] = videos
          .filter((video: unknown) => {
            if (!video || typeof video !== 'object') return false
            const v = video as Record<string, unknown>
            return v.id && v.titulo && v.topico
          })
          .map((video: unknown) => {
            const v = video as Record<string, unknown>
            return {
              ...v,
              pontosChave: Array.isArray(v.pontosChave) ? v.pontosChave : [],
              disciplinas: Array.isArray(v.disciplinas) ? v.disciplinas : [],
              status: (v.status as string) || 'concluido',
              criadoEm: (v.criadoEm as string) || new Date().toISOString()
            } as VideoSummary
          })

        if (videosValidados.length !== videos.length) {
          console.warn(`${videos.length - videosValidados.length} vídeos inválidos foram removidos`)
          localStorage.setItem('mindlegal-videos', JSON.stringify(videosValidados))
        }

        setVideosSalvos(videosValidados)
        console.log(`✅ ${videosValidados.length} vídeos carregados do localStorage`)

      } catch (error) {
        console.error('Erro ao carregar vídeos salvos:', error)
        try {
          localStorage.removeItem('mindlegal-videos')
          console.log('localStorage corrompido foi limpo')
        } catch (clearError) {
          console.error('Erro ao limpar localStorage:', clearError)
        }
      }
    }

    loadVideos()
  }, [])

  // Função para visualizar vídeo
  const visualizarVideo = (video: VideoSummary) => {
    setVideoAtivo(video)
    // Scroll suave para o player
    setTimeout(() => {
      const playerElement = document.getElementById('video-player')
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Função para excluir vídeo com tratamento robusto
  const excluirVideo = (videoId: string) => {
    if (!videoId) {
      console.warn('ID do vídeo não fornecido para exclusão')
      return
    }

    const videoParaExcluir = videosSalvos.find(v => v.id === videoId)
    if (!videoParaExcluir) {
      console.warn('Vídeo não encontrado para exclusão:', videoId)
      return
    }

    const confirmMessage = `Tem certeza que deseja excluir o vídeo "${videoParaExcluir.titulo}"?\n\nEsta ação não pode ser desfeita.`
    
    if (confirm(confirmMessage)) {
      try {
        const novosVideos = videosSalvos.filter(v => v.id !== videoId)
        
        // Atualiza estado
        setVideosSalvos(novosVideos)
        
        // Se o vídeo ativo foi excluído, limpa a visualização
        if (videoAtivo?.id === videoId) {
          setVideoAtivo(null)
        }
        
        // Salva no localStorage com tratamento de erro
        try {
          localStorage.setItem('mindlegal-videos', JSON.stringify(novosVideos))
          console.log('✅ Vídeo excluído com sucesso:', videoId)
        } catch (storageError) {
          console.warn('Erro ao atualizar localStorage após exclusão:', storageError)
          // Estado já foi atualizado, apenas avisa sobre localStorage
        }
        
      } catch (error) {
        console.error('Erro ao excluir vídeo:', error)
        alert('Erro ao excluir vídeo. Tente novamente.')
      }
    }
  }

  const gerarResumoVideo = async () => {
    if (!topico.trim()) {
      alert('Por favor, insira um tópico para gerar o vídeo.')
      return
    }

    // Previne múltiplas chamadas simultâneas
    if (isGenerating) return

    setIsGenerating(true)
    setProgress(0)
    setProgressMessage('Iniciando geração do vídeo...')

    // Controller para cancelar requisição se necessário
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // Timeout de 60s

    try {
      // Progresso inicial
      setProgress(10)
      setProgressMessage('Validando dados e preparando requisição...')

      // Validação adicional
      if (!formatoVideo || !duracao || !qualidade) {
        throw new Error('Parâmetros de configuração inválidos')
      }

      // Progresso: preparando chamada API
      setProgress(20)
      setProgressMessage('Conectando com a API de geração...')
      
      const requestPayload = {
        topico: topico.trim(),
        detalhes: detalhes?.trim() || '',
        duracao,
        formatoVideo,
        qualidade
      }

      console.log('📤 Enviando requisição:', requestPayload)

      // Chamada para API de geração de vídeo com timeout e abort signal
      const response = await fetch('/api/notebook-ia/video-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Verificação detalhada da resposta
      if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (jsonError) {
          console.warn('Erro ao parsear resposta de erro:', jsonError)
        }
        
        throw new Error(errorMessage)
      }

      setProgress(50)
      setProgressMessage('Processando resposta da API...')

      const data = await response.json()

      // Validação da estrutura da resposta
      if (!data || typeof data !== 'object') {
        throw new Error('Resposta da API inválida: dados não encontrados')
      }

      if (!data.success) {
        throw new Error(data.error || 'Falha na geração do vídeo')
      }

      setProgress(75)
      setProgressMessage('Estruturando dados do vídeo...')

      // Validação adicional dos dados recebidos
      const requiredFields = ['titulo', 'script', 'pontosChave', 'disciplinas']
      const missingFields = requiredFields.filter(field => !data[field])
      
      if (missingFields.length > 0) {
        console.warn('Campos ausentes na resposta:', missingFields)
      }

      setProgress(90)
      setProgressMessage('Criando vídeo e salvando dados...')

      // Geração de ID único mais robusto
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const novoVideo: VideoSummary = {
        id: videoId,
        titulo: data.titulo || `${formatoVideo === 'resumo-rapido' ? 'Resumo' : 'Aula'}: ${topico}`,
        topico: topico.trim(),
        duracao: data.duracao || duracao,
        formatoVideo,
        qualidade,
        criadoEm: new Date().toISOString(),
        status: 'concluido',
        videoUrl: data.videoUrl || null, // null ao invés de placeholder
        thumbnailUrl: data.thumbnailUrl || null,
        transcricao: data.script || '', // Usa script como transcrição
        pontosChave: Array.isArray(data.pontosChave) ? data.pontosChave : [],
        disciplinas: Array.isArray(data.disciplinas) ? data.disciplinas : []
      }

      setProgress(95)
      setProgressMessage('Finalizando e exibindo vídeo...')

      // Atualização segura do estado
      const novosVideos = [novoVideo, ...videosSalvos]
      setVideosSalvos(novosVideos)
      setVideoAtivo(novoVideo)

      // Salva no localStorage com tratamento de erro
      try {
        localStorage.setItem('mindlegal-videos', JSON.stringify(novosVideos))
      } catch (storageError) {
        console.warn('Erro ao salvar no localStorage:', storageError)
        // Continua mesmo se não conseguir salvar no localStorage
      }

      setProgress(100)
      setProgressMessage('Vídeo gerado com sucesso!')

      // Limpa o formulário após sucesso
      setTimeout(() => {
        setTopico('')
        setDetalhes('')
        setProgressMessage('')
      }, 1500)

      console.log('✅ Vídeo criado com sucesso:', novoVideo.id)

    } catch (error) {
      console.error('❌ Erro ao gerar vídeo:', error)
      
      // Tratamento específico de diferentes tipos de erro
      let errorMessage = 'Erro desconhecido ao gerar vídeo'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Operação cancelada por timeout (60s). Tente novamente.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
        } else {
          errorMessage = error.message
        }
      }
      
      setProgressMessage(`❌ ${errorMessage}`)
      setProgress(0)
      
      // Remove mensagem de erro após 5 segundos
      setTimeout(() => {
        setProgressMessage('')
      }, 5000)
      
    } finally {
      setIsGenerating(false)
      // Não limpa progress e message imediatamente para mostrar resultado
    }
  }

  const formatosVideo = [
    { value: 'explicativo', label: 'Explicativo Didático' },
    { value: 'resumo-rapido', label: 'Resumo Rápido' },
    { value: 'aula-completa', label: 'Aula Completa' },
    { value: 'revisao', label: 'Revisão para Prova' }
  ]

  const duracoes = [
    { value: '2-5', label: '2-5 minutos' },
    { value: '5-10', label: '5-10 minutos' },
    { value: '10-15', label: '10-15 minutos' },
    { value: '15-20', label: '15-20 minutos' }
  ]

  const qualidades = [
    { value: '720p', label: '720p HD' },
    { value: '1080p', label: '1080p Full HD' },
    { value: '4k', label: '4K Ultra HD' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Video className="h-8 w-8 text-red-600" />
          <h2 className="text-3xl font-bold">Resumos em Vídeo</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transforme qualquer tópico em vídeos educativos personalizados usando IA avançada
        </p>
      </div>

      {/* Formulário de Geração */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Sparkles className="h-5 w-5" />
            Criar Resumo em Vídeo
          </CardTitle>
          <CardDescription>
            Descreva o tópico e personalize seu vídeo educativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tópico Principal</label>
              <Input
                placeholder="Ex: Direito Constitucional - Princípios Fundamentais"
                value={topico}
                onChange={(e) => setTopico(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração</label>
              <Select value={duracao} onValueChange={setDuracao} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {duracoes.map(d => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Detalhes Específicos (Opcional)</label>
            <Textarea
              placeholder="Adicione pontos específicos que devem ser abordados no vídeo..."
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato do Vídeo</label>
              <Select value={formatoVideo} onValueChange={setFormatoVideo} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatosVideo.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualidade</label>
              <Select value={qualidade} onValueChange={setQualidade} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualidades.map(q => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                <span className="text-sm font-medium">{progressMessage}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-muted-foreground text-center">
                {progress}% concluído - Usando Gemini AI + Firebase
              </div>
            </div>
          )}

          <Button 
            onClick={gerarResumoVideo}
            disabled={!topico.trim() || isGenerating}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando Vídeo...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Gerar Resumo em Vídeo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Vídeos Salvos */}
      {videosSalvos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Vídeos Gerados ({videosSalvos.length})
            </CardTitle>
            <CardDescription>
              Seus resumos em vídeo criados com IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videosSalvos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum vídeo encontrado</h3>
                <p className="text-muted-foreground">
                  Crie seu primeiro resumo em vídeo usando o formulário acima!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videosSalvos.map((video) => (
                <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="aspect-video">
                      <VideoThumbnail video={video} />
                    </div>
                    <Badge 
                      className="absolute top-2 right-2 bg-black/70 text-white"
                      variant="secondary"
                    >
                      {video.duracao} min
                    </Badge>
                    {/* Overlay de hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play className="h-8 w-8 text-white bg-red-600 rounded-full p-2" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {video.titulo}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(video.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => visualizarVideo(video)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Assistir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => excluirVideo(video.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Player de Vídeo Ativo */}
      {videoAtivo && (
        <Card className="border-red-200" id="video-player">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {videoAtivo.titulo}
            </CardTitle>
            <CardDescription>
              Vídeo gerado com sucesso • {videoAtivo.duracao} • {videoAtivo.qualidade}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <VideoPlayer video={videoAtivo} />
            
            {videoAtivo.pontosChave.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Pontos-chave abordados:</h4>
                <div className="flex flex-wrap gap-2">
                  {videoAtivo.pontosChave.map((ponto, index) => (
                    <Badge key={index} variant="secondary">
                      {ponto}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {videoAtivo.transcricao && (
              <div>
                <h4 className="font-semibold mb-2">Transcrição:</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                  {videoAtivo.transcricao}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}