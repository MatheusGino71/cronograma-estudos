import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AtividadeEstudo {
  id: string
  disciplina: string
  tipo: 'teoria' | 'pratica' | 'revisao'
  titulo: string
  duracao: number
  concluida: boolean
  dataVencimento: Date
  prioridade: 'alta' | 'media' | 'baixa'
  descricao?: string
  recursos?: string[]
  metodo?: string
}

export interface PlanoEstudo {
  id: string
  nome: string
  disciplinas: string[]
  dataInicio: Date
  dataFim: Date
  atividades: AtividadeEstudo[]
  meta: {
    horasSemanais: number
    percentualMelhoria: number
  }
  ativo: boolean
  criadoEm: Date
  userId?: string
}

interface PlanoEstudoState {
  planos: PlanoEstudo[]
  planoAtivo: PlanoEstudo | null
  
  // Actions
  criarPlano: (plano: Omit<PlanoEstudo, 'id' | 'criadoEm'>) => void
  ativarPlano: (planoId: string) => void
  adicionarAtividade: (planoId: string, atividade: Omit<AtividadeEstudo, 'id'>) => void
  atualizarAtividade: (planoId: string, atividadeId: string, atualizacao: Partial<AtividadeEstudo>) => void
  concluirAtividade: (planoId: string, atividadeId: string) => void
  removerPlano: (planoId: string) => void
  
  // Getters
  getAtividadesPorDisciplina: (disciplina: string) => AtividadeEstudo[]
  getAtividadesHoje: () => AtividadeEstudo[]
  getProgressoGeral: () => { concluidas: number; total: number; porcentagem: number }
  getEstatisticas: () => {
    totalHoras: number
    horasConcluidas: number
    sequencia: number
    disciplinasFoco: string[]
  }
  
  // User management
  setUserId: (userId: string) => void
  resetDataForNewUser: () => void
  migrate: () => void
}

