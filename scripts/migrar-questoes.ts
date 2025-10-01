/**
 * Script para migrar questões do arquivo Excel para o Firebase
 */

import path from 'path';
import fs from 'fs';
import { migrarQuestoesExcelParaFirebase } from '../src/lib/migrador-questoes';

// Configura o ambiente Next.js
process.env.NODE_ENV = 'development';

async function executarMigracao() {
  try {
    console.log('🚀 Iniciando migração de questões...\n');
    
    // Caminho para o arquivo Excel
    const arquivoExcel = path.join(process.cwd(), 'Questões MC.xlsx');
    
    console.log(`📁 Arquivo: ${arquivoExcel}`);
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(arquivoExcel)) {
      throw new Error(`Arquivo não encontrado: ${arquivoExcel}`);
    }
    
    console.log('✅ Arquivo encontrado\n');
    
    // Executa a migração
    await migrarQuestoesExcelParaFirebase(arquivoExcel);
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('🔥 As questões estão agora disponíveis no Firebase');
    
  } catch (error) {
    console.error('❌ Erro na migração:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Executa a migração
executarMigracao();