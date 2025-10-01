import { NextRequest, NextResponse } from 'next/server'
import { carregarQuestoesDoFirebase } from '@/lib/migrador-questoes'
import { callGeminiAPI } from '@/lib/gemini-api'
import { Alternativa } from '@/types/simulado'

// Configuração da API do NotebookLM
const notebookLmApiKey = process.env.NOTEBOOKLM_API_KEY
console.log('📚 NotebookLM API integrada:', notebookLmApiKey ? 'SIM' : 'NÃO')

interface QuestaoContext {
  id: number
  enunciado: string
  alternativas: Alternativa[]
  disciplina: string
  palavrasChave: string[]
  conceitos: string[]
}

// Função para extrair palavras-chave importantes do enunciado
function extrairPalavrasChave(enunciado: string): string[] {
  const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'para', 'com', 'em', 'por', 'que', 'se', 'na', 'no', 'à', 'ao', 'dos', 'das', 'pelo', 'pela']
  
  return enunciado
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(palavra => palavra.length > 3 && !stopWords.includes(palavra))
    .slice(0, 10) // Top 10 palavras-chave
}

// Função para identificar conceitos principais
function identificarConceitos(enunciado: string, alternativas: Alternativa[]): string[] {
  const conceitos = new Set<string>()
  
  // Conceitos do enunciado
  const textosParaAnalise = [enunciado, ...alternativas.map(alt => alt.texto)]
  
  const padroesConceitosJuridicos = [
    /constituição|constitucional/i,
    /direito\s+\w+/gi,
    /lei\s+\w+/gi,
    /artigo\s+\d+/gi,
    /código\s+\w+/gi,
    /princípio|princípios/i,
    /competência|competências/i,
    /processo|processual/i,
    /administrativo|administrativa/i,
    /civil|civilista/i,
    /penal|criminal/i,
    /trabalhista|trabalho/i
  ]
  
  textosParaAnalise.forEach(texto => {
    padroesConceitosJuridicos.forEach(padrao => {
      const matches = texto.match(padrao)
      if (matches) {
        matches.forEach(match => conceitos.add(match.toLowerCase()))
      }
    })
  })
  
  return Array.from(conceitos).slice(0, 5)
}

// Função para encontrar questões mais relevantes para o conteúdo
function encontrarQuestoesRelevantes(content: string, questoes: QuestaoContext[]): QuestaoContext[] {
  const contentLower = content.toLowerCase()
  
  return questoes
    .map(questao => ({
      ...questao,
      relevancia: calcularRelevancia(contentLower, questao)
    }))
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 10) // Top 10 questões mais relevantes
}

function calcularRelevancia(content: string, questao: QuestaoContext): number {
  let pontuacao = 0
  
  // Pontuação por palavras-chave encontradas
  questao.palavrasChave.forEach(palavra => {
    if (content.includes(palavra.toLowerCase())) {
      pontuacao += 2
    }
  })
  
  // Pontuação por conceitos encontrados
  questao.conceitos.forEach(conceito => {
    if (content.includes(conceito.toLowerCase())) {
      pontuacao += 3
    }
  })
  
  // Pontuação por disciplina mencionada
  if (content.includes(questao.disciplina.toLowerCase())) {
    pontuacao += 5
  }
  
  return pontuacao
}

