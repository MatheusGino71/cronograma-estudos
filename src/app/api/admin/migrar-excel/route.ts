import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'
import { db } from '@/lib/firebase'
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore'

interface QuestaoExcel {
  'ObjectSimulationId'?: string | number
  'ObjectQuestionId'?: string | number
  'Area'?: string
  'QuestionStem'?: string
  'Letter'?: string
  'Description'?: string
  'Correct'?: string | number
}

function limparHTML(texto: string): string {
  if (!texto) return ''
  
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
  
  let decoded = String(texto)
  
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  })
  
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
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
  
  return decoded.trim()
}

export async function POST() {
  try {
    console.log('🚀 Iniciando migração Excel → Firebase...')
    
    const excelPath = path.join(process.cwd(), 'Questões MC.xlsx')
    
    console.log(`📁 Procurando arquivo: ${excelPath}`)
    
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({
        success: false,
        message: `Arquivo não encontrado: ${excelPath}. Verifique se o arquivo está na raiz do projeto.`
      }, { status: 404 })
    }
    
    console.log('📖 Lendo arquivo Excel...')
    const workbook = XLSX.readFile(excelPath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: QuestaoExcel[] = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 Total de linhas no Excel: ${data.length}`)
    
    // Agrupa por ID da Questão
    const questoesMap = new Map<string, {
      area: string
      enunciado: string
      alternativas: Array<{ letra: string; texto: string; correta: boolean }>
    }>()
    
    data.forEach(row => {
      const idQuestao = String(row['ObjectQuestionId'] || '').trim()
      if (!idQuestao) return
      
      const area = String(row['Area'] || 'Geral').trim()
      const enunciado = limparHTML(String(row['QuestionStem'] || ''))
      const letra = String(row['Letter'] || '').trim().toUpperCase()
      const texto = limparHTML(String(row['Description'] || ''))
      const correta = row['Correct'] === 1 || row['Correct'] === '1' || String(row['Correct']).trim() === '1'
      
      if (!questoesMap.has(idQuestao)) {
        questoesMap.set(idQuestao, {
          area,
          enunciado,
          alternativas: []
        })
      }
      
      const questao = questoesMap.get(idQuestao)!
      
      // Evita alternativas duplicadas pela letra
      const jaExiste = questao.alternativas.some(alt => alt.letra === letra)
      if (letra && texto && !jaExiste) {
        questao.alternativas.push({ letra, texto, correta })
      }
    })
    
    // Filtra questões válidas (com pelo menos 2 alternativas)
    const questoesValidas = Array.from(questoesMap.entries())
      .filter(([_, q]) => q.enunciado.length > 10 && q.alternativas.length >= 2)
      .map(([id, q], index) => ({
        id: index + 1,
        disciplina: q.area,
        area: q.area,
        enunciado: q.enunciado,
        alternativas: q.alternativas.sort((a, b) => a.letra.localeCompare(b.letra))
      }))
    
    console.log(`✅ Total de questões válidas: ${questoesValidas.length}`)
    
    // Limpa Firebase
    console.log('🗑️ Limpando questões antigas do Firebase...')
    const questoesRef = collection(db, 'questoes')
    const snapshot = await getDocs(questoesRef)
    
    if (!snapshot.empty) {
      const deleteBatch = writeBatch(db)
      snapshot.forEach(docSnapshot => {
        deleteBatch.delete(docSnapshot.ref)
      })
      await deleteBatch.commit()
      console.log(`✅ ${snapshot.size} questões antigas removidas`)
    }
    
    // Salva em lotes (Firestore permite 500 operações por batch)
    console.log('📤 Salvando questões no Firebase...')
    const batchSize = 500
    let totalSalvas = 0
    
    for (let i = 0; i < questoesValidas.length; i += batchSize) {
      const batch = writeBatch(db)
      const lote = questoesValidas.slice(i, i + batchSize)
      
      lote.forEach(questao => {
        const docRef = doc(questoesRef)
        batch.set(docRef, {
          ...questao,
          criadoEm: new Date(),
          ativo: true
        })
      })
      
      await batch.commit()
      totalSalvas += lote.length
      console.log(`⏳ Salvos ${totalSalvas}/${questoesValidas.length} questões...`)
    }
    
    // Estatísticas por área
    const estatisticas = questoesValidas.reduce((acc, q) => {
      acc[q.area] = (acc[q.area] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📊 Questões por área:')
    Object.entries(estatisticas).forEach(([area, qtd]) => {
      console.log(`  - ${area}: ${qtd} questões`)
    })
    
    return NextResponse.json({
      success: true,
      message: `✅ Migração concluída! ${totalSalvas} questões importadas com sucesso!`,
      total: totalSalvas,
      estatisticas,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    
    return NextResponse.json({
      success: false,
      message: `Erro: ${(error as Error).message}`,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de migração Excel → Firebase',
    info: 'Use POST para executar a migração de todas as questões do Excel para o Firebase',
    file: 'Questões MC.xlsx (raiz do projeto)'
  })
}
