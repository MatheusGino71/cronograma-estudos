import * as fs from 'fs'
import * as path from 'path'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Inicializar Firebase Admin (você precisará configurar as credenciais)
if (!getApps().length) {
  // Para desenvolvimento, você pode usar as variáveis de ambiente
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  })
}

const db = getFirestore()

interface AlternativaCSV {
  letra: string
  descricao: string
  correta: boolean
}

interface QuestaoCSV {
  id: string
  area: string
  enunciado: string
  alternativas: AlternativaCSV[]
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&nbsp;': ' ',
  }
  
  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
}

async function migrarQuestoes() {
  console.log('🚀 Iniciando migração de questões para Firebase...')
  
  try {
    // Ler o arquivo CSV
    const csvPath = path.join(process.cwd(), 'public', 'questoes.csv')
    console.log(`📂 Lendo arquivo: ${csvPath}`)
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`Arquivo não encontrado: ${csvPath}`)
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').slice(1) // Remove header
    
    console.log(`📊 Total de linhas no CSV: ${lines.length}`)
    
    // Agrupar questões
    const questoesMap = new Map<string, QuestaoCSV>()
    let questaoCounter = 1
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      const parts = line.split(',')
      if (parts.length < 7) continue
      
      const questionId = parts[1]
      const area = parts[2]
      const questionStem = parts[3]
      const letter = parts[4]
      const description = parts[5]
      const correct = parts[6]
      
      if (!questoesMap.has(questionId)) {
        questoesMap.set(questionId, {
          id: `questao-${questaoCounter++}-${questionId}`,
          area: area,
          enunciado: decodeHTMLEntities(questionStem),
          alternativas: []
        })
      }
      
      const questao = questoesMap.get(questionId)!
      
      // Evita alternativas duplicadas
      const alternativaExiste = questao.alternativas.some(alt => alt.letra === letter)
      if (!alternativaExiste) {
        questao.alternativas.push({
          letra: letter,
          descricao: decodeHTMLEntities(description),
          correta: correct.trim() === '1'
        })
      }
    }
    
    const questoes = Array.from(questoesMap.values())
    console.log(`✅ Total de questões agrupadas: ${questoes.length}`)
    
    // Migrar para Firebase em lotes
    const batchSize = 500
    let migratedCount = 0
    
    for (let i = 0; i < questoes.length; i += batchSize) {
      const batch = db.batch()
      const questoesBatch = questoes.slice(i, i + batchSize)
      
      for (const questao of questoesBatch) {
        const docRef = db.collection('questoes').doc()
        batch.set(docRef, {
          ...questao,
          criadoEm: new Date(),
          ativo: true
        })
      }
      
      await batch.commit()
      migratedCount += questoesBatch.length
      
      console.log(`⏳ Migradas ${migratedCount}/${questoes.length} questões...`)
    }
    
    console.log('✅ Migração concluída com sucesso!')
    console.log(`📈 Total de questões migradas: ${migratedCount}`)
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  }
}

// Executar migração
migrarQuestoes().then(() => {
  console.log('🎉 Processo finalizado!')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Erro fatal:', error)
  process.exit(1)
})
