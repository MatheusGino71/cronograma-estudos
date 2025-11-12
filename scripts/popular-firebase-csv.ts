/**
 * Script para popular o Firebase com questões do arquivo CSV
 */

import * as fs from 'fs';
import * as path from 'path';
import { db } from '../src/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Questao, Alternativa } from '../src/types/simulado';

interface LinhaCSV {
  ObjectSimulationId: string;
  ObjectQuestionId: string;
  Area: string;
  QuestionStem: string;
  Letter: string;
  Description: string;
  Correct: string;
}

/**
 * Parse CSV file
 */
function parseCSV(filePath: string): LinhaCSV[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const result: LinhaCSV[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length < 7) continue;
    
    result.push({
      ObjectSimulationId: values[0],
      ObjectQuestionId: values[1],
      Area: values[2],
      QuestionStem: values[3],
      Letter: values[4],
      Description: values[5],
      Correct: values[6]
    });
  }
  
  return result;
}

/**
 * Limpa HTML entities
 */
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Agrupa linhas CSV em questões
 */
function agruparQuestoes(linhas: LinhaCSV[]): Questao[] {
  const questoesMap = new Map<string, {
    area: string;
    enunciado: string;
    alternativas: Alternativa[];
  }>();
  
  linhas.forEach(linha => {
    const questionId = linha.ObjectQuestionId;
    
    if (!questoesMap.has(questionId)) {
      questoesMap.set(questionId, {
        area: linha.Area,
        enunciado: decodeHTMLEntities(linha.QuestionStem),
        alternativas: []
      });
    }
    
    const questao = questoesMap.get(questionId)!;
    
    // Evita duplicatas
    const jaExiste = questao.alternativas.some(alt => alt.letra === linha.Letter);
    if (!jaExiste) {
      questao.alternativas.push({
        letra: linha.Letter,
        texto: decodeHTMLEntities(linha.Description),
        correta: linha.Correct.trim() === '1'
      });
    }
  });
  
  // Converte para array de Questao
  const questoes: Questao[] = [];
  let id = 1;
  
  questoesMap.forEach((dados) => {
    if (dados.alternativas.length >= 2) {
      questoes.push({
        id: id++,
        disciplina: dados.area,
        enunciado: dados.enunciado,
        alternativas: dados.alternativas.sort((a, b) => a.letra.localeCompare(b.letra))
      });
    }
  });
  
  return questoes;
}

/**
 * Salva questões no Firebase
 */
async function salvarNoFirebase(questoes: Questao[]): Promise<void> {
  console.log(`\n📤 Salvando ${questoes.length} questões no Firebase...`);
  
  const questoesCollection = collection(db, 'questoes');
  
  // Firebase batch tem limite de 500 operações
  const BATCH_SIZE = 500;
  let processadas = 0;
  
  for (let i = 0; i < questoes.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const lote = questoes.slice(i, i + BATCH_SIZE);
    
    lote.forEach((questao) => {
      const docRef = doc(questoesCollection, `questao_${questao.id}`);
      batch.set(docRef, {
        ...questao,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    processadas += lote.length;
    console.log(`   Progresso: ${processadas}/${questoes.length}`);
  }
  
  console.log('✅ Questões salvas com sucesso!');
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Iniciando população do Firebase com questões do CSV\n');
    
    // 1. Localizar arquivo CSV
    const csvPath = path.join(__dirname, '../public/questoes.csv');
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`Arquivo não encontrado: ${csvPath}`);
    }
    
    console.log('📄 Arquivo encontrado:', csvPath);
    
    // 2. Parse do CSV
    console.log('\n📖 Lendo e processando CSV...');
    const linhas = parseCSV(csvPath);
    console.log(`   ${linhas.length} linhas lidas`);
    
    // 3. Agrupar em questões
    const questoes = agruparQuestoes(linhas);
    console.log(`   ${questoes.length} questões válidas processadas`);
    
    // 4. Estatísticas por disciplina
    const estatisticas = questoes.reduce((acc, q) => {
      acc[q.disciplina] = (acc[q.disciplina] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📊 Questões por disciplina:');
    Object.entries(estatisticas)
      .sort(([, a], [, b]) => b - a)
      .forEach(([disciplina, qtd]) => {
        console.log(`   ${disciplina}: ${qtd} questões`);
      });
    
    // 5. Salvar no Firebase
    await salvarNoFirebase(questoes);
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log(`   Total: ${questoes.length} questões no Firebase`);
    
  } catch (error) {
    console.error('\n❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar
main();
