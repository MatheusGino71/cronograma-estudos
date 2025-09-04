import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudyBlock } from '@/types';

interface ScheduleState {
  blocks: StudyBlock[];
  selectedDate: string;
  viewMode: 'week' | 'month';
  userId?: string;
  add: (block: StudyBlock) => void;
  update: (block: StudyBlock) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: 'week' | 'month') => void;
  getBlocksByDate: (date: string) => StudyBlock[];
  getBlocksByDateRange: (startDate: string, endDate: string) => StudyBlock[];
  setUserId: (userId: string | null) => void;
  resetDataForNewUser: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      blocks: [],
      selectedDate: new Date().toISOString().split('T')[0],
      viewMode: 'week',
      userId: undefined,
      
      add: (block) => 
        set((state) => ({ 
          blocks: [...state.blocks, block] 
        })),
      
      update: (block) => 
        set((state) => ({
          blocks: state.blocks.map(b => b.id === block.id ? block : b)
        })),
      
      remove: (id) => 
        set((state) => ({
          blocks: state.blocks.filter(b => b.id !== id)
        })),
      
      toggle: (id) => 
        set((state) => ({
          blocks: state.blocks.map(b => 
            b.id === id ? { ...b, completed: !b.completed } : b
          )
        })),
      
      setSelectedDate: (date) => 
        set({ selectedDate: date }),
      
      setViewMode: (mode) => 
        set({ viewMode: mode }),
      
      getBlocksByDate: (date) => {
        return get().blocks.filter(block => block.date === date);
      },
      
      getBlocksByDateRange: (startDate, endDate) => {
        return get().blocks.filter(block => 
          block.date >= startDate && block.date <= endDate
        );
      },

      setUserId: (userId) =>
        set({ userId: userId || undefined }),

      resetDataForNewUser: () =>
        set({ 
          blocks: [],
          selectedDate: new Date().toISOString().split('T')[0],
          viewMode: 'week'
        })
    }),
    {
      name: 'schedule-storage',
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
