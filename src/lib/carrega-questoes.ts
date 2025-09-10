import { Questao } from '@/types/simulado';
import { parseCSVToQuestions } from './simulado-utils';

let questoesCache: Questao[] | null = null;

/**
 * Carrega questões do arquivo CSV
 */
export async function carregarQuestoes(): Promise<Questao[]> {
  if (questoesCache) {
    return questoesCache;
  }

  try {
    const response = await fetch('/api/simulado/questoes');
    if (!response.ok) {
      throw new Error('Erro ao carregar questões');
    }
    
    const csvContent = await response.text();
    questoesCache = parseCSVToQuestions(csvContent);
    
    return questoesCache;
  } catch {
    // Erro ao carregar questões
    return [];
  }
}

/**
 * Limpa o cache de questões
 */
export function limparCacheQuestoes(): void {
  questoesCache = null;
}
