// Teste para verificar se a API do ElevenLabs está funcionando
async function testElevenLabsAPI() {
  const testText = "Olá! Esta é uma demonstração da API do ElevenLabs em português do Brasil."
  
  try {
    const response = await fetch('/api/tts/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: testText,
        voiceId: 'female',
        apiKey: 'sk_b0a1f886f2b702f29cc30d2ac2790081640a7ced65d3331b'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ ElevenLabs API funcionando!', data)
      
      if (data.audioUrl) {
        // Reproduz o áudio de teste
        const audio = new Audio(data.audioUrl)
        audio.play()
        return true
      }
    } else {
      const error = await response.json()
      console.error('❌ Erro na API ElevenLabs:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
    return false
  }
}

// Exporta para uso no navegador
if (typeof window !== 'undefined') {
  (window as any).testElevenLabs = testElevenLabsAPI
}

export { testElevenLabsAPI }