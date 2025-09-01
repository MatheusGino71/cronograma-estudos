import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlanSettings, StudyBlock } from '@/types';
import { disciplines } from '@/lib/seed';
import { useDisciplineStore } from '@/store/discipline';
import { useScheduleStore } from '@/store/schedule';

// React Query para gerenciar dados das disciplinas
export function useDisciplines() {
  return useQuery({
    queryKey: ['disciplines'],
    queryFn: () => Promise.resolve(disciplines),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useDiscipline(id: string) {
  return useQuery({
    queryKey: ['discipline', id],
    queryFn: () => {
      const discipline = disciplines.find(d => d.id === id);
      if (!discipline) throw new Error('Discipline not found');
      return Promise.resolve(discipline);
    },
    enabled: !!id,
  });
}

export function useFilteredDisciplines() {
  const { data: allDisciplines = [] } = useDisciplines();
  const { searchTerm, filters } = useDisciplineStore();
  
  return useQuery({
    queryKey: ['disciplines', 'filtered', searchTerm, filters],
    queryFn: () => {
      let filtered = [...allDisciplines];
      
      // Aplicar filtro de busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(discipline => 
          discipline.name.toLowerCase().includes(term) ||
          discipline.board.toLowerCase().includes(term) ||
          discipline.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }
      
      // Aplicar filtros
      if (filters.board) {
        filtered = filtered.filter(d => d.board === filters.board);
      }
      
      if (filters.level) {
        filtered = filtered.filter(d => d.level === filters.level);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(d => 
          filters.tags!.some(tag => d.tags.includes(tag))
        );
      }
      
      return Promise.resolve(filtered);
    },
    enabled: true,
  });
}

export function useGenerateSchedule() {
  const queryClient = useQueryClient();
  const addBlock = useScheduleStore((state) => state.add);
  
  return useMutation({
    mutationFn: async (settings: PlanSettings): Promise<{ blocks: StudyBlock[]; summary: any }> => {
      const response = await fetch('/api/cronograma/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate schedule');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Adicionar blocos ao store
      data.blocks.forEach(block => addBlock(block));
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

export function useAddDisciplineToSchedule() {
  const queryClient = useQueryClient();
  const addBlock = useScheduleStore((state) => state.add);
  
  return useMutation({
    mutationFn: async ({ disciplineId, type = 'Estudo', date, time }: {
      disciplineId: string;
      type?: 'Estudo' | 'Revisão' | 'Simulado';
      date: string;
      time: { start: string; end: string };
    }) => {
      const discipline = disciplines.find(d => d.id === disciplineId);
      if (!discipline) throw new Error('Discipline not found');
      
      const block: StudyBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        disciplineId,
        title: `${discipline.name} - ${type}`,
        date,
        start: time.start,
        end: time.end,
        type,
        pomodoros: type === 'Simulado' ? 3 : type === 'Revisão' ? 1 : 2,
        completed: false
      };
      
      return Promise.resolve(block);
    },
    onSuccess: (block) => {
      addBlock(block);
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}

// Função para obter estatísticas de uso das disciplinas
export function useDisciplineStats() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useQuery({
    queryKey: ['discipline-stats', blocks.length],
    queryFn: () => {
      const stats = disciplines.map(discipline => {
        const disciplineBlocks = blocks.filter(b => b.disciplineId === discipline.id);
        const completedBlocks = disciplineBlocks.filter(b => b.completed);
        
        const totalMinutes = disciplineBlocks.reduce((sum, block) => {
          const start = new Date(`2000-01-01T${block.start}`);
          const end = new Date(`2000-01-01T${block.end}`);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60);
        }, 0);
        
        const completedMinutes = completedBlocks.reduce((sum, block) => {
          const start = new Date(`2000-01-01T${block.start}`);
          const end = new Date(`2000-01-01T${block.end}`);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60);
        }, 0);
        
        return {
          ...discipline,
          totalBlocks: disciplineBlocks.length,
          completedBlocks: completedBlocks.length,
          totalHours: Math.round(totalMinutes / 60 * 10) / 10,
          completedHours: Math.round(completedMinutes / 60 * 10) / 10,
          progress: disciplineBlocks.length > 0 
            ? Math.round((completedBlocks.length / disciplineBlocks.length) * 100)
            : 0
        };
      });
      
      return Promise.resolve(stats);
    },
  });
}
