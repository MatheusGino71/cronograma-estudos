import { useState, useCallback } from 'react'
import { getBestTTSProvider, getAvailableVoices, selectVoiceByGender, type TTSVoice } from '@/lib/tts-service'

interface UseAdvancedTTSReturn {
  isLoading: boolean
  error: string | null
  availableVoices: TTSVoice[]
  generateAudio: (text: string, gender: 'male' | 'female') => Promise<string | null>
  recognizeSpeech: (audioBlob: Blob) => Promise<string | null>
  playAudio: (audioUrl: string) => Promise<void>
  currentProvider: string
}

export function useAdvancedTTS(): UseAdvancedTTSReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const provider = getBestTTSProvider()
  const availableVoices = getAvailableVoices()

  const generateAudio = useCallback(async (text: string, gender: 'male' | 'female'): Promise<string | null> => {
    if (!text.trim()) return null
    
    setIsLoading(true)
    setError(null)

    try {
      // Seleciona a melhor voz disponível para o gênero
      const voice = selectVoiceByGender(gender)
      if (!voice) {
        throw new Error('Nenhuma voz disponível')
      }

      // Verifica APIs disponíveis
      const hasGoogleKey = process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY
      const hasElevenLabsKey = process.env.NEXT_PUBLIC_ELEVENLABS_KEY

      // Prioriza ElevenLabs (melhor qualidade)
      if (hasElevenLabsKey && voice.provider === 'elevenlabs') {
        const response = await fetch('/api/tts/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId: gender,
            apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_KEY
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.audioUrl) {
            return data.audioUrl
          }
        }
      }

      if (hasGoogleKey && voice.provider === 'google') {
        // Usa Google Text-to-Speech API
        const response = await fetch('/api/tts/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId: voice.id,
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.audioUrl) {
            return data.audioUrl
          }
        }
      }

      // Fallback para Web Speech API
      return null // Indica que deve usar Web Speech API
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar áudio')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recognizeSpeech = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    try {
      // Converte o blob para base64
      const reader = new FileReader()
      const audioContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          // Remove o prefixo data:audio/...;base64,
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      const hasGoogleKey = process.env.NEXT_PUBLIC_GOOGLE_SPEECH_KEY || process.env.NEXT_PUBLIC_GOOGLE_TTS_KEY

      if (hasGoogleKey) {
        const response = await fetch('/api/speech/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioContent,
            apiKey: hasGoogleKey,
            config: {
              enableAutomaticPunctuation: true,
              encoding: 'WEBM_OPUS',
              languageCode: 'pt-BR',
              model: 'latest_long',
              useEnhanced: true
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          return data.transcript || null
        }
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reconhecer fala')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const playAudio = useCallback(async (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      
      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error('Erro ao reproduzir áudio'))
      
      audio.play().catch(reject)
    })
  }, [])

  return {
    isLoading,
    error,
    availableVoices,
    generateAudio,
    recognizeSpeech,
    playAudio,
    currentProvider: provider.name
  }
}