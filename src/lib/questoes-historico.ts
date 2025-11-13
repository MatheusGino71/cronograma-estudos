import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  updateDoc,
  doc
} from 'firebase/firestore'
import { db } from './firebase'
import type { QuestaoHistorico, EstatisticasQuestoes, RespostaUsuario, Questao } from '@/types/simulado'

const COLECAO_HISTORICO = 'questoes_historico'

/**
 * Salva uma resposta de questão no histórico do usuário
 */
export async function salvarRespostaQuestao(
  userId: string,
  questao: Questao,
  respostaUsuario: string,
  acertou: boolean,
  tempoResposta: number,
  simuladoId?: string
): Promise<void> {
  try {
    const historicoExistente = await buscarQuestaoHistorico(userId, questao.id)
    
    const questaoHistorico: Omit<QuestaoHistorico, 'tentativas'> & { userId: string } = {
      userId,
      questaoId: questao.id,
      disciplina: questao.disciplina,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      respostaCorreta: questao.alternativas.find(a => a.correta)?.letra || '',
      respostaUsuario,
      acertou,
      dataResposta: new Date().toISOString(),
      tempoResposta,
      simuladoId
    }

    if (historicoExistente) {
      const docRef = doc(db, COLECAO_HISTORICO, historicoExistente.docId)
      await updateDoc(docRef, {
        ...questaoHistorico,
        tentativas: historicoExistente.tentativas + 1,
        dataResposta: new Date().toISOString()
      })
    } else {
      await addDoc(collection(db, COLECAO_HISTORICO), {
        ...questaoHistorico,
        tentativas: 1
      })
    }
  } catch (error) {
    console.error('Erro ao salvar resposta:', error)
    throw error
  }
}

async function buscarQuestaoHistorico(
  userId: string, 
  questaoId: number
): Promise<(QuestaoHistorico & { docId: string }) | null> {
  try {
    const q = query(
      collection(db, COLECAO_HISTORICO),
      where('userId', '==', userId),
      where('questaoId', '==', questaoId),
      limit(1)
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const docSnap = snapshot.docs[0]
    return {
      ...(docSnap.data() as QuestaoHistorico),
      docId: docSnap.id
    }
  } catch (error) {
    console.error('Erro ao buscar questão no histórico:', error)
    return null
  }
}

export async function salvarRespostasSimulado(
  userId: string,
  questoes: Questao[],
  respostas: RespostaUsuario[],
  simuladoId?: string
): Promise<void> {
  try {
    const promises = respostas.map(resposta => {
      const questao = questoes.find(q => q.id === resposta.questaoId)
      if (!questao) return Promise.resolve()
      
      return salvarRespostaQuestao(
        userId,
        questao,
        resposta.alternativaSelecionada,
        resposta.correta,
        resposta.tempo,
        simuladoId
      )
    })
    
    await Promise.all(promises)
  } catch (error) {
    console.error('Erro ao salvar respostas do simulado:', error)
    throw error
  }
}

export async function buscarQuestoesErradas(
  userId: string,
  disciplina?: string
): Promise<QuestaoHistorico[]> {
  try {
    let q = query(
      collection(db, COLECAO_HISTORICO),
      where('userId', '==', userId),
      where('acertou', '==', false),
      orderBy('dataResposta', 'desc')
    )
    
    if (disciplina) {
      q = query(
        collection(db, COLECAO_HISTORICO),
        where('userId', '==', userId),
        where('acertou', '==', false),
        where('disciplina', '==', disciplina),
        orderBy('dataResposta', 'desc')
      )
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as QuestaoHistorico)
  } catch (error) {
    console.error('Erro ao buscar questões erradas:', error)
    return []
  }
}

export async function buscarEstatisticas(userId: string): Promise<EstatisticasQuestoes> {
  try {
    const q = query(
      collection(db, COLECAO_HISTORICO),
      where('userId', '==', userId)
    )
    
    const snapshot = await getDocs(q)
    const questoes = snapshot.docs.map(doc => doc.data() as QuestaoHistorico)
    
    const totalRespondidas = questoes.length
    const totalAcertos = questoes.filter(q => q.acertou).length
    const totalErros = questoes.filter(q => !q.acertou).length
    const taxaAcerto = totalRespondidas > 0 ? (totalAcertos / totalRespondidas) * 100 : 0
    
    const questoesPorDisciplina: Record<string, {
      total: number;
      acertos: number;
      erros: number;
      taxaAcerto: number;
    }> = {}
    
    questoes.forEach(questao => {
      if (!questoesPorDisciplina[questao.disciplina]) {
        questoesPorDisciplina[questao.disciplina] = {
          total: 0,
          acertos: 0,
          erros: 0,
          taxaAcerto: 0
        }
      }
      
      questoesPorDisciplina[questao.disciplina].total++
      
      if (questao.acertou) {
        questoesPorDisciplina[questao.disciplina].acertos++
      } else {
        questoesPorDisciplina[questao.disciplina].erros++
      }
    })
    
    Object.keys(questoesPorDisciplina).forEach(disciplina => {
      const stats = questoesPorDisciplina[disciplina]
      stats.taxaAcerto = (stats.acertos / stats.total) * 100
    })
    
    const questoesErradas = questoes.filter(q => !q.acertou)
    
    return {
      totalRespondidas,
      totalAcertos,
      totalErros,
      taxaAcerto,
      questoesErradas,
      questoesPorDisciplina
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      totalRespondidas: 0,
      totalAcertos: 0,
      totalErros: 0,
      taxaAcerto: 0,
      questoesErradas: [],
      questoesPorDisciplina: {}
    }
  }
}
