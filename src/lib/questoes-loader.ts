export interface Questao {
  ObjectSimulationId: string
  ObjectQuestionId: string
  Area: string
  QuestionStem: string
  Letter: string
  Description: string
  Correct: string
}

export interface QuestaoAgrupada {
  id: string
  area: string
  enunciado: string
  alternativas: Array<{
    letra: string
    descricao: string
    correta: boolean
  }>
}

// Função para decodificar HTML entities e remover tags
function decodeHTMLEntities(text: string): string {
  if (!text) return ''
  
  const textArea = typeof document !== 'undefined' ? document.createElement('textarea') : null
  
  if (textArea) {
    textArea.innerHTML = text
    const decoded = textArea.value
    // Remove tags HTML restantes
    return decoded.replace(/<[^>]*>/g, '').trim()
  }
  
  // Fallback para ambiente servidor
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&nbsp;': ' ',
    '&apos;': "'",
  }
  
  let decoded = text
  
  // Decodifica entidades
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  })
  
  // Remove tags HTML
  decoded = decoded
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
  
  return decoded.trim()
}

// Mapeia áreas do CSV para disciplinas do sistema
const areaDisciplinaMap: { [key: string]: string[] } = {
  'Direito Civil': ['civil', 'direito civil', 'cível'],
  'Direito Penal': ['penal', 'direito penal', 'criminal'],
  'Direito Constitucional': ['constitucional', 'direito constitucional', 'const'],
  'Direito Administrativo': ['administrativo', 'direito administrativo', 'adm'],
  'Processo Civil': ['processo civil', 'proc civil', 'cpc'],
  'Processo Penal': ['processo penal', 'proc penal', 'cpp'],
  'Direito Tributário': ['tributário', 'direito tributário', 'tribut'],
  'Direito do Trabalho': ['trabalho', 'direito do trabalho', 'trabalhista'],
  'Direito Empresarial': ['empresarial', 'direito empresarial', 'comercial'],
  'Ética Profissional': ['ética', 'ética profissional', 'etica'],
}

/**
 * Carrega questões do Firebase - DIRETO, SEM COMPLICAÇÃO
 */
export async function carregarQuestoes(): Promise<QuestaoAgrupada[]> {
  try {
    console.log('🔍 Carregando questões do Firebase...')
    
    // Importação dinâmica para evitar problemas no servidor
    const { db } = await import('./firebase')
    const { collection, getDocs } = await import('firebase/firestore')
    
    const questoesRef = collection(db, 'questoes')
    const snapshot = await getDocs(questoesRef)
    
    console.log(`📦 Total de documentos no Firebase: ${snapshot.size}`)
    
    const questoes: QuestaoAgrupada[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      
      // Normaliza alternativas (suporta tanto 'descricao' quanto 'texto')
      const alternativas = (data.alternativas || []).map((alt: { letra: string; descricao?: string; texto?: string; correta: boolean }) => ({
        letra: alt.letra,
        descricao: decodeHTMLEntities(alt.descricao || alt.texto || ''),
        correta: alt.correta
      }))
      
      const enunciado = decodeHTMLEntities(data.enunciado || '')
      
      if (enunciado.trim() && alternativas.length > 0) {
        questoes.push({
          id: doc.id,
          area: data.area || data.disciplina || 'Geral',
          enunciado,
          alternativas
        })
      }
    })
    
    console.log(`✅ Carregadas ${questoes.length} questões do Firebase`)
    
    return questoes
  } catch (error) {
    console.error('❌ Erro ao carregar questões do Firebase:', error)
    return []
  }
}

export async function filtrarQuestoesPorDisciplinaAsync(
  nomeDisciplina: string,
  quantidade?: number
): Promise<QuestaoAgrupada[]> {
  const todasQuestoes = await carregarQuestoes()
  const filtradas = filtrarQuestoesPorDisciplina(todasQuestoes, nomeDisciplina)
  return quantidade ? filtradas.slice(0, quantidade) : filtradas
}

export function filtrarQuestoesPorDisciplina(
  questoes: QuestaoAgrupada[],
  nomeDisciplina: string
): QuestaoAgrupada[] {
  const nomeNormalizado = nomeDisciplina.toLowerCase()
  
  // Encontra a área correspondente
  let areaFiltro: string | null = null
  for (const [area, termos] of Object.entries(areaDisciplinaMap)) {
    if (termos.some(termo => nomeNormalizado.includes(termo))) {
      areaFiltro = area
      break
    }
  }
  
  if (!areaFiltro) {
    // Se não encontrou correspondência direta, tenta buscar por similaridade
    return questoes.filter(q => 
      q.area.toLowerCase().includes(nomeNormalizado) ||
      nomeNormalizado.includes(q.area.toLowerCase())
    )
  }
  
  return questoes.filter(q => q.area === areaFiltro)
}

export function embaralharArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
