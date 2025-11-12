import { Questao } from '@/types/simulado';
import { carregarQuestoesDoFirebase } from './migrador-questoes';

let questoesCache: Questao[] | null = null;

/**
 * Carrega questões do Firebase - SEM CACHE, SEMPRE ATUALIZADO
 */
export async function carregarQuestoes(): Promise<Questao[]> {
  try {
    console.log('🔍 Carregando questões do Firebase...');
    
    // Carrega SEMPRE do Firebase (sem cache para garantir dados atualizados)
    const questoesFirebase = await carregarQuestoesDoFirebase();
    
    console.log(`✅ Carregadas ${questoesFirebase.length} questões do Firebase`);
    
    // Atualiza cache
    questoesCache = questoesFirebase;
    
    return questoesFirebase;
    
  } catch (error) {
    console.error('❌ Erro ao carregar questões do Firebase:', error);
    return questoesCache || [];
  }
}

/**
 * Limpa o cache de questões
 */
export function limparCacheQuestoes(): void {
  questoesCache = null;
}
