import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { audioContent, apiKey, config } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ error: 'API key é obrigatória' }, { status: 400 })
    }

    if (!audioContent) {
      return NextResponse.json({ error: 'Conteúdo de áudio é obrigatório' }, { status: 400 })
    }

    // Configuração padrão para reconhecimento em português brasileiro
    const defaultConfig = {
      enableAutomaticPunctuation: true,
      encoding: 'WEBM_OPUS', // Melhor para áudio do navegador
      languageCode: 'pt-BR',
      model: 'latest_long', // Modelo mais recente para melhor precisão
      useEnhanced: true, // Usa modelo aprimorado quando disponível
      enableWordTimeOffsets: true,
      enableWordConfidence: true,
      maxAlternatives: 1,
      profanityFilter: false,
      enableSpeakerDiarization: false,
      diarizationSpeakerCount: 2,
      sampleRateHertz: 48000
    }

    const requestBody = {
      audio: {
        content: audioContent
      },
      config: {
        ...defaultConfig,
        ...config // Permite sobrescrever configurações padrão
      }
    }

    // Chamada para Google Speech-to-Text API
    const response = await fetch(`https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Speech-to-Text API Error:', errorData)
      return NextResponse.json(
        { error: 'Erro na API do Google Speech-to-Text', details: errorData }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ 
        success: true,
        transcript: '',
        confidence: 0,
        message: 'Nenhuma fala detectada no áudio'
      })
    }

    // Processa os resultados
    const result = data.results[0]
    const alternative = result.alternatives[0]
    
    return NextResponse.json({
      success: true,
      transcript: alternative.transcript,
      confidence: alternative.confidence || 0,
      words: alternative.words || [],
      languageCode: requestBody.config.languageCode,
      results: data.results // Resultados completos para análise avançada
    })

  } catch (error) {
    console.error('Erro no servidor Google Speech-to-Text:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    )
  }
}