export const usePlanoEstudoStore = create<PlanoEstudoState>()(
  persist(
    (set, get) => ({
      planos: [],
      planoAtivo: null,

      criarPlano: (dadosPlano) => {
        const novoPlano: PlanoEstudo = {
          ...dadosPlano,
          id: `plano_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          criadoEm: new Date(),
        }

        set((state) => ({
          planos: [...state.planos, novoPlano],
          planoAtivo: dadosPlano.ativo ? novoPlano : state.planoAtivo
        }))
      },

      ativarPlano: (planoId) => {
        set((state) => {
          const planos = state.planos.map(plano => ({
            ...plano,
            ativo: plano.id === planoId
          }))
          
          const planoAtivo = planos.find(p => p.id === planoId) || null
          
          return { planos, planoAtivo }
        })
      },

      adicionarAtividade: (planoId, dadosAtividade) => {
        const novaAtividade: AtividadeEstudo = {
          ...dadosAtividade,
          id: `atividade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }

        set((state) => {
          const planos = state.planos.map(plano => 
            plano.id === planoId 
              ? { ...plano, atividades: [...plano.atividades, novaAtividade] }
              : plano
          )
          
          const planoAtivo = state.planoAtivo?.id === planoId 
            ? { ...state.planoAtivo, atividades: [...state.planoAtivo.atividades, novaAtividade] }
            : state.planoAtivo

          return { planos, planoAtivo }
        })
      },

      atualizarAtividade: (planoId, atividadeId, atualizacao) => {
        set((state) => {
          const planos = state.planos.map(plano =>
            plano.id === planoId
              ? {
                  ...plano,
                  atividades: plano.atividades.map(atividade =>
                    atividade.id === atividadeId
                      ? { ...atividade, ...atualizacao }
                      : atividade
                  )
                }
              : plano
          )

          const planoAtivo = state.planoAtivo?.id === planoId
            ? {
                ...state.planoAtivo,
                atividades: state.planoAtivo.atividades.map(atividade =>
                  atividade.id === atividadeId
                    ? { ...atividade, ...atualizacao }
                    : atividade
                )
              }
            : state.planoAtivo

          return { planos, planoAtivo }
        })
      },

      concluirAtividade: (planoId, atividadeId) => {
        get().atualizarAtividade(planoId, atividadeId, { concluida: true })
      },

      removerPlano: (planoId) => {
        set((state) => ({
          planos: state.planos.filter(p => p.id !== planoId),
          planoAtivo: state.planoAtivo?.id === planoId ? null : state.planoAtivo
        }))
      },

      getAtividadesPorDisciplina: (disciplina) => {
        const { planoAtivo } = get()
        if (!planoAtivo) return []
        
        return planoAtivo.atividades.filter(a => a.disciplina === disciplina)
      },

      getAtividadesHoje: () => {
        const { planoAtivo } = get()
        if (!planoAtivo) return []
        
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        
        return planoAtivo.atividades.filter(a => {
          const dataAtividade = new Date(a.dataVencimento)
          dataAtividade.setHours(0, 0, 0, 0)
          return dataAtividade.getTime() === hoje.getTime()
        })
      },

      getProgressoGeral: () => {
        const { planoAtivo } = get()
        if (!planoAtivo) return { concluidas: 0, total: 0, porcentagem: 0 }
        
        const total = planoAtivo.atividades.length
        const concluidas = planoAtivo.atividades.filter(a => a.concluida).length
        const porcentagem = total > 0 ? (concluidas / total) * 100 : 0
        
        return { concluidas, total, porcentagem }
      },

      getEstatisticas: () => {
        const { planoAtivo } = get()
        if (!planoAtivo) {
          return {
            totalHoras: 0,
            horasConcluidas: 0,
            sequencia: 0,
            disciplinasFoco: []
          }
        }

        const totalHoras = planoAtivo.atividades.reduce((acc, a) => acc + a.duracao, 0) / 60
        const horasConcluidas = planoAtivo.atividades
          .filter(a => a.concluida)
          .reduce((acc, a) => acc + a.duracao, 0) / 60

        // Calcular sequência de dias estudando
        const atividadesConcluidas = planoAtivo.atividades
          .filter(a => a.concluida)
          .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
        
        let sequencia = 0
        const hoje = new Date()
        
        // Simplificado: contar atividades concluídas recentemente
        const ultimaSemana = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)
        sequencia = atividadesConcluidas.filter(a => 
          new Date(a.dataVencimento) >= ultimaSemana
        ).length

        // Disciplinas com mais atividades de alta prioridade
        const disciplinasFoco = [...new Set(
          planoAtivo.atividades
            .filter(a => a.prioridade === 'alta')
            .map(a => a.disciplina)
        )].slice(0, 3)

        return {
          totalHoras,
          horasConcluidas,
          sequencia,
          disciplinasFoco
        }
      },

      setUserId: (userId: string) => {
        // Implementar filtro por usuário se necessário
        set((state) => ({
          ...state,
          planos: state.planos.map(plano => ({ ...plano, userId }))
        }))
      },

      resetDataForNewUser: () => {
        set({
          planos: [],
          planoAtivo: null
        })
      },

      migrate: () => {
        // Migração de dados se necessário
        const state = get()
        
        // Verificar e corrigir estruturas de dados
        const planosCorrigidos = state.planos.map(plano => ({
          ...plano,
          atividades: plano.atividades.map(atividade => ({
            ...atividade,
            dataVencimento: new Date(atividade.dataVencimento),
            concluida: Boolean(atividade.concluida)
          }))
        }))

        set({ planos: planosCorrigidos })
      }
    }),
    {
      name: 'plano-estudo-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migração da versão 0 para 1
          return {
            ...persistedState,
            planos: persistedState.planos || [],
            planoAtivo: persistedState.planoAtivo || null
          }
        }
        return persistedState
      }
    }
  )
)
