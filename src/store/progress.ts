import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProgressLog, KPI, Insight } from '@/types';

interface ProgressState {
  logs: ProgressLog[];
  insights: Insight[];
  userId?: string;
  addLog: (log: ProgressLog) => void;
  getKPIs: () => KPI;
  generateInsights: () => void;
  clearLogs: () => void;
  setUserId: (userId: string | null) => void;
  resetProgressForNewUser: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      logs: [],
      insights: [],
      userId: undefined,
      
      addLog: (log) =>
        set((state) => ({
          logs: [...state.logs, log]
        })),
      
      getKPIs: () => {
        const { logs } = get();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const weeklyLogs = logs.filter(log => 
          new Date(log.completedAt) >= weekAgo
        );
        
        const monthlyLogs = logs.filter(log => 
          new Date(log.completedAt) >= monthAgo
        );
        
        const weeklyMinutes = weeklyLogs.reduce((sum, log) => sum + log.actualMinutes, 0);
        const monthlyMinutes = monthlyLogs.reduce((sum, log) => sum + log.actualMinutes, 0);
        
        // Calcula valores reais baseados nos logs
        const completedBlocks = weeklyLogs.length;
        const plannedBlocks = weeklyLogs.length; // Seria obtido do cronograma
        const adherence = plannedBlocks > 0 ? (completedBlocks / plannedBlocks) * 100 : 0;
        
        // Conta blocos únicos
        const uniqueBlocks = new Set(logs.map(log => log.blockId)).size;
        
        return {
          weeklyHours: Math.round(weeklyMinutes / 60 * 10) / 10,
          monthlyHours: Math.round(monthlyMinutes / 60 * 10) / 10,
          activeDisciplines: uniqueBlocks,
          adherencePercentage: Math.round(adherence),
          revisionsUpToDate: 0 // Precisa ser calculado baseado no cronograma
        };
      },
      
      generateInsights: () => {
        const kpis = get().getKPIs();
        const newInsights: Insight[] = [];
        
        if (kpis.adherencePercentage < 60) {
          newInsights.push({
            id: `insight-${Date.now()}-1`,
            type: 'warning',
            title: 'Baixa aderência ao cronograma',
            description: 'Sua aderência está abaixo de 60%. Considere reduzir 10% da carga horária.',
            action: 'Ajustar cronograma',
            createdAt: new Date().toISOString()
          });
        }
        
        if (kpis.weeklyHours > 40) {
          newInsights.push({
            id: `insight-${Date.now()}-2`,
            type: 'suggestion',
            title: 'Alta carga horária',
            description: 'Você está estudando mais de 40h por semana. Lembre-se de fazer pausas!',
            action: 'Incluir descanso',
            createdAt: new Date().toISOString()
          });
        }
        
        if (kpis.adherencePercentage >= 80) {
          newInsights.push({
            id: `insight-${Date.now()}-3`,
            type: 'achievement',
            title: 'Excelente aderência!',
            description: 'Parabéns! Você mantém uma aderência acima de 80%.',
            createdAt: new Date().toISOString()
          });
        }
        
        set({ insights: newInsights });
      },
      
      clearLogs: () =>
        set({ logs: [], insights: [] }),

      setUserId: (userId) =>
        set({ userId: userId || undefined }),

      resetProgressForNewUser: () =>
        set({ 
          logs: [],
          insights: []
        })
    }),
    {
      name: 'progress-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Migração da versão 1 para 2 - adicionar userId
          return {
            ...persistedState,
            userId: undefined
          }
        }
        return persistedState
      }
    }
  )
);
