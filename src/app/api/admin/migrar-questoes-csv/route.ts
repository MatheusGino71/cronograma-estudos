import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { db } from '@/lib/firebase'
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore'

interface Alternativa {
  letra: string
  descricao: string
  correta: boolean
}

interface QuestaoFirebase {
  id: string
  area: string
  enunciado: string
  alternativas: Alternativa[]
  criadoEm: Date
  ativo: boolean
}

function decodeHTMLEntities(text: string): string {
  if (!text) return ''
  
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
  
  // Decodifica entidades conhecidas
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  })
  
  // Remove tags HTML comuns mas preserva o conteúdo
  decoded = decoded
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<strong>/gi, '')
    .replace(/<\/strong>/gi, '')
    .replace(/<b>/gi, '')
    .replace(/<\/b>/gi, '')
    .replace(/<i>/gi, '')
    .replace(/<\/i>/gi, '')
    .replace(/<em>/gi, '')
    .replace(/<\/em>/gi, '')
    .replace(/<u>/gi, '')
    .replace(/<\/u>/gi, '')
  
  // Remove qualquer outra tag HTML restante
  decoded = decoded.replace(/<[^>]+>/g, '')
  
  // Limpa espaços múltiplos
  decoded = decoded.replace(/\s+/g, ' ')
  
  return decoded.trim()
}

export async function POST() {
  try {
    console.log('🚀 Iniciando migração via API (CSV)...')
    
    // Caminho para o arquivo CSV
    const csvPath = path.join(process.cwd(), 'public', 'questoes.csv')
    
    console.log(`📁 Arquivo: ${csvPath}`)
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({
        success: false,
        message: `Arquivo não encontrado: ${csvPath}`,
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }
    
    // Ler o arquivo CSV
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n').slice(1) // Remove header
    
    console.log(`📊 Total de linhas no CSV: ${lines.length}`)
    
    // Agrupar questões - Usar enunciado como chave para evitar duplicatas
    const questoesMap = new Map<string, QuestaoFirebase>()
    const enunciadosVistos = new Set<string>()
    let questaoCounter = 1
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      const parts = line.split(',')
      if (parts.length < 7) continue
      
      // parts[1] = questionId (não usado, usamos enunciado como chave)
      const area = parts[2]
      const questionStem = parts[3]
      const letter = parts[4]
      const description = parts[5]
      const correct = parts[6]
      
      const enunciado = decodeHTMLEntities(questionStem)
      
      // Usa enunciado como chave para evitar questões duplicadas
      if (!questoesMap.has(enunciado) && enunciado.trim() && !enunciadosVistos.has(enunciado)) {
        enunciadosVistos.add(enunciado)
        questoesMap.set(enunciado, {
          id: `questao-${questaoCounter++}`,
          area: area,
          enunciado: enunciado,
          alternativas: [],
          criadoEm: new Date(),
          ativo: true
        })
      }
      
      const questao = questoesMap.get(enunciado)
      
      // Só adiciona alternativa se a questão existe e a alternativa não está duplicada
      if (questao) {
        const alternativaExiste = questao.alternativas.some(alt => alt.letra === letter)
        if (!alternativaExiste) {
          questao.alternativas.push({
            letra: letter,
            descricao: decodeHTMLEntities(description),
            correta: correct.trim() === '1'
          })
        }
      }
    }
    
    const questoes = Array.from(questoesMap.values())
    console.log(`✅ Total de questões únicas agrupadas: ${questoes.length}`)
    console.log(`📊 Enunciados únicos processados: ${enunciadosVistos.size}`)
    
    // Limpar coleção existente
    console.log('🗑️ Limpando questões existentes...')
    const questoesRef = collection(db, 'questoes')
    const snapshot = await getDocs(questoesRef)
    
    if (!snapshot.empty) {
      const deleteBatch = writeBatch(db)
      snapshot.forEach((docSnapshot) => {
        deleteBatch.delete(docSnapshot.ref)
      })
      await deleteBatch.commit()
      console.log(`✅ ${snapshot.size} questões antigas removidas`)
    }
    
    // Migrar para Firebase em lotes
    console.log('📤 Iniciando upload para Firebase...')
    const batchSize = 500
    let migratedCount = 0
    
    for (let i = 0; i < questoes.length; i += batchSize) {
      const batch = writeBatch(db)
      const questoesBatch = questoes.slice(i, i + batchSize)
      
      for (const questao of questoesBatch) {
        const docRef = doc(questoesRef)
        batch.set(docRef, questao)
      }
      
      await batch.commit()
      migratedCount += questoesBatch.length
      
      console.log(`⏳ Migradas ${migratedCount}/${questoes.length} questões...`)
    }
    
    console.log('✅ Migração concluída com sucesso!')
    
    // Estatísticas por área
    const estatisticas = questoes.reduce((acc, questao) => {
      acc[questao.area] = (acc[questao.area] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📊 Questões por área:')
    Object.entries(estatisticas).forEach(([area, quantidade]) => {
      console.log(`  - ${area}: ${quantidade} questões`)
    })
    
    return NextResponse.json({
      success: true,
      message: 'Migração concluída com sucesso!',
      total: migratedCount,
      estatisticas,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    
    return NextResponse.json({
      success: false,
      message: `Erro na migração: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de migração de questões (CSV → Firebase)',
    endpoints: {
      'POST /api/admin/migrar-questoes-csv': 'Executa a migração das questões do CSV para o Firebase'
    }
  })
}
