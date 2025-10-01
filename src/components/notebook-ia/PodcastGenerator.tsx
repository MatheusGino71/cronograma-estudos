'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotebookIA } from '@/hooks/useNotebookIA'
import { useAdvancedTTS } from '@/hooks/useAdvancedTTS'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Headphones, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Volume2,
  SkipForward,
  SkipBack,
  Mic,
  Users,
  Clock
} from 'lucide-react'

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

export function PodcastGenerator() {
  const [content, setContent] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('conversation')
  const [selectedVoices, setSelectedVoices] = useState('mixed')
  const [speed, setSpeed] = useState([1.0])
  const [podcast, setPodcast] = useState<PodcastData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([80])
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [currentVoiceProvider, setCurrentVoiceProvider] = useState('Web Speech API')
  const [elevenLabsStatus, setElevenLabsStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  const audioRef = useRef<HTMLAudioElement>(null)
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null)
  const { isLoading: isGenerating, generatePodcast: generateWithIA } = useNotebookIA()
  const { 
    playAudio, 
    availableVoices: advancedVoices,
    isLoading: isTTSLoading,
    error: ttsError
  } = useAdvancedTTS()

  const podcastStyles = {
    conversation: 'Conversa Natural',
    interview: 'Entrevista',
    explanation: 'Explicação Detalhada',
    debate: 'Debate Acadêmico',
    summary: 'Resumo Rápido'
  }

  const voiceOptions = {
    mixed: 'Vozes Masculina e Feminina',
    male: 'Duas Vozes Masculinas',
    female: 'Duas Vozes Femininas',
    single: 'Voz Única (Narração)'
  }

  const generatePodcast = async () => {
    if (!content.trim()) return

    const result = await generateWithIA(content, selectedStyle, selectedVoices)
    
    if (result.success && result.data) {
      const podcastData = result.data as PodcastData
      setPodcast(podcastData)
      // Calcula duração total baseada nos segmentos
      const totalDuration = podcastData.segments.reduce((acc, segment) => acc + segment.duration, 0)
      setDuration(totalDuration)
    } else {
      // Fallback para dados mockados
      const mockPodcast: PodcastData = {
        title: 'Resumo de Estudos - Matemática Básica',
        duration: '12:45',
        speakers: ['Ana (Professora)', 'Carlos (Estudante)'],
        segments: [
          {
            speaker: 'Ana',
            text: 'Olá, Carlos! Hoje vamos revisar os conceitos fundamentais de matemática que você estudou. Vamos começar falando sobre álgebra.',
            timestamp: '00:00',
            duration: 8
          },
          {
            speaker: 'Carlos',
            text: 'Ótimo, Ana! Eu tenho algumas dúvidas sobre equações de segundo grau. Você poderia me explicar novamente?',
            timestamp: '00:08',
            duration: 6
          },
          {
            speaker: 'Ana',
            text: 'Claro! As equações de segundo grau têm a forma ax² + bx + c = 0. O importante é lembrar da fórmula de Bhaskara para encontrar as raízes.',
            timestamp: '00:14',
            duration: 12
          }
        ]
      }
      setPodcast(mockPodcast)
      setDuration(765)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      // Usar TTS para reprodução
      playPodcastWithTTS()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !audioRef.current) {
      // Simulação de progresso
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // Inicializa Web Speech API e testa ElevenLabs
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis
      
      // Força o carregamento das vozes (necessário em alguns navegadores)
      const loadVoices = () => {
        const voices = speechSynthesis.current?.getVoices()
        if (voices && voices.length > 0) {
          console.log('Vozes carregadas:', voices.filter(v => v.lang.includes('pt')).length, 'em português')
        }
      }
      
      // Carrega vozes imediatamente
      loadVoices()
      
      // Também escuta o evento de carregamento de vozes
      if (speechSynthesis.current) {
        speechSynthesis.current.onvoiceschanged = loadVoices
      }
    }
    
    // Testa conectividade com ElevenLabs
    testElevenLabsConnectivity()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const testElevenLabsConnectivity = async () => {
    setElevenLabsStatus('checking')
    try {
      const response = await fetch('/api/tts/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Olá! Este é um teste das vozes premium do ElevenLabs. Se você está ouvindo isso, significa que as vozes de alta qualidade estão funcionando perfeitamente.',
          voiceId: 'female',
          apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_KEY || 'sk_b0a1f886f2b702f29cc30d2ac2790081640a7ced65d3331b'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.audioUrl) {
          setElevenLabsStatus('available')
          setCurrentVoiceProvider('ElevenLabs AI (Premium)')
          console.log('✅ ElevenLabs conectado com sucesso!')
          
          // Reproduz o teste automaticamente
          await playAudio(data.audioUrl)
        }
      } else {
        const error = await response.json()
        setElevenLabsStatus('unavailable')
        setCurrentVoiceProvider('Web Speech API (Sistema)')
        console.log('⚠️ ElevenLabs não disponível:', error.error)
      }
    } catch (error) {
      setElevenLabsStatus('unavailable')
      setCurrentVoiceProvider('Web Speech API (Sistema)')
      console.log('❌ Erro ao conectar com ElevenLabs:', error)
    }
  }

  const testVoices = async () => {
    await testElevenLabsConnectivity()
  }

  // Função para obter vozes disponíveis em português do Brasil
  const getVoices = () => {
    if (!speechSynthesis.current) return []
    const allVoices = speechSynthesis.current.getVoices()
    
    // Filtra vozes em português do Brasil
    const portugueseVoices = allVoices.filter(voice => 
      voice.lang.includes('pt-BR') || 
      voice.lang.includes('pt-PT') || 
      voice.lang.includes('pt') ||
      voice.name.toLowerCase().includes('portuguese') ||
      voice.name.toLowerCase().includes('brasil') ||
      voice.name.toLowerCase().includes('brazil')
    )
    
    // Se não encontrar vozes em português, retorna as vozes padrão mas priorizará português quando disponível
    return portugueseVoices.length > 0 ? portugueseVoices : allVoices
  }

  // Função para selecionar voz baseada no speaker (apenas português do Brasil)
  const selectVoice = (speakerName: string) => {
    const voices = getVoices()
    
    // Filtra vozes femininas em português
    const femaleVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase()
      const lang = voice.lang.toLowerCase()
      return (
        (lang.includes('pt-br') || lang.includes('pt-pt') || lang.includes('pt')) &&
        (name.includes('female') || 
         name.includes('woman') ||
         name.includes('maria') ||
         name.includes('ana') ||
         name.includes('lucia') ||
         name.includes('helena') ||
         name.includes('fernanda') ||
         name.includes('gabriela'))
      )
    })
    
    // Filtra vozes masculinas em português
    const maleVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase()
      const lang = voice.lang.toLowerCase()
      return (
        (lang.includes('pt-br') || lang.includes('pt-pt') || lang.includes('pt')) &&
        (name.includes('male') || 
         name.includes('man') ||
         name.includes('carlos') ||
         name.includes('pedro') ||
         name.includes('joão') ||
         name.includes('ricardo') ||
         name.includes('marcos') ||
         name.includes('daniel'))
      )
    })

    // Determina se é voz feminina baseado no nome do speaker
    const isFemale = speakerName.toLowerCase().includes('ana') || 
                     speakerName.toLowerCase().includes('maria') ||
                     speakerName.toLowerCase().includes('professora') ||
                     speakerName.toLowerCase().includes('helena') ||
                     speakerName.toLowerCase().includes('lucia')

    if (selectedVoices === 'mixed') {
      if (isFemale) {
        return femaleVoices[0] || voices.find(v => v.lang.includes('pt')) || voices[0]
      } else {
        return maleVoices[0] || voices.find(v => v.lang.includes('pt')) || voices[0]
      }
    } else if (selectedVoices === 'female') {
      return femaleVoices[0] || voices.find(v => v.lang.includes('pt')) || voices[0]
    } else if (selectedVoices === 'male') {
      return maleVoices[0] || voices.find(v => v.lang.includes('pt')) || voices[0]
    } else {
      // single voice - prioriza português
      return voices.find(v => v.lang.includes('pt-br')) || 
             voices.find(v => v.lang.includes('pt')) || 
             voices[0]
    }
  }

  // Função para reproduzir segmento com TTS avançado
  const playSegmentWithTTS = async (segment: PodcastSegment, index: number) => {
    setCurrentSegmentIndex(index)
    setIsPlaying(true)

    try {
      // Determina a voz baseado no speaker
      const isFemale = segment.speaker.toLowerCase().includes('ana') || 
                      segment.speaker.toLowerCase().includes('carla') ||
                      segment.speaker.toLowerCase().includes('maria') ||
                      segment.speaker.toLowerCase().includes('professora')
      
      // Mapear vozes ElevenLabs específicas
      const voiceMapping: Record<string, string> = {
        'female': 'ElevenLabs-Alice',
        'male': 'ElevenLabs-Clyde'
      }

      const selectedVoice = voiceMapping[isFemale ? 'female' : 'male']
      
      console.log(`🎙️ FORÇANDO uso do ElevenLabs - Voz: ${selectedVoice} para speaker: ${segment.speaker}`)
      
      // Sempre tentar ElevenLabs primeiro
      const response = await fetch('/api/tts/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: segment.text,
          voiceId: isFemale ? 'female' : 'male',
          apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_KEY || 'sk_b0a1f886f2b702f29cc30d2ac2790081640a7ced65d3331b',
          model: 'eleven_multilingual_v2',
          stability: 0.5,
          similarity_boost: 0.8
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.audioUrl) {
          console.log(`✅ SUCESSO ElevenLabs - ${data.charactersUsed} chars - Voz: ${selectedVoice}`)
          setCurrentVoiceProvider('ElevenLabs AI (Premium)')
          await playAudio(data.audioUrl)
          
          // Reproduz próximo segmento após terminar
          if (podcast && index < podcast.segments.length - 1) {
            setTimeout(() => {
              playSegmentWithTTS(podcast.segments[index + 1], index + 1)
            }, 1200) // Pausa maior entre segmentos
          } else {
            setIsPlaying(false)
            setCurrentSegmentIndex(0)
          }
          return
        }
      } else {
        const error = await response.json()
        console.error('❌ ElevenLabs FALHOU:', error.error || response.statusText)
      }

      // Fallback para Web Speech API apenas se ElevenLabs falhar
      console.log('🔄 Fallback para Web Speech API')
      setCurrentVoiceProvider('Web Speech API (Sistema)')
      playSegmentWithWebSpeech(segment, index)
      
    } catch (error) {
      console.error('Erro na reprodução avançada:', error)
      // Fallback para Web Speech API
      playSegmentWithWebSpeech(segment, index)
    }
  }

  // Função fallback com Web Speech API
  const playSegmentWithWebSpeech = (segment: PodcastSegment, index: number) => {
    if (!speechSynthesis.current) {
      console.warn('Speech synthesis não está disponível')
      setIsPlaying(false)
      return
    }

    // Para qualquer reprodução anterior
    speechSynthesis.current.cancel()

    const utterance = new SpeechSynthesisUtterance(segment.text)
    const selectedVoice = selectVoice(segment.speaker)
    
    // Configure voz em português do Brasil
    if (selectedVoice) {
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang || 'pt-BR'
    } else {
      utterance.lang = 'pt-BR'
    }
    
    utterance.rate = speed[0]
    utterance.volume = volume[0] / 100
    
    // Ajusta pitch baseado no gênero do speaker
    const isFemale = segment.speaker.toLowerCase().includes('ana') || 
                     segment.speaker.toLowerCase().includes('maria') ||
                     segment.speaker.toLowerCase().includes('professora')
    utterance.pitch = isFemale ? 1.1 : 0.9

    utterance.onstart = () => {
      setCurrentSegmentIndex(index)
      setIsPlaying(true)
    }

    utterance.onend = () => {
      // Reproduz próximo segmento automaticamente
      if (podcast && index < podcast.segments.length - 1) {
        setTimeout(() => {
          playSegmentWithTTS(podcast.segments[index + 1], index + 1)
        }, 500)
      } else {
        setIsPlaying(false)
        setCurrentSegmentIndex(0)
      }
    }

    utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event)
      setIsPlaying(false)
    }

    currentUtterance.current = utterance
    speechSynthesis.current.speak(utterance)
  }

  // Função para reproduzir todo o podcast com TTS
  const playPodcastWithTTS = () => {
    if (!podcast || podcast.segments.length === 0) return

    if (isPlaying) {
      // Parar reprodução
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel()
      }
      setIsPlaying(false)
      setCurrentSegmentIndex(0)
    } else {
      // Iniciar reprodução
      playSegmentWithTTS(podcast.segments[0], 0)
    }
  }

  // Função para pular para próximo segmento
  const skipToNextSegment = () => {
    if (!podcast) return
    
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel()
    }

    const nextIndex = currentSegmentIndex + 1
    if (nextIndex < podcast.segments.length) {
      playSegmentWithTTS(podcast.segments[nextIndex], nextIndex)
    } else {
      setIsPlaying(false)
      setCurrentSegmentIndex(0)
    }
  }

  // Função para voltar ao segmento anterior
  const skipToPreviousSegment = () => {
    if (!podcast) return
    
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel()
    }

    const prevIndex = Math.max(0, currentSegmentIndex - 1)
    playSegmentWithTTS(podcast.segments[prevIndex], prevIndex)
  }

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Gerador de Podcast IA
            <Badge variant="secondary" className="text-xs">
              🎙️ {currentVoiceProvider}
            </Badge>
            {isTTSLoading && (
              <Badge variant="outline" className="text-xs animate-pulse">
                ⏳ Processando...
              </Badge>
            )}
            {elevenLabsStatus === 'checking' && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                🔍 Testando ElevenLabs...
              </Badge>
            )}
            {elevenLabsStatus === 'available' && (
              <Badge variant="default" className="text-xs bg-purple-600">
                ✅ ElevenLabs Ativo
              </Badge>
            )}
            {elevenLabsStatus === 'unavailable' && (
              <Badge variant="destructive" className="text-xs">
                ❌ ElevenLabs Offline
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Transforme seus conteúdos em podcasts narrados por vozes artificiais em português do Brasil
            <span className="block text-xs text-green-600 mt-1">
              ✓ {advancedVoices.length > 0 ? `${advancedVoices.length} vozes neurais disponíveis` : `${getVoices().length} vozes do sistema`}
              {currentVoiceProvider.includes('ElevenLabs') && (
                <span className="text-purple-600 ml-1">• Qualidade Ultra Premium 🚀</span>
              )}
              {currentVoiceProvider.includes('Google') && (
                <span className="text-blue-600 ml-1">• Google Cloud TTS 🌟</span>
              )}
            </span>
            {ttsError && (
              <span className="block text-xs text-red-600 mt-1">
                ⚠️ {ttsError} - Usando fallback
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Descreva o conteúdo que deseja transformar em podcast..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estilo do Podcast</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(podcastStyles).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Vozes</label>
              <Select value={selectedVoices} onValueChange={setSelectedVoices}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(voiceOptions).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {speechSynthesis.current && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    const testText = "Olá! Esta é uma demonstração da voz selecionada para o podcast em português do Brasil."
                    const utterance = new SpeechSynthesisUtterance(testText)
                    const voice = selectVoice("Ana (Teste)")
                    
                    if (voice) {
                      utterance.voice = voice
                      utterance.lang = voice.lang || 'pt-BR'
                    } else {
                      utterance.lang = 'pt-BR'
                    }
                    
                    utterance.rate = speed[0]
                    utterance.volume = volume[0] / 100
                    utterance.pitch = 1.1 // Voz feminina para teste
                    speechSynthesis.current?.speak(utterance)
                  }}
                  disabled={isPlaying}
                >
                  🔊 Testar Voz
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Velocidade de Fala: {speed[0]}x
            </label>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={generatePodcast}
            disabled={!content.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Gerando Podcast...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Gerar Podcast
              </>
            )}
          </Button>
          
          <Button
            onClick={testVoices}
            variant="outline"
            disabled={elevenLabsStatus === 'checking'}
            className="w-full mt-2"
          >
            {elevenLabsStatus === 'checking' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                Testando Vozes...
              </>
            ) : (
              <>
                <Headphones className="h-4 w-4 mr-2" />
                Testar Vozes ElevenLabs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Podcast Player */}
      {podcast && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  {podcast.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {podcast.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {podcast.speakers.length} vozes
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Player Controls */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipToPreviousSegment}
                  disabled={currentSegmentIndex === 0}
                  title="Segmento anterior"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePlayPause}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipToNextSegment}
                  disabled={podcast && currentSegmentIndex >= podcast.segments.length - 1}
                  title="Próximo segmento"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-20"
                    title={`Volume: ${volume[0]}%`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Progress value={(currentTime / duration) * 100} className="w-full" />
              </div>
            </div>

            {/* Speakers */}
            <div>
              <h4 className="font-semibold mb-2">Participantes</h4>
              <div className="flex flex-wrap gap-2">
                {podcast.speakers.map((speaker, index) => (
                  <Badge key={index} variant="secondary">
                    {speaker}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Segmento Atual */}
            {isPlaying && podcast.segments[currentSegmentIndex] && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">Reproduzindo agora</span>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    {podcast.segments[currentSegmentIndex].speaker}
                  </Badge>
                  <p className="text-sm leading-relaxed">
                    {podcast.segments[currentSegmentIndex].text}
                  </p>
                </div>
              </div>
            )}

            {/* Transcript */}
            <div>
              <h4 className="font-semibold mb-3">Transcrição Completa</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-lg">
                {podcast.segments.map((segment, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-3 p-2 rounded ${
                      currentSegmentIndex === index && isPlaying 
                        ? 'bg-blue-100 border border-blue-200' 
                        : 'hover:bg-slate-100'
                    } cursor-pointer transition-colors`}
                    onClick={() => {
                      if (speechSynthesis.current) {
                        speechSynthesis.current.cancel()
                      }
                      playSegmentWithTTS(segment, index)
                    }}
                    title="Clique para reproduzir este segmento"
                  >
                    <Badge variant="outline" className="min-w-fit">
                      {segment.timestamp}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-purple-600 mb-1">
                        {segment.speaker}:
                      </div>
                      <p className="text-sm text-gray-700">{segment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio element (hidden) */}
      <audio ref={audioRef} style={{ display: 'none' }}>
        {/* Aqui seria carregado o áudio real quando disponível */}
      </audio>
    </div>
  )
}