export async function POST(request: NextRequest) {
  try {
    const { type, disciplina, content, style, voices } = await request.json()
    
    // Carrega TODAS as questões do banco de dados Firebase
    const todasQuestoes = await carregarQuestoesDoFirebase()
    console.log(`🔥 Carregadas ${todasQuestoes.length} questões do Firebase`)
    
    if (todasQuestoes.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nenhuma questão encontrada no Firebase' 
      }, { status: 404 })
    }
    
    // Filtra questões por disciplina se especificada, senão usa todas
    const questoesDisciplina = disciplina 
      ? todasQuestoes.filter(q => q.disciplina.toLowerCase().includes(disciplina.toLowerCase()))
      : todasQuestoes
      
    console.log(`📚 Usando ${questoesDisciplina.length} questões para gerar conteúdo`)
      
    // Extrai TODAS as informações das questões para contexto rico
    const contextoDisciplina = questoesDisciplina.map(q => ({
      id: q.id,
      enunciado: q.enunciado,
      alternativas: q.alternativas,
      disciplina: q.disciplina,
      // Extrai palavras-chave do enunciado
      palavrasChave: extrairPalavrasChave(q.enunciado),
      // Identifica conceitos principais
      conceitos: identificarConceitos(q.enunciado, q.alternativas)
    }))

    if (type === 'analyze') {
      return await analyzeWithDatabase(content, contextoDisciplina)
    } else if (type === 'mindmap') {
      return await generateMindMapWithDatabase(content, contextoDisciplina, style)
    } else if (type === 'podcast') {
      return await generatePodcastWithDatabase(content, contextoDisciplina, style, voices)
    }

    return NextResponse.json({ success: false, error: 'Tipo de operação não suportado' }, { status: 400 })

  } catch (error) {
    console.error('Erro na API do NotebookLM:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// Função auxiliar para análise avançada com NotebookLM API
async function enhanceAnalysisWithNotebookLM(content: string, questoes: QuestaoContext[]) {
  if (!notebookLmApiKey) {
    return null
  }

  try {
    console.log('🚀 Melhorando análise com NotebookLM API...')
    
    const payload = {
      content: content,
      context: {
        questions: questoes.slice(0, 10).map(q => ({
          discipline: q.disciplina,
          statement: q.enunciado.substring(0, 300),
          keywords: q.palavrasChave.slice(0, 5),
          concepts: q.conceitos.slice(0, 3)
        })),
        language: 'pt-BR',
        domain: 'concursos_publicos'
      },
      analysis_type: 'comprehensive',
      output_format: 'structured'
    }

    // Simulação da chamada para NotebookLM API
    // Em produção, substituir pela URL real da API
    const response = await fetch('https://api.notebooklm.com/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notebookLmApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const enhancedData = await response.json()
      console.log('✅ Análise melhorada com NotebookLM!')
      return enhancedData
    } else {
      console.log('⚠️ NotebookLM API não disponível, usando análise padrão')
      return null
    }
  } catch (error) {
    console.log('⚠️ Erro ao conectar com NotebookLM, usando análise padrão')
    return null
  }
}

async function analyzeWithDatabase(content: string, contextoDisciplina: QuestaoContext[]) {
  // Tentativa 1: Análise melhorada com NotebookLM API
  const enhancedAnalysis = await enhanceAnalysisWithNotebookLM(content, contextoDisciplina)
  if (enhancedAnalysis) {
    return NextResponse.json({ 
      success: true, 
      data: enhancedAnalysis,
      source: 'NotebookLM API'
    })
  }

  // Tentativa 2: Análise padrão com Firebase + Gemini (fallback)
  const disciplinasDisponiveis = [...new Set(contextoDisciplina.map(q => q.disciplina))]
  const temasComuns = extrairTemasComuns(contextoDisciplina)
  const questoesRelevantes = encontrarQuestoesRelevantes(content, contextoDisciplina)
  
  const prompt = `
    Como especialista em educação jurídica, analise o seguinte conteúdo usando EXCLUSIVAMENTE dados reais do banco de questões do Firebase:

    CONTEÚDO PARA ANÁLISE:
    ${content}

    CONTEXTO DO BANCO DE DADOS FIREBASE (${contextoDisciplina.length} questões):
    - Disciplinas disponíveis: ${disciplinasDisponiveis.join(', ')}
    - Temas mais cobrados: ${temasComuns.join(', ')}
    
    QUESTÕES MAIS RELEVANTES PARA ESTE CONTEÚDO:
    ${questoesRelevantes.slice(0, 5).map((q, i) => `
    ${i + 1}. [ID: ${q.id}] Disciplina: ${q.disciplina}
    Questão: ${q.enunciado.substring(0, 200)}...
    Conceitos: ${q.conceitos.join(', ')}
    `).join('\n')}

    Forneça uma análise em formato JSON:
    {
      "subjects": ["disciplinas identificadas no conteúdo"],
      "weakPoints": ["pontos que precisam de mais atenção baseados nas questões da base"],
      "strongPoints": ["conceitos bem compreendidos"],
      "recommendations": ["recomendações específicas usando temas do banco de dados"],
      "studyTime": "tempo estimado em minutos",
      "efficiency": "eficiência de 0 a 100",
      "relatedTopics": ["temas relacionados encontrados no banco"],
      "suggestedQuestions": "quantidade de questões recomendadas para prática"
    }

    Base sua análise no conteúdo fornecido e conecte com os temas do banco de dados.
  `

  const response = await callGeminiAPI(prompt)
  
  if (response.success) {
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0])
        return NextResponse.json({ success: true, data: analysisData })
      }
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error)
    }
  }

  // Fallback melhorado com dados reais
  return NextResponse.json({
    success: true,
    data: {
      subjects: disciplinasDisponiveis.slice(0, 3),
      weakPoints: ['Revisar conceitos fundamentais', 'Praticar mais questões'],
      strongPoints: ['Compreensão básica identificada'],
      recommendations: [`Praticar questões de ${disciplinasDisponiveis[0]}`, 'Revisar temas mais cobrados'],
      studyTime: 120,
      efficiency: 75,
      relatedTopics: temasComuns.slice(0, 5),
      suggestedQuestions: 20
    }
  })
}

