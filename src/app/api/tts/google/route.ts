import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'API key é obrigatória' }, { status: 400 })
    }

    if (!text) {
      return NextResponse.json({ error: 'Texto é obrigatório' }, { status: 400 })
    }

    // Configuração da requisição para Google Text-to-Speech API
    const requestBody = {
      input: {
        text: text
      },
      voice: {
        languageCode: 'pt-BR',
        name: voiceId || 'pt-BR-Neural2-A',
        ssmlGender: voiceId?.includes('Neural2-A') || voiceId?.includes('Wavenet-A') ? 'FEMALE' : 'MALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0,
        sampleRateHertz: 24000,
        effectsProfileId: ['headphone-class-device']
      }
    }

    // Chamada para Google Text-to-Speech API
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google TTS API Error:', errorData)
      return NextResponse.json(
        { error: 'Erro na API do Google TTS', details: errorData }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.audioContent) {
      return NextResponse.json({ error: 'Nenhum conteúdo de áudio retornado' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      audioContent: data.audioContent,
      audioUrl: `data:audio/mp3;base64,${data.audioContent}`
    })

  } catch (error) {
    console.error('Erro no servidor Google TTS:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    )
  }
}