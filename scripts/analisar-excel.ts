/**
 * Script para analisar a estrutura do arquivo Excel
 */

import * as XLSX from 'xlsx';
import path from 'path';

async function analisarArquivoExcel() {
  try {
    console.log('🔍 Analisando estrutura do arquivo Excel...\n');
    
    const arquivoExcel = path.join(process.cwd(), 'Questões MC.xlsx');
    
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(arquivoExcel);
    
    console.log('📊 Planilhas encontradas:');
    workbook.SheetNames.forEach((name, index) => {
      console.log(`  ${index + 1}. ${name}`);
    });
    
    // Analisa a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    console.log(`\n📋 Analisando planilha: ${sheetName}`);
    
    // Pega as primeiras 5 linhas para análise
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`\n📏 Total de linhas: ${data.length}`);
    
    if (data.length > 0) {
      console.log('\n🔤 Cabeçalhos (primeira linha):');
      const headers = data[0] as string[];
      headers.forEach((header, index) => {
        console.log(`  ${index + 1}. ${header}`);
      });
      
      console.log('\n📝 Primeiras 3 linhas de dados:');
      for (let i = 1; i <= Math.min(3, data.length - 1); i++) {
        console.log(`\nLinha ${i + 1}:`);
        const row = data[i] as unknown[];
        headers.forEach((header, index) => {
          if (row[index] !== undefined && row[index] !== null && row[index] !== '') {
            console.log(`  ${header}: ${String(row[index]).substring(0, 100)}${String(row[index]).length > 100 ? '...' : ''}`);
          }
        });
      }
    }
    
    // Converte para JSON para análise mais detalhada
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`\n🗂️  Total de registros JSON: ${jsonData.length}`);
    
    if (jsonData.length > 0) {
      console.log('\n🔑 Chaves do primeiro registro:');
      const firstRecord = jsonData[0] as Record<string, unknown>;
      Object.keys(firstRecord).forEach((key, index) => {
        console.log(`  ${index + 1}. ${key}`);
      });
      
      console.log('\n📊 Exemplo do primeiro registro:');
      Object.entries(firstRecord).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const valueStr = String(value);
          console.log(`  ${key}: ${valueStr.substring(0, 150)}${valueStr.length > 150 ? '...' : ''}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao analisar arquivo:', error);
  }
}

// Executa a análise
analisarArquivoExcel();