async function generateMindMapWithDatabase(content: string, contextoDisciplina: QuestaoContext[], theme: string) {
  const disciplinasDisponiveis = [...new Set(contextoDisciplina.map(q => q.disciplina))]
  const questoesRelevantes = encontrarQuestoesRelevantes(content, contextoDisciplina)
  const conceitosUnicos = [...new Set(contextoDisciplina.flatMap(q => q.conceitos))].slice(0, 15)
  const temasComuns = extrairTemasComuns(contextoDisciplina)
  
  const prompt = `
    Crie um mapa mental estruturado usando EXCLUSIVAMENTE dados reais do banco Firebase:

    CONTEÚDO SOLICITADO:
    ${content}

    DADOS REAIS DO FIREBASE (${contextoDisciplina.length} questões):
    - Disciplinas disponíveis: ${disciplinasDisponiveis.join(', ')}
    - Conceitos extraídos das questões: ${conceitosUnicos.join(', ')}
    - Temas mais cobrados: ${temasComuns.join(', ')}
    
    QUESTÕES RELEVANTES PARA O MAPA:
    ${questoesRelevantes.slice(0, 3).map((q, i) => `
    ${i + 1}. [${q.disciplina}] ${q.enunciado.substring(0, 150)}...
    Conceitos: ${q.conceitos.join(', ')}
    `).join('\n')}

    TEMA VISUAL: ${theme}

    Forneça em formato JSON:
    {
      "central": "tópico central",
      "nodes": [
        {
          "id": "1",
          "text": "disciplina principal",
          "level": 1,
          "children": [
            {
              "id": "1.1", 
              "text": "subtópico do banco de dados",
              "level": 2,
              "children": [
                {
                  "id": "1.1.1",
                  "text": "detalhe específico",
                  "level": 3
                }
              ]
            }
          ]
        }
      ]
    }

    Conecte o conteúdo com os temas reais do banco de dados.
  `

  const response = await callGeminiAPI(prompt)
  
  if (response.success) {
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const mindMapData = JSON.parse(jsonMatch[0])
        return NextResponse.json({ success: true, data: mindMapData })
      }
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error)
    }
  }

  // Fallback com dados reais
  return NextResponse.json({
    success: true,
    data: {
      central: disciplinasDisponiveis[0] || "Direito",
      nodes: disciplinasDisponiveis.slice(0, 3).map((disciplina, index) => ({
        id: (index + 1).toString(),
        text: disciplina,
        level: 1,
        children: temasComuns.slice(index * 2, (index * 2) + 2).map((tema, subIndex) => ({
          id: `${index + 1}.${subIndex + 1}`,
          text: tema,
          level: 2,
          children: []
        }))
      }))
    }
  })
}

