import { Questao } from '@/types/simulado';
import { parseCSVToQuestions } from './simulado-utils';
import { carregarQuestoesDoFirebase } from './migrador-questoes';

let questoesCache: Questao[] | null = null;

/**
 * Carrega questões do Firebase (preferencial) ou CSV (fallback)
 */
export async function carregarQuestoes(): Promise<Questao[]> {
  if (questoesCache) {
    return questoesCache;
  }

  try {
    console.log('Tentando carregar questões do Firebase...');
    
    // Primeiro tenta carregar do Firebase
    const questoesFirebase = await carregarQuestoesDoFirebase();
    
    if (questoesFirebase.length > 0) {
      console.log(`✅ Carregadas ${questoesFirebase.length} questões do Firebase`);
      questoesCache = questoesFirebase;
      return questoesCache;
    }
    
    console.log('⚠️ Nenhuma questão encontrada no Firebase, carregando do CSV...');
    
    // Fallback para CSV se Firebase estiver vazio
    const response = await fetch('/api/simulado/questoes');
    if (!response.ok) {
      throw new Error('Erro ao carregar questões do CSV');
    }
    
    const csvContent = await response.text();
    questoesCache = parseCSVToQuestions(csvContent);
    
    console.log(`✅ Carregadas ${questoesCache.length} questões do CSV`);
    return questoesCache;
    
  } catch (error) {
    console.error('Erro ao carregar questões:', error);
    return [];
  }
}

/**
 * Limpa o cache de questões
 */
export function limparCacheQuestoes(): void {
  questoesCache = null;
}
