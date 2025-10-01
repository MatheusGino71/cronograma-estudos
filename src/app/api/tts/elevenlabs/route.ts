import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, apiKey } = await request.json()

    // Usa a chave do request ou do ambiente
    const elevenLabsKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_KEY || 'sk_b0a1f886f2b702f29cc30d2ac2790081640a7ced65d3331b'

    if (!elevenLabsKey) {
      return NextResponse.json({ error: 'API key do ElevenLabs é obrigatória' }, { status: 400 })
    }

    if (!text) {
      return NextResponse.json({ error: 'Texto é obrigatório' }, { status: 400 })
    }

    // IDs de vozes padrão do ElevenLabs em português
    const defaultVoices = {
      'elevenlabs-female-pt': 'pNInz6obpgDQGcFmaJgB', // Alice
      'elevenlabs-male-pt': '2EiwWnXFnvU5JabPnv8n', // Clyde
      'female': 'pNInz6obpgDQGcFmaJgB',
      'male': '2EiwWnXFnvU5JabPnv8n'
    }

    const selectedVoiceId = defaultVoices[voiceId as keyof typeof defaultVoices] || defaultVoices.female

    // Configuração da requisição para ElevenLabs
    const requestBody = {
      text: text,
      model_id: "eleven_multilingual_v2", // Modelo multilíngue que suporta português
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.8,
        style: 0.5,
        use_speaker_boost: true
      }
    }

    // Chamada para ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🚨 ElevenLabs API Error:')
      console.error('Status:', response.status)
      console.error('Response:', errorText)
      console.error('Voice ID usado:', selectedVoiceId)
      console.error('Texto length:', text.length)
      
      let errorMessage = 'Erro na API do ElevenLabs'
      if (response.status === 401) {
        errorMessage = 'API key inválida ou expirada - Verifique sua chave ElevenLabs'
      } else if (response.status === 402) {
        errorMessage = 'Cota de caracteres esgotada - Upgrade seu plano ElevenLabs'
      } else if (response.status === 422) {
        errorMessage = 'Texto muito longo ou voz não encontrada'
      } else if (response.status === 429) {
        errorMessage = 'Muitas requisições - Aguarde alguns segundos'
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorText, status: response.status }, 
        { status: response.status }
      )
    }

    // Converte a resposta em blob de áudio
    const audioBuffer = await response.arrayBuffer()
    
    if (audioBuffer.byteLength === 0) {
      console.error('❌ Audio buffer vazio retornado pela ElevenLabs')
      return NextResponse.json({ error: 'Nenhum conteúdo de áudio retornado' }, { status: 500 })
    }

    // Log de sucesso
    console.log('✅ ElevenLabs sucesso:')
    console.log('Audio size:', audioBuffer.byteLength, 'bytes')
    console.log('Voice used:', selectedVoiceId)
    console.log('Characters:', text.length)

    // Converte para base64 para retornar como data URL
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`

    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      audioSize: audioBuffer.byteLength,
      voiceUsed: selectedVoiceId,
      charactersUsed: text.length
    })

  } catch (error) {
    console.error('Erro no servidor ElevenLabs:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    )
  }
}