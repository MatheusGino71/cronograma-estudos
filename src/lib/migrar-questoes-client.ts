/**
 * Script alternativo para migração usando Firebase Client SDK
 * Execute este arquivo diretamente em um componente Next.js ou crie uma rota API
 */

import { collection, writeBatch, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface AlternativaCSV {
  letra: string
  descricao: string
  correta: boolean
}

interface QuestaoFirebase {
  id: string
  area: string
  enunciado: string
  alternativas: AlternativaCSV[]
  criadoEm: Date
  ativo: boolean
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

export async function migrarQuestoesParaFirebase(csvContent: string) {
  console.log('🚀 Iniciando migração de questões para Firebase...')
  
  try {
    const lines = csvContent.split('\n').slice(1) // Remove header
    console.log(`📊 Total de linhas no CSV: ${lines.length}`)
    
    // Agrupar questões
    const questoesMap = new Map<string, QuestaoFirebase>()
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
          alternativas: [],
          criadoEm: new Date(),
          ativo: true
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
    const batchSize = 500 // Firestore permite até 500 operações por batch
    let migratedCount = 0
    
    for (let i = 0; i < questoes.length; i += batchSize) {
      const batch = writeBatch(db)
      const questoesBatch = questoes.slice(i, i + batchSize)
      
      for (const questao of questoesBatch) {
        const docRef = doc(collection(db, 'questoes'))
        batch.set(docRef, questao)
      }
      
      await batch.commit()
      migratedCount += questoesBatch.length
      
      console.log(`⏳ Migradas ${migratedCount}/${questoes.length} questões...`)
    }
    
    console.log('✅ Migração concluída com sucesso!')
    console.log(`📈 Total de questões migradas: ${migratedCount}`)
    
    return {
      success: true,
      total: migratedCount
    }
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}
