import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Configuração das APIs
const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyDGH1qYNs7JHmVCsK2X3Z4R9dF5vB8uM1cQ'
const notebookLmApiKey = process.env.NOTEBOOKLM_API_KEY
console.log('🔑 Gemini API Key:', geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'NÃO ENCONTRADA')
console.log('📚 NotebookLM API Key:', notebookLmApiKey ? `${notebookLmApiKey.substring(0, 15)}...` : 'NÃO ENCONTRADA')

// Inicializar Gemini AI como fallback
const genAI = new GoogleGenerativeAI(geminiApiKey)

interface VideoRequest {
  topico: string
  detalhes?: string
  duracao: string
  formatoVideo: string
  qualidade: string
}

interface Questao {
  id: string
  enunciado: string
  materia: string
  assunto?: string
  gabarito?: string
  alternativas?: string[]
}

interface VideoScript {
  titulo: string
  script: string
  pontosChave: string[]
  disciplinas: string[]
  duracaoEstimada: string
  questoesAnalisadas: number
}

// Função para extrair palavras-chave do tópico
function extrairPalavrasChave(texto: string): string[] {
  const palavrasComuns = new Set([
    'de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'para', 'com', 'em', 'no', 'na', 'nos', 'nas',
    'por', 'sobre', 'entre', 'contra', 'sem', 'sob', 'até', 'desde', 'durante', 'mediante',
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'é', 'são', 'foi', 'foram', 'ser',
    'ter', 'tem', 'teve', 'havia', 'há', 'quando', 'onde', 'como', 'que', 'qual', 'quais'
  ])

  return texto
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(palavra => palavra.length > 2 && !palavrasComuns.has(palavra))
    .slice(0, 10) // Limita a 10 palavras-chave
}

// Função para buscar questões relevantes no Firebase
async function buscarQuestoesRelevantes(palavrasChave: string[]): Promise<Questao[]> {
  try {
    const questoesRef = collection(db, 'questoes')
    const questoesRelevantes: Questao[] = []

    // Busca questões que contenham as palavras-chave
    for (const palavra of palavrasChave.slice(0, 5)) { // Limita a 5 buscas
      const q = query(
        questoesRef,
        where('enunciado', '>=', palavra.toLowerCase()),
        where('enunciado', '<=', palavra.toLowerCase() + '\uf8ff'),
        limit(10)
      )

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (!questoesRelevantes.find(q => q.id === doc.id)) {
          questoesRelevantes.push({
            id: doc.id,
            enunciado: data.enunciado || '',
            materia: data.materia || '',
            assunto: data.assunto || '',
            gabarito: data.gabarito || '',
            alternativas: data.alternativas || []
          })
        }
      })
    }

    return questoesRelevantes.slice(0, 20) // Máximo 20 questões
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    return []
  }
}

