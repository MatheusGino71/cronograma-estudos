import { PlanSettings, StudyBlock } from '@/types';
import { disciplines } from '@/lib/seed';
import { useDisciplineStore } from '@/store/discipline';
import { useScheduleStore } from '@/store/schedule';
import { useMemo, useState } from 'react';

// Hook simples para gerenciar dados das disciplinas (sem React Query)
export function useDisciplines() {
  return {
    data: disciplines,
    isLoading: false,
    error: null,
  };
}

export function useDiscipline(id: string) {
  const discipline = useMemo(() => {
    return disciplines.find(d => d.id === id) || null;
  }, [id]);

  return {
    data: discipline,
    isLoading: false,
    error: discipline ? null : new Error('Discipline not found'),
  };
}

export function useFilteredDisciplines() {
  const { data: allDisciplines = [] } = useDisciplines();
  const { searchTerm, filters } = useDisciplineStore();
  
  return useMemo(() => {
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
    
    return {
      data: filtered,
      isLoading: false,
      error: null,
    };
  }, [allDisciplines, searchTerm, filters]);
}

export function useGenerateSchedule() {
  const addBlock = useScheduleStore((state) => state.add);
  const [isPending, setIsPending] = useState(false);
  
  const generateSchedule = async (settings: PlanSettings): Promise<{ blocks: StudyBlock[]; summary: any }> => {
    setIsPending(true);
    try {
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
      
      const data = await response.json();
      
      // Adicionar blocos ao store
      data.blocks.forEach((block: StudyBlock) => addBlock(block));
      
      return data;
    } finally {
      setIsPending(false);
    }
  };
  
  return { mutateAsync: generateSchedule, isPending };
}

export function useAddDisciplineToSchedule() {
  const addBlock = useScheduleStore((state) => state.add);
  const [isPending, setIsPending] = useState(false);
  
  const addDisciplineToSchedule = async ({ disciplineId, type = 'Estudo', date, time }: {
    disciplineId: string;
    type?: 'Estudo' | 'Revisão' | 'Simulado';
    date: string;
    time: { start: string; end: string };
  }) => {
    setIsPending(true);
    try {
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
      
      addBlock(block);
      return block;
    } finally {
      setIsPending(false);
    }
  };
  
  return { mutateAsync: addDisciplineToSchedule, isPending };
}

// Função para obter estatísticas de uso das disciplinas
export function useDisciplineStats() {
  const blocks = useScheduleStore((state) => state.blocks);
  
  return useMemo(() => {
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
    
    return {
      data: stats,
      isLoading: false,
      error: null,
    };
  }, [blocks]);
}
