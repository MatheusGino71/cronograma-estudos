import * as XLSX from 'xlsx';
import { db } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Questao, Alternativa } from '@/types/simulado';

interface QuestaoExcel {
  'ID Simulado'?: string | number;
  'ID Questão'?: string | number;
  'Área'?: string;
  'Questão'?: string;
  'Letter'?: string;
  'Alternativa'?: string;
  'Correct'?: string | number;
  [key: string]: unknown;
}

/**
 * Processa o arquivo Excel e converte para o formato de questões
 */
export async function processarArquivoExcel(filePath: string): Promise<Questao[]> {
  try {
    // Lê o arquivo Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Pega a primeira planilha
    const worksheet = workbook.Sheets[sheetName];
    
    // Converte para JSON
    const data: QuestaoExcel[] = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Processando ${data.length} questões do arquivo Excel...`);
    
    const questoes: Questao[] = [];
    const questoesAgrupadas = new Map<string, QuestaoExcel[]>();
    
    // Agrupa questões APENAS por ID da Questão (cada linha = 1 alternativa)
    data.forEach(row => {
      const idQuestao = String(row['ID Questão'] || '').trim();
      if (!idQuestao) return; // Ignora linhas sem ID
      
      if (!questoesAgrupadas.has(idQuestao)) {
        questoesAgrupadas.set(idQuestao, []);
      }
      questoesAgrupadas.get(idQuestao)!.push(row);
    });
    
    console.log(`📦 Total de questões únicas encontradas: ${questoesAgrupadas.size}`);
    
    // Processa cada grupo de questões
    let questaoId = 1;
    let questoesInvalidas = 0;
    
    questoesAgrupadas.forEach((linhas) => {
      if (linhas.length === 0) {
        questoesInvalidas++;
        return;
      }
      
      const primeiraLinha = linhas[0];
      const disciplina = String(primeiraLinha['Área'] || 'Geral').trim();
      const enunciadoOriginal = String(primeiraLinha['Questão'] || '');
      const enunciado = limparTextoHTML(enunciadoOriginal);
      
      if (!enunciado || enunciado.length < 10) {
        questoesInvalidas++;
        return;
      }
      
      const alternativas: Alternativa[] = [];
      const letrasProcessadas = new Set<string>();
      
      // Processa cada linha como uma alternativa
      linhas.forEach(linha => {
        const letra = String(linha['Letter'] || '').trim().toUpperCase();
        const textoOriginal = String(linha['Alternativa'] || '');
        const texto = limparTextoHTML(textoOriginal);
        const correta = linha['Correct'] === 1 || linha['Correct'] === '1' || String(linha['Correct']).trim() === '1';
        
        // Evita alternativas duplicadas pela letra
        if (letra && texto && !letrasProcessadas.has(letra)) {
          letrasProcessadas.add(letra);
          alternativas.push({
            letra,
            texto,
            correta
          });
        }
      });
      
      // Só adiciona questões com pelo menos 2 alternativas
      if (alternativas.length >= 2) {
        questoes.push({
          id: questaoId++,
          disciplina,
          enunciado,
          alternativas: alternativas.sort((a, b) => a.letra.localeCompare(b.letra))
        });
      } else {
        questoesInvalidas++;
      }
    });
    
    console.log(`✅ Processadas ${questoes.length} questões válidas`);
    console.log(`⚠️ Ignoradas ${questoesInvalidas} questões inválidas (sem alternativas suficientes)`);
    
    // Estatísticas por disciplina
    const estatisticas = questoes.reduce((acc, q) => {
      acc[q.disciplina] = (acc[q.disciplina] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📊 Questões por disciplina:');
    Object.entries(estatisticas).forEach(([disc, qtd]) => {
      console.log(`  - ${disc}: ${qtd} questões`);
    });
    
    return questoes;
    
  } catch (error) {
    console.error('Erro ao processar arquivo Excel:', error);
    throw error;
  }
}

/**
 * Limpa texto HTML e entidades - VERSÃO MELHORADA
 */
function limparTextoHTML(texto: string): string {
  if (!texto) return '';
  
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
  
  // Limpa espaços múltiplos e quebras de linha excessivas
  decoded = decoded
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
  
  return decoded.trim()
}

/**
 * Salva questões no Firebase Firestore
 */
export async function salvarQuestoesNoFirebase(questoes: Questao[]): Promise<void> {
  try {
    console.log(`Salvando ${questoes.length} questões no Firebase...`);
    
    const batch = writeBatch(db);
    const questoesCollection = collection(db, 'questoes');
    
    // Limpa questões existentes (opcional)
    const existingDocs = await getDocs(questoesCollection);
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Adiciona novas questões
    questoes.forEach((questao) => {
      const docRef = doc(questoesCollection, `questao_${questao.id}`);
      batch.set(docRef, {
        ...questao,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log('Questões salvas com sucesso no Firebase!');
    
  } catch (error) {
    console.error('Erro ao salvar questões no Firebase:', error);
    throw error;
  }
}

/**
 * Carrega questões do Firebase
 */
export async function carregarQuestoesDoFirebase(): Promise<Questao[]> {
  try {
    const questoesCollection = collection(db, 'questoes');
    const snapshot = await getDocs(questoesCollection);
    
    const questoes: Questao[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      questoes.push({
        id: data.id || doc.id,
        disciplina: data.disciplina || data.area || 'Geral',
        enunciado: data.enunciado || '',
        alternativas: data.alternativas || []
      });
    });
    
    console.log(`✅ Carregadas ${questoes.length} questões do Firebase`);
    return questoes;
    
  } catch (error) {
    console.error('❌ Erro ao carregar questões do Firebase:', error);
    return [];
  }
}

/**
 * Migra questões do Excel para o Firebase
 */
export async function migrarQuestoesExcelParaFirebase(filePath: string): Promise<void> {
  try {
    console.log('Iniciando migração de questões...');
    
    // 1. Processar arquivo Excel
    const questoes = await processarArquivoExcel(filePath);
    
    if (questoes.length === 0) {
      throw new Error('Nenhuma questão válida encontrada no arquivo Excel');
    }
    
    // 2. Salvar no Firebase
    await salvarQuestoesNoFirebase(questoes);
    
    // 3. Verificar se salvou corretamente
    const questoesSalvas = await carregarQuestoesDoFirebase();
    
    console.log(`Migração concluída! ${questoesSalvas.length} questões disponíveis no Firebase.`);
    
    // 4. Estatísticas por disciplina
    const estatisticas = questoesSalvas.reduce((acc, questao) => {
      acc[questao.disciplina] = (acc[questao.disciplina] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Questões por disciplina:');
    Object.entries(estatisticas).forEach(([disciplina, quantidade]) => {
      console.log(`- ${disciplina}: ${quantidade} questões`);
    });
    
  } catch (error) {
    console.error('Erro na migração:', error);
    throw error;
  }
}