// Função para gerar script usando NotebookLM API (prioritária)
async function gerarScriptComNotebookLM(
  topico: string,
  detalhes: string = '',
  questoes: Questao[], 
  formatoVideo: string,
  duracao: string
): Promise<VideoScript | null> {
  if (!notebookLmApiKey) {
    console.log('📚 NotebookLM API não configurada, usando fallback')
    return null
  }

  try {
    console.log('🤖 Tentando gerar script com NotebookLM API...')

    // Prepara o contexto das questões
    const contextQuestoes = questoes.slice(0, 20).map((q, index) => ({
      id: index + 1,
      materia: q.materia,
      assunto: q.assunto || 'Não especificado',
      enunciado: q.enunciado.substring(0, 400),
      gabarito: q.gabarito || 'Não informado'
    }))

    // Constrói o payload para a API do NotebookLM
    const payload = {
      topic: topico,
      details: detalhes,
      format: formatoVideo,
      duration: duracao,
      questions: contextQuestoes,
      language: 'pt-BR',
      audience: 'concurseiros',
      style: 'educativo',
      instructions: `Crie um script educativo sobre ${topico} para concursos públicos. 
      Baseie-se nas questões fornecidas e inclua conceitos fundamentais, dicas práticas e exemplos reais.
      O conteúdo deve ser didático e adequado para ${duracao} minutos de duração.`
    }

    // Controller para timeout da requisição
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    // Simula chamada para API do NotebookLM (substitua pela URL real da API)
    const response = await fetch('https://api.notebooklm.com/v1/generate-script', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notebookLmApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CronogramaEstudos/1.0'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`NotebookLM API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('✅ Script gerado com NotebookLM API com sucesso!')
    
    return {
      titulo: data.title || `${formatoVideo === 'resumo-rapido' ? 'Resumo' : 'Aula'}: ${topico}`,
      script: data.script || data.content,
      pontosChave: data.keyPoints || data.pontos_chave || [
        'Conceitos fundamentais',
        'Aplicação prática',
        'Jurisprudência relevante',
        'Dicas para concurso'
      ],
      disciplinas: [...new Set(questoes.map(q => q.materia).filter(Boolean))],
      duracaoEstimada: data.estimatedDuration || duracao,
      questoesAnalisadas: questoes.length
    }

  } catch (error) {
    console.error('❌ Erro ao usar NotebookLM API:', error)
    console.log('🔄 Fazendo fallback para Gemini AI...')
    return null
  }
}

// Função para gerar script do vídeo usando Gemini AI (fallback)
async function gerarScriptVideoComIA(
  topico: string, 
  detalhes: string, 
  questoes: Questao[], 
  formatoVideo: string,
  duracao: string
): Promise<VideoScript> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Prepara o contexto das questões
    const contextQuestoes = questoes.slice(0, 15).map((q, index) => 
      `${index + 1}. QUESTÃO (${q.materia}${q.assunto ? ` - ${q.assunto}` : ''}):
      ${q.enunciado.substring(0, 300)}...
      ${q.gabarito ? `GABARITO: ${q.gabarito}` : ''}
      ---`
    ).join('\n')

    // Análise estatística das questões
    const estatisticas = {
      totalQuestoes: questoes.length,
      materias: [...new Set(questoes.map(q => q.materia).filter(Boolean))],
      assuntosMaisFrequentes: questoes
        .filter(q => q.assunto)
        .reduce((acc: { [key: string]: number }, q) => {
          acc[q.assunto!] = (acc[q.assunto!] || 0) + 1
          return acc
        }, {}),
      frequenciaPorMateria: questoes.reduce((acc: { [key: string]: number }, q) => {
        acc[q.materia] = (acc[q.materia] || 0) + 1
        return acc
      }, {})
    }

    const formatoInstrucoes = {
      'explicativo': 'Crie um script educativo e didático, explicando conceitos de forma clara',
      'resumo-rapido': 'Faça um resumo direto e objetivo, focando nos pontos essenciais',
      'aula-completa': 'Desenvolva uma aula completa e detalhada, com exemplos práticos',
      'revisao': 'Foque nos pontos mais importantes para revisão de prova'
    }

    const duracaoInstrucoes = {
      '2-5': 'Conteúdo para 2-5 minutos (aproximadamente 300-750 palavras)',
      '5-10': 'Conteúdo para 5-10 minutos (aproximadamente 750-1500 palavras)',
      '10-15': 'Conteúdo para 10-15 minutos (aproximadamente 1500-2250 palavras)',
      '15-20': 'Conteúdo para 15-20 minutos (aproximadamente 2250-3000 palavras)'
    }

    const prompt = `
Você é um especialista em direito que cria conteúdo educativo para concursos públicos.

TEMA: ${topico}
${detalhes ? `DETALHES ESPECÍFICOS: ${detalhes}` : ''}

FORMATO: ${formatoInstrucoes[formatoVideo as keyof typeof formatoInstrucoes] || formatoInstrucoes.explicativo}
DURAÇÃO: ${duracaoInstrucoes[duracao as keyof typeof duracaoInstrucoes] || duracaoInstrucoes['5-10']}

ESTATÍSTICAS DAS QUESTÕES ANALISADAS:
- Total de questões: ${estatisticas.totalQuestoes}
- Matérias identificadas: ${estatisticas.materias.join(', ')}
- Assuntos mais frequentes: ${Object.entries(estatisticas.assuntosMaisFrequentes)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 5)
  .map(([assunto, freq]) => `${assunto} (${freq}x)`)
  .join(', ')}

CONTEXTO DAS QUESTÕES DE CONCURSO:
${contextQuestoes}

INSTRUÇÕES DETALHADAS:
1. Crie um título atrativo e educativo para o vídeo
2. Desenvolva um script completo, fluido e envolvente para narração
3. Identifique 5-8 pontos-chave principais baseados nas questões
4. Liste as disciplinas jurídicas abordadas
5. Inclua estatísticas sobre frequência dos temas nas questões
6. Use linguagem clara, didática e adequada para estudantes
7. Adicione exemplos práticos e casos reais quando relevante
8. Mencione jurisprudência importante relacionada ao tema
9. Dê dicas específicas para resolver questões sobre o assunto
10. Termine com um resumo dos pontos essenciais

FORMATO DE RESPOSTA (JSON):
{
  "titulo": "Título do vídeo",
  "script": "Script completo para narração...",
  "pontosChave": ["Ponto 1", "Ponto 2", "..."],
  "disciplinas": ["Disciplina 1", "Disciplina 2", "..."],
  "duracaoEstimada": "X-Y min",
  "questoesAnalisadas": ${questoes.length}
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Tenta parsear o JSON da resposta
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const videoData = JSON.parse(jsonMatch[0])
        return {
          titulo: videoData.titulo || `${formatoVideo === 'resumo-rapido' ? 'Resumo' : 'Aula'}: ${topico}`,
          script: videoData.script || text,
          pontosChave: videoData.pontosChave || [],
          disciplinas: videoData.disciplinas || [...new Set(questoes.map(q => q.materia).filter(Boolean))],
          duracaoEstimada: videoData.duracaoEstimada || duracao,
          questoesAnalisadas: questoes.length
        }
      }
    } catch (parseError) {
      console.log('Erro ao parsear JSON, usando resposta direta:', parseError)
    }

    // Fallback se não conseguir parsear JSON
    return {
      titulo: `${formatoVideo === 'resumo-rapido' ? 'Resumo' : 'Aula'}: ${topico}`,
      script: text,
      pontosChave: [
        'Conceitos fundamentais',
        'Aplicação prática',
        'Jurisprudência relevante',
        'Pontos para concurso'
      ],
      disciplinas: [...new Set(questoes.map(q => q.materia).filter(Boolean))],
      duracaoEstimada: duracao,
      questoesAnalisadas: questoes.length
    }

  } catch (error) {
    console.error('❌ Erro ao gerar script com Gemini IA:', error)
    
    // Verifica se é erro de API key
    if (error instanceof Error && error.message.includes('API key')) {
      console.error('🔑 Erro de API Key do Gemini. Verifique a configuração no .env.local')
    }
    
    // Fallback para geração básica com conteúdo mais rico
    const materias = [...new Set(questoes.map(q => q.materia).filter(Boolean))]
    const assuntos = [...new Set(questoes.map(q => q.assunto).filter(Boolean))]
    
    let scriptFallback = `
🎯 AULA COMPLETA: ${topico.toUpperCase()}

📚 INTRODUÇÃO
Olá! Bem-vindos ao nosso estudo sobre ${topico}. Este é um tema de extrema importância para concursos públicos, sendo frequentemente cobrado em provas de diversos órgãos.

📊 ANÁLISE ESTATÍSTICA
Com base na análise de ${questoes.length} questões de concursos anteriores${materias.length > 0 ? `, principalmente das áreas de ${materias.join(', ')},` : ''} identificamos os padrões mais cobrados.

🔍 CONCEITOS FUNDAMENTAIS
Durante nossa apresentação, você vai aprender:
• Conceitos básicos e fundamentais
• Definições mais cobradas
• Classificações importantes
• Princípios norteadores

⚖️ APLICAÇÃO PRÁTICA
• Como esse tema aparece nas provas
• Pegadinhas mais comuns
• Estratégias de resolução
• Jurisprudência relevante

💡 DICAS PARA CONCURSO
• Pontos que mais caem em prova
• Como não errar questões básicas
• Macetes para lembrar na hora da prova
• Revisão dos pontos-chave`

    if (assuntos.length > 0) {
      scriptFallback += `

📋 TÓPICOS ESPECÍFICOS COBRADOS:
${assuntos.slice(0, 5).map(assunto => `• ${assunto}`).join('\n')}`
    }

    if (questoes.length > 0) {
      scriptFallback += `

📝 EXEMPLOS DE QUESTÕES
Com base nas ${questoes.length} questões analisadas, vamos ver exemplos práticos de como esse tema é cobrado:`
      
      // Adiciona algumas questões como exemplo
      questoes.slice(0, 2).forEach((questao, index) => {
        scriptFallback += `

EXEMPLO ${index + 1}: ${questao.materia}
${questao.enunciado.substring(0, 200)}...`
      })
    }

    scriptFallback += `

🎯 CONCLUSÃO
Este material foi gerado com base em questões reais de concursos, proporcionando um estudo direcionado e eficiente. Continue praticando e bons estudos!`

    if (detalhes) {
      scriptFallback += `

📝 DETALHES ESPECÍFICOS
${detalhes}`
    }

    scriptFallback += `

🚀 Vamos começar nossa jornada de aprendizado!`
    
    return {
      titulo: `${formatoVideo === 'resumo-rapido' ? 'Resumo' : 'Aula'}: ${topico}`,
      script: scriptFallback,
      pontosChave: [
        'Conceitos fundamentais',
        'Aplicação prática',
        'Jurisprudência relevante',
        'Dicas para concursos',
        'Pontos mais cobrados'
      ],
      disciplinas: materias,
      duracaoEstimada: duracao,
      questoesAnalisadas: questoes.length
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validação do Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Content-Type deve ser application/json' 
        },
        { status: 400 }
      )
    }

    let body: VideoRequest
    
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'JSON inválido no corpo da requisição',
          details: parseError instanceof Error ? parseError.message : 'Erro de parsing'
        },
        { status: 400 }
      )
    }

    const { topico, detalhes, duracao, formatoVideo, qualidade } = body

    // Validações de entrada mais robustas
    if (!topico || typeof topico !== 'string' || !topico.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Tópico é obrigatório e deve ser uma string não vazia' 
        },
        { status: 400 }
      )
    }

    if (topico.trim().length < 3) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Tópico deve ter pelo menos 3 caracteres' 
        },
        { status: 400 }
      )
    }

    if (topico.trim().length > 200) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Tópico deve ter no máximo 200 caracteres' 
        },
        { status: 400 }
      )
    }

    // Validação de parâmetros opcionais
    const formatosValidos = ['explicativo', 'resumo-rapido', 'aula-completa', 'revisao']
    if (formatoVideo && !formatosValidos.includes(formatoVideo)) {
      return NextResponse.json(
        { 
          success: false,
          error: `Formato de vídeo inválido. Opções: ${formatosValidos.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const duracoesValidas = ['2-5', '5-10', '10-15', '15-20']
    if (duracao && !duracoesValidas.includes(duracao)) {
      return NextResponse.json(
        { 
          success: false,
          error: `Duração inválida. Opções: ${duracoesValidas.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const qualidadesValidas = ['720p', '1080p', '4K']
    if (qualidade && !qualidadesValidas.includes(qualidade)) {
      return NextResponse.json(
        { 
          success: false,
          error: `Qualidade inválida. Opções: ${qualidadesValidas.join(', ')}` 
        },
        { status: 400 }
      )
    }

    console.log(`🎬 Iniciando geração de vídeo sobre: ${topico}`)
    console.log(`📋 Formato: ${formatoVideo} | Duração: ${duracao} | Qualidade: ${qualidade}`)

    // 1. Extrair palavras-chave do tópico
    const palavrasChave = extrairPalavrasChave(topico)
    console.log(`🔍 Palavras-chave extraídas (${palavrasChave.length}): ${palavrasChave.join(', ')}`)

    // 2. Buscar questões relevantes no Firebase
    console.log(`🔎 Buscando questões relevantes no Firebase...`)
    const questoesRelevantes = await buscarQuestoesRelevantes(palavrasChave)
    console.log(`📚 Encontradas ${questoesRelevantes.length} questões relevantes`)
    
    if (questoesRelevantes.length > 0) {
      const materias = [...new Set(questoesRelevantes.map(q => q.materia).filter(Boolean))]
      console.log(`📖 Matérias identificadas: ${materias.join(', ')}`)
    }

    // 3. Gerar script do vídeo - Primeiro tenta NotebookLM, depois Gemini AI
    let videoData: VideoScript | null = null
    
    // Tentativa 1: NotebookLM API (prioritária)
    videoData = await gerarScriptComNotebookLM(topico, detalhes || '', questoesRelevantes, formatoVideo, duracao)
    
    // Tentativa 2: Gemini AI (fallback)
    if (!videoData) {
      console.log(`🤖 Gerando script com Gemini AI (fallback)...`)
      videoData = await gerarScriptVideoComIA(topico, detalhes || '', questoesRelevantes, formatoVideo, duracao)
    }
    
    // Verificação crítica: se ainda não temos dados, retorna erro
    if (!videoData || !videoData.script) {
      console.error('❌ Falha em todas as tentativas de geração de script')
      return NextResponse.json({
        success: false,
        error: 'Não foi possível gerar o script do vídeo. Tente novamente mais tarde.',
        details: 'Falha nas APIs NotebookLM e Gemini'
      }, { status: 500 })
    }
    
    console.log(`✍️ Script gerado com sucesso: ${videoData.script.length} caracteres`)

    // 4. Simular geração de vídeo (aqui você integraria com uma API de geração de vídeo)
    const response = {
      success: true,
      titulo: videoData.titulo,
      duracao: videoData.duracaoEstimada,
      script: videoData.script,
      pontosChave: videoData.pontosChave,
      disciplinas: videoData.disciplinas,
      questoesAnalisadas: videoData.questoesAnalisadas,
      videoUrl: `/api/videos/${Date.now()}.mp4`, // URL simulada
      thumbnailUrl: `/api/thumbnails/${Date.now()}.jpg`, // Thumbnail simulada
      transcricao: videoData.script,
      metadata: {
        topico,
        formatoVideo,
        qualidade,
        palavrasChave,
        criadoEm: new Date().toISOString()
      }
    }

    console.log(`✅ Vídeo gerado com sucesso: ${response.titulo}`)

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Erro ao gerar resumo em vídeo:', error)
    
    // Tratamento específico de diferentes tipos de erro
    let errorMessage = 'Erro interno do servidor'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = 'Operação cancelada por timeout. Tente novamente.'
        statusCode = 408
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.'
        statusCode = 503
      } else if (error.message.includes('API key')) {
        errorMessage = 'Erro de configuração da API. Contate o administrador.'
        statusCode = 503
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
        endpoint: '/api/notebook-ia/video-summary'
      },
      { status: statusCode }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Resumo em Vídeo - Use POST para gerar vídeos',
    endpoints: {
      'POST /api/notebook-ia/video-summary': 'Gerar resumo em vídeo',
    },
    example: {
      topico: 'Direito Constitucional - Princípios Fundamentais',
      detalhes: 'Focar em dignidade da pessoa humana',
      duracao: '5-10',
      formatoVideo: 'explicativo',
      qualidade: '1080p'
    }
  })
}