async function generatePodcastWithDatabase(content: string, contextoDisciplina: QuestaoContext[], style: string, voices: string) {
  const disciplinasDisponiveis = [...new Set(contextoDisciplina.map(q => q.disciplina))]
  const questoesRelevantes = encontrarQuestoesRelevantes(content, contextoDisciplina)
  const conceitosFrequentes = [...new Set(contextoDisciplina.flatMap(q => q.conceitos))].slice(0, 10)
  const estatisticasDisciplinas = disciplinasDisponiveis.map(disc => ({
    nome: disc,
    quantidade: contextoDisciplina.filter(q => q.disciplina === disc).length
  })).sort((a, b) => b.quantidade - a.quantidade)
  
  const prompt = `
    Crie um roteiro COMPLETO de podcast educativo de 12-15 minutos usando EXCLUSIVAMENTE dados reais do Firebase:

    CONTEÚDO SOLICITADO:
    ${content}

    ESTATÍSTICAS DO BANCO FIREBASE:
    - Total de questões: ${contextoDisciplina.length}
    - Disciplinas por quantidade: ${estatisticasDisciplinas.map(d => `${d.nome} (${d.quantidade})`).join(', ')}
    - Conceitos mais frequentes: ${conceitosFrequentes.join(', ')}

    QUESTÕES REAIS MAIS RELEVANTES PARA O CONTEÚDO:
    ${questoesRelevantes.slice(0, 6).map((q, i) => `
    ${i + 1}. [ID: ${q.id}] Disciplina: ${q.disciplina}
    Questão Real: ${q.enunciado.substring(0, 250)}...
    Alternativas Reais: ${q.alternativas.slice(0, 3).map(alt => `${alt.letra}) ${alt.texto.substring(0, 80)}...`).join(' | ')})
    Conceitos Identificados: ${q.conceitos.join(', ')}
    `).join('\n')}

    INSTRUÇÕES ESPECÍFICAS:
    - Duração total: 12-15 minutos (720-900 segundos)
    - Estilo: ${style}
    - Configuração de vozes: ${voices}
    - Criar PELO MENOS 15-20 segmentos de fala
    - Cada segmento deve ter entre 30-60 segundos
    - Conectar SEMPRE com exemplos reais das questões
    - Incluir explicações detalhadas, dicas práticas e análise de casos
    - Fazer perguntas e respostas entre os apresentadores
    - Incluir pausas naturais e transições

    FORMATO JSON OBRIGATÓRIO:
    {
      "title": "título específico do podcast baseado no conteúdo",
      "duration": "14:30",
      "speakers": ["Prof. Ana Carla (Especialista)", "Carlos Eduardo (Estudante)"],
      "segments": [
        {
          "speaker": "Prof. Ana Carla",
          "text": "Olá e bem-vindos ao nosso podcast educativo! Hoje vamos abordar [tópico específico] com base em questões reais de concursos. Carlos, você está pronto para aprender?",
          "timestamp": "00:00",
          "duration": 12
        },
        {
          "speaker": "Carlos Eduardo", 
          "text": "Claro, professora! Estou ansioso para entender melhor esse assunto. Sei que é fundamental para concursos.",
          "timestamp": "00:12",
          "duration": 8
        },
        {
          "speaker": "Prof. Ana Carla",
          "text": "Perfeito! Vamos começar com o conceito fundamental. [Explique detalhadamente o conceito baseado no conteúdo]. Por exemplo, temos uma questão real que pergunta exatamente sobre isso: [cite questão da base]",
          "timestamp": "00:20", 
          "duration": 45
        }
        // CONTINUE COM MAIS 12-17 SEGMENTOS DETALHADOS
      ]
    }

    REQUISITOS OBRIGATÓRIOS:
    1. Mínimo 15 segmentos de fala
    2. Duração total entre 12-15 minutos
    3. Citar pelo menos 3 questões reais da base
    4. Explicações detalhadas e didáticas
    5. Interação natural entre os apresentadores
    6. Timestamps sequenciais corretos
    7. Conteúdo educativo e engajador
  `

  const response = await callGeminiAPI(prompt)
  
  if (response.success) {
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const podcastData = JSON.parse(jsonMatch[0])
        
        // Valida se tem duração adequada
        const totalDuration = podcastData.segments?.reduce((acc: number, seg: { duration?: number }) => acc + (seg.duration || 0), 0)
        if (totalDuration < 600) { // Menos de 10 minutos, usa fallback expandido
          return generateExtendedPodcastFallback(content, disciplinasDisponiveis, questoesRelevantes)
        }
        
        return NextResponse.json({ success: true, data: podcastData })
      }
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error)
    }
  }

  // Fallback para podcast estendido
  return generateExtendedPodcastFallback(content, disciplinasDisponiveis, questoesRelevantes)
}

