// Serviço de Text-to-Speech com APIs externas
export interface TTSProvider {
  name: string
  available: boolean
  generateAudio: (text: string, voice: string) => Promise<string | null>
}

export interface TTSVoice {
  id: string
  name: string
  gender: 'male' | 'female'
  language: 'pt-BR'
  provider: string
  neural?: boolean
}

// Configuração das APIs (usuário precisa adicionar suas chaves)
const API_KEYS = {
  GOOGLE_TTS: process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY || '',
  ELEVENLABS: process.env.NEXT_PUBLIC_ELEVENLABS_KEY || '',
  AZURE_TTS: process.env.NEXT_PUBLIC_AZURE_TTS_KEY || '',
  AZURE_REGION: process.env.NEXT_PUBLIC_AZURE_REGION || 'brazilsouth'
}

// Vozes disponíveis por provider
export const AVAILABLE_VOICES: TTSVoice[] = [
  // Google Cloud TTS
  {
    id: 'pt-BR-Wavenet-A',
    name: 'Camila (Google Neural)',
    gender: 'female',
    language: 'pt-BR',
    provider: 'google',
    neural: true
  },
  {
    id: 'pt-BR-Wavenet-B',
    name: 'Carlos (Google Neural)',
    gender: 'male',
    language: 'pt-BR',
    provider: 'google',
    neural: true
  },
  {
    id: 'pt-BR-Neural2-A',
    name: 'Ana (Google Neural2)',
    gender: 'female',
    language: 'pt-BR',
    provider: 'google',
    neural: true
  },
  {
    id: 'pt-BR-Neural2-B',
    name: 'Bruno (Google Neural2)',
    gender: 'male',
    language: 'pt-BR',
    provider: 'google',
    neural: true
  },
  // Azure Cognitive Services
  {
    id: 'pt-BR-FranciscaNeural',
    name: 'Francisca (Azure Neural)',
    gender: 'female',
    language: 'pt-BR',
    provider: 'azure',
    neural: true
  },
  {
    id: 'pt-BR-AntonioNeural',
    name: 'Antonio (Azure Neural)',
    gender: 'male',
    language: 'pt-BR',
    provider: 'azure',
    neural: true
  },
  // ElevenLabs - Vozes Premium
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Alice (ElevenLabs Premium)',
    gender: 'female',
    language: 'pt-BR',
    provider: 'elevenlabs',
    neural: true
  },
  {
    id: '2EiwWnXFnvU5JabPnv8n',
    name: 'Clyde (ElevenLabs Premium)',
    gender: 'male',
    language: 'pt-BR',
    provider: 'elevenlabs',
    neural: true
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella (ElevenLabs Premium)',
    gender: 'female',
    language: 'pt-BR',
    provider: 'elevenlabs',
    neural: true
  },
  {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold (ElevenLabs Premium)',
    gender: 'male',
    language: 'pt-BR',
    provider: 'elevenlabs',
    neural: true
  }
]

// Provider Google Cloud TTS
export const GoogleTTSProvider: TTSProvider = {
  name: 'Google Cloud TTS',
  available: !!API_KEYS.GOOGLE_TTS,
  generateAudio: async (text: string, voiceId: string): Promise<string | null> => {
    if (!API_KEYS.GOOGLE_TTS) return null

    try {
      const response = await fetch('/api/tts/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId,
          apiKey: API_KEYS.GOOGLE_TTS
        })
      })

      if (!response.ok) throw new Error('Google TTS failed')
      
      const data = await response.json()
      return data.audioContent ? `data:audio/mp3;base64,${data.audioContent}` : null
    } catch (error) {
      console.error('Google TTS error:', error)
      return null
    }
  }
}

// Provider Azure Cognitive Services
export const AzureTTSProvider: TTSProvider = {
  name: 'Azure Cognitive Services',
  available: !!API_KEYS.AZURE_TTS,
  generateAudio: async (text: string, voiceId: string): Promise<string | null> => {
    if (!API_KEYS.AZURE_TTS) return null

    try {
      const response = await fetch('/api/tts/azure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId,
          apiKey: API_KEYS.AZURE_TTS,
          region: API_KEYS.AZURE_REGION
        })
      })

      if (!response.ok) throw new Error('Azure TTS failed')
      
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Azure TTS error:', error)
      return null
    }
  }
}

// Provider ElevenLabs
export const ElevenLabsProvider: TTSProvider = {
  name: 'ElevenLabs',
  available: !!API_KEYS.ELEVENLABS,
  generateAudio: async (text: string, voiceId: string): Promise<string | null> => {
    if (!API_KEYS.ELEVENLABS) return null

    try {
      const response = await fetch('/api/tts/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId,
          apiKey: API_KEYS.ELEVENLABS
        })
      })

      if (!response.ok) throw new Error('ElevenLabs TTS failed')
      
      const data = await response.json()
      return data.audioUrl || null
    } catch (error) {
      console.error('ElevenLabs TTS error:', error)
      return null
    }
  }
}

// Fallback para Web Speech API
export const WebSpeechProvider: TTSProvider = {
  name: 'Web Speech API',
  available: typeof window !== 'undefined' && 'speechSynthesis' in window,
  generateAudio: async (_text: string, _voiceId: string): Promise<string | null> => {
    // Retorna null pois Web Speech API não gera arquivos de áudio
    // Será usado como fallback para reprodução direta
    return null
  }
}

// Lista de providers em ordem de preferência
export const TTS_PROVIDERS = [
  ElevenLabsProvider,
  GoogleTTSProvider,
  AzureTTSProvider,
  WebSpeechProvider
]

// Função para obter o melhor provider disponível
export const getBestTTSProvider = (): TTSProvider => {
  return TTS_PROVIDERS.find(provider => provider.available) || WebSpeechProvider
}

// Função para obter vozes disponíveis baseado nos providers ativos
export const getAvailableVoices = (): TTSVoice[] => {
  const activeProviders = TTS_PROVIDERS.filter(p => p.available).map(p => p.name.toLowerCase())
  
  return AVAILABLE_VOICES.filter(voice => {
    if (voice.provider === 'google') return activeProviders.includes('google cloud tts')
    if (voice.provider === 'azure') return activeProviders.includes('azure cognitive services')
    if (voice.provider === 'elevenlabs') return activeProviders.includes('elevenlabs')
    return true // Web Speech sempre disponível
  })
}

// Função para selecionar voz baseada no gênero
export const selectVoiceByGender = (gender: 'male' | 'female', provider?: string): TTSVoice | null => {
  const availableVoices = getAvailableVoices()
  
  if (provider) {
    const providerVoices = availableVoices.filter(v => v.provider === provider && v.gender === gender)
    if (providerVoices.length > 0) return providerVoices[0]
  }
  
  const genderVoices = availableVoices.filter(v => v.gender === gender)
  return genderVoices.length > 0 ? genderVoices[0] : availableVoices[0] || null
}