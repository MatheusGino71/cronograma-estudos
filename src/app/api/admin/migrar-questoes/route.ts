import { NextResponse } from 'next/server'
import path from 'path'
import { migrarQuestoesExcelParaFirebase } from '@/lib/migrador-questoes'

export async function POST() {
  try {
    console.log('🚀 Iniciando migração via API...')
    
    // Caminho para o arquivo Excel
    const arquivoExcel = path.join(process.cwd(), 'Questões MC.xlsx')
    
    console.log(`📁 Arquivo: ${arquivoExcel}`)
    
    // Executa a migração
    await migrarQuestoesExcelParaFirebase(arquivoExcel)
    
    return NextResponse.json({
      success: true,
      message: 'Migração concluída com sucesso!',
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
    message: 'API de migração de questões',
    endpoints: {
      'POST /api/admin/migrar-questoes': 'Executa a migração das questões do Excel para o Firebase'
    }
  })
}