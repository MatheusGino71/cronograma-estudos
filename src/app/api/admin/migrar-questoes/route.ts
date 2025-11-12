import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { db } from '@/lib/firebase'
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore'

interface QuestaoExcel {
  'ID Simulado'?: string | number
  'ID Questão'?: string | number
  'Área'?: string
  'Questão'?: string
  'Letter'?: string
  'Alternativa'?: string
  'Correct'?: string | number
  [key: string]: unknown
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
    console.log('🚀 Iniciando migração do Excel...')
    
    const arquivoExcel = path.join(process.cwd(), 'Questões MC.xlsx')
    console.log(`📁 Arquivo: ${arquivoExcel}`)
    
    if (!fs.existsSync(arquivoExcel)) {
      return NextResponse.json({
        success: false,
        message: `Arquivo não encontrado: ${arquivoExcel}`
      }, { status: 404 })
    }
    
    // Lê o Excel usando buffer (mais compatível com OneDrive)
    console.log('📖 Lendo arquivo Excel...')
    const buffer = fs.readFileSync(arquivoExcel)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: QuestaoExcel[] = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`📊 Total de linhas: ${data.length}`)
    
    // Agrupa por ID da Questão
    const questoesMap = new Map<string, QuestaoExcel[]>()
    
    data.forEach(row => {
      const idQuestao = String(row['ID Questão'] || '').trim()
      if (!idQuestao) return
      
      if (!questoesMap.has(idQuestao)) {
        questoesMap.set(idQuestao, [])
      }
      questoesMap.get(idQuestao)!.push(row)
    })
    
    console.log(`📦 Questões únicas encontradas: ${questoesMap.size}`)
    
    // Processa questões
    interface QuestaoProcessada {
      id: number
      disciplina: string
      area: string
      enunciado: string
      alternativas: Array<{ letra: string; texto: string; correta: boolean }>
      criadoEm: Date
      ativo: boolean
    }
    
    const questoes: QuestaoProcessada[] = []
    let questaoId = 1
    
    questoesMap.forEach((linhas) => {
      if (linhas.length === 0) return
      
      const primeiraLinha = linhas[0]
      const disciplina = String(primeiraLinha['Área'] || 'Geral').trim()
      const enunciado = limparHTML(String(primeiraLinha['Questão'] || ''))
      
      if (!enunciado || enunciado.length < 10) return
      
      const alternativas: Array<{ letra: string; texto: string; correta: boolean }> = []
      const letrasProcessadas = new Set<string>()
      
      linhas.forEach(linha => {
        const letra = String(linha['Letter'] || '').trim().toUpperCase()
        const texto = limparHTML(String(linha['Alternativa'] || ''))
        const correta = linha['Correct'] === 1 || linha['Correct'] === '1' || String(linha['Correct']).trim() === '1'
        
        if (letra && texto && !letrasProcessadas.has(letra)) {
          letrasProcessadas.add(letra)
          alternativas.push({ letra, texto, correta })
        }
      })
      
      if (alternativas.length >= 2) {
        questoes.push({
          id: questaoId++,
          disciplina,
          area: disciplina,
          enunciado,
          alternativas: alternativas.sort((a, b) => a.letra.localeCompare(b.letra)),
          criadoEm: new Date(),
          ativo: true
        })
      }
    })
    
    console.log(`✅ ${questoes.length} questões processadas`)
    
    // Limpa Firebase
    console.log('🗑️ Limpando Firebase...')
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
    
    // Salva no Firebase em lotes
    console.log('💾 Salvando no Firebase...')
    const batchSize = 500
    let salvas = 0
    
    for (let i = 0; i < questoes.length; i += batchSize) {
      const batch = writeBatch(db)
      const lote = questoes.slice(i, i + batchSize)
      
      lote.forEach((questao) => {
        const docRef = doc(questoesRef)
        batch.set(docRef, questao)
      })
      
      await batch.commit()
      salvas += lote.length
      console.log(`⏳ ${salvas}/${questoes.length} questões salvas...`)
    }
    
    // Estatísticas
    const stats = questoes.reduce((acc, q) => {
      acc[q.disciplina] = (acc[q.disciplina] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📊 Questões por disciplina:', stats)
    
    return NextResponse.json({
      success: true,
      message: `${questoes.length} questões migradas com sucesso!`,
      total: questoes.length,
      estatisticas: stats
    })
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    return NextResponse.json({
      success: false,
      message: `Erro: ${(error as Error).message}`
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de migração de questões Excel → Firebase',
    arquivo: 'Questões MC.xlsx',
    endpoints: {
      'POST /api/admin/migrar-questoes': 'Migra todas as questões do Excel para o Firebase'
    }
  })
}