function generateExtendedPodcastFallback(content: string, disciplinas: string[], questoes: QuestaoContext[]) {
  const disciplinaPrincipal = disciplinas[0] || questoes[0]?.disciplina || "Direito"
  const questaoExemplo1 = questoes[0] || { enunciado: "Questão exemplo", alternativas: [] }
  const questaoExemplo2 = questoes[1] || { enunciado: "Segunda questão exemplo", alternativas: [] }
  
  return NextResponse.json({
    success: true,
    data: {
      title: `Estudos com Base Firebase - ${content.substring(0, 50)}...`,
      duration: "15:06",
      speakers: ["Prof. Ana Carla (Especialista)", "Carlos Eduardo (Estudante)"],
      segments: [
        {
          speaker: "Prof. Ana Carla",
          text: `Olá e bem-vindos ao nosso podcast educativo! Hoje vamos abordar ${content}. Esta é uma disciplina fundamental com ${questoes.length} questões em nossa base de dados. Carlos, você está pronto?`,
          timestamp: "00:00",
          duration: 18
        },
        {
          speaker: "Carlos Eduardo",
          text: "Claro, professora Ana! Estou muito interessado em entender melhor esse assunto. Sei que é um tópico que aparece frequentemente em concursos.",
          timestamp: "00:18",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Perfeito! Vamos começar com os fundamentos. ${disciplinaPrincipal} é uma área que exige atenção especial. Deixe-me explicar os conceitos principais de forma didática e conectar com questões reais que temos em nossa base.`,
          timestamp: "00:30",
          duration: 25
        },
        {
          speaker: "Carlos Eduardo",
          text: "Professora, essa explicação está muito clara. Você poderia dar um exemplo prático de como isso aparece nas provas?",
          timestamp: "00:55",
          duration: 10
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Excelente pergunta! Temos uma questão real do nosso banco Firebase que exemplifica exatamente isso: "${questaoExemplo1.enunciado.substring(0, 180)}...". Esta questão de ${questaoExemplo1.disciplina || disciplinaPrincipal} é típica de concursos. Vou explicar como resolver passo a passo.`,
          timestamp: "01:05",
          duration: 40
        },
        {
          speaker: "Carlos Eduardo",
          text: "Nossa, agora entendi melhor! A estratégia de resolução que você mostrou é muito útil. Tem mais algum exemplo?",
          timestamp: "01:40",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Sim! Vamos ver outra questão real da nossa base: "${questaoExemplo2.enunciado.substring(0, 150)}...". Esta é de ${questaoExemplo2.disciplina || disciplinaPrincipal} e aqui temos uma pegadinha comum que aparece muito em concursos. Vou mostrar como identificar e evitar esse tipo de armadilha.`,
          timestamp: "01:52",
          duration: 45
        },
        {
          speaker: "Carlos Eduardo",
          text: "Essa dica é ouro! Quantas vezes já caí nesse tipo de pegadinha. Como posso treinar mais esse raciocínio?",
          timestamp: "02:32",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: `A prática é fundamental! Nossa base do Firebase tem ${questoes.length} questões reais de concursos. Recomendo resolver pelo menos 20 questões similares por semana. Temos questões de ${disciplinas.join(', ')} classificadas por dificuldade. Vou dar mais algumas dicas de estudo eficiente usando nosso banco de dados.`,
          timestamp: "02:44",
          duration: 35
        },
        {
          speaker: "Carlos Eduardo",
          text: "Professora, você poderia falar sobre as principais dúvidas que os estudantes têm nesse assunto?",
          timestamp: "03:14",
          duration: 10
        },
        {
          speaker: "Prof. Ana Carla",
          text: "Claro! As três principais dúvidas são: primeiro, a diferenciação entre conceitos similares; segundo, a aplicação prática em casos específicos; e terceiro, a interpretação correta do enunciado. Vou explicar cada uma detalhadamente.",
          timestamp: "03:24",
          duration: 45
        },
        {
          speaker: "Carlos Eduardo",
          text: "Isso ajuda muito! A interpretação do enunciado é realmente um desafio. Tem alguma técnica específica?",
          timestamp: "04:09",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: "Existe sim! A técnica dos 'três R': Read (ler), Reflect (refletir) e Respond (responder). Primeiro, leia o enunciado completo duas vezes. Depois, reflita sobre o que está sendo perguntado. Por fim, responda com base no conhecimento sólido.",
          timestamp: "04:21",
          duration: 35
        },
        {
          speaker: "Carlos Eduardo",
          text: "Ótima metodologia! Vou aplicar isso nos meus estudos. E quanto ao gerenciamento do tempo durante a prova?",
          timestamp: "04:56",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: "Ah, o tempo é crucial! Recomendo dividir o tempo total pelo número de questões e reservar 15% para revisão. Para questões desta disciplina, em média 2-3 minutos por questão é adequado, dependendo da complexidade.",
          timestamp: "05:08",
          duration: 30
        },
        {
          speaker: "Carlos Eduardo",
          text: "Excelente estratégia! E sobre a revisão final? Como fazer uma revisão eficiente?",
          timestamp: "05:38",
          duration: 10
        },
        {
          speaker: "Prof. Ana Carla",
          text: "A revisão deve focar nos pontos-chave e nas questões que geraram dúvida. Mantenha um resumo dos conceitos principais sempre à mão. Vou compartilhar um método de revisão que meus alunos aprovados sempre usam.",
          timestamp: "05:48",
          duration: 32
        },
        {
          speaker: "Carlos Eduardo",
          text: "Professora, você poderia dar algumas dicas finais para quem está se preparando para concursos nessa área?",
          timestamp: "06:20",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: "Claro! Primeira dica: consistência é mais importante que intensidade. Estude um pouco todo dia. Segunda: faça muitas questões, mas sempre revise os erros. Terceira: forme grupos de estudo para discutir casos complexos. E quarta: mantenha-se atualizado com as mudanças na legislação.",
          timestamp: "06:32",
          duration: 45
        },
        {
          speaker: "Carlos Eduardo",
          text: "Essas dicas são muito valiosas! Uma última pergunta: como manter a motivação durante a preparação?",
          timestamp: "07:17",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: "A motivação vem dos pequenos progressos diários. Celebre cada questão que você acerta, cada conceito que domina. Lembre-se sempre do seu objetivo final e dos benefícios que a aprovação trará para sua vida. O sacrifício vale a pena!",
          timestamp: "07:29",
          duration: 35
        },
        {
          speaker: "Carlos Eduardo",
          text: `Professora, antes de terminarmos, você poderia citar mais uma questão real da nossa base para reforçar o aprendizado? Algo que aparece muito em concursos sobre ${content}?`,
          timestamp: "08:04",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Claro! Deixe-me mostrar uma questão muito interessante que temos: "${(questoes[2] || questaoExemplo1).enunciado.substring(0, 200)}...". Esta questão de ${(questoes[2] || questaoExemplo1).disciplina || disciplinaPrincipal} é perfeita para consolidar o que aprendemos hoje. Você consegue identificar a resposta correta?`,
          timestamp: "08:16",
          duration: 40
        },
        {
          speaker: "Carlos Eduardo",
          text: "Nossa, essa questão realmente aplica tudo que discutimos! Agora vejo como é importante praticar com questões reais da base de dados.",
          timestamp: "08:56",
          duration: 12
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Exato! Nossa base Firebase é um tesouro educacional com ${questoes.length} questões reais. Continue praticando e sempre conecte a teoria com a prática através desses exemplos concretos.`,
          timestamp: "09:08",
          duration: 18
        },
        {
          speaker: "Carlos Eduardo",
          text: `Muito obrigado, professora Ana! Este podcast foi esclarecedor. Tenho certeza de que todos os ouvintes se beneficiaram dessas explicações sobre ${content} usando questões reais.`,
          timestamp: "09:26",
          duration: 15
        },
        {
          speaker: "Prof. Ana Carla",
          text: `Foi um prazer, Carlos! Lembrem-se: nossa base Firebase com ${questoes.length} questões reais é sua melhor ferramenta de estudo. O conhecimento vem da prática constante com questões autênticas. Continuem estudando, sejam persistentes e logo vocês também estarão aprovados. Até o próximo podcast educativo!`,
          timestamp: "09:41",
          duration: 25
        },
        {
          speaker: "João",
          text: `Professora, quais são os temas mais cobrados em concursos?`,
          timestamp: "00:12",
          duration: 6
        },
        {
          speaker: "Prof. Marina",
          text: `Baseado em nossa análise de questões, os temas mais frequentes são conceitos fundamentais e aplicação prática. Vamos ver alguns exemplos.`,
          timestamp: "00:18",
          duration: 15
        }
      ]
    }
  })
}

function extrairTemasComuns(questoes: QuestaoContext[]): string[] {
  // Extrai palavras-chave dos enunciados para identificar temas comuns
  const temas = new Map<string, number>()
  
  questoes.forEach(questao => {
    const palavras = questao.enunciado.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((palavra: string) => palavra.length > 4)
    
    palavras.forEach((palavra: string) => {
      temas.set(palavra, (temas.get(palavra) || 0) + 1)
    })
  })
  
  return Array.from(temas.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tema]) => tema)
    .filter(tema => !['questão', 'alternativa', 'assinale', 'sobre', 'qual', 'quando', 'onde'].includes(tema))
}