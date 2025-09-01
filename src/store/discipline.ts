import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Discipline } from '@/types';

interface DisciplineState {
  favorites: string[];
  comparison: string[];
  searchTerm: string;
  filters: {
    board?: string;
    level?: string;
    tags?: string[];
  };
  addToFavorites: (disciplineId: string) => void;
  removeFromFavorites: (disciplineId: string) => void;
  isFavorite: (disciplineId: string) => boolean;
  addToComparison: (disciplineId: string) => void;
  removeFromComparison: (disciplineId: string) => void;
  clearComparison: () => void;
  canAddToComparison: () => boolean;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: DisciplineState['filters']) => void;
  clearFilters: () => void;
}

export const useDisciplineStore = create<DisciplineState>()(
  persist(
    (set, get) => ({
      favorites: [],
      comparison: [],
      searchTerm: '',
      filters: {},
      
      addToFavorites: (disciplineId) =>
        set((state) => ({
          favorites: state.favorites.includes(disciplineId) 
            ? state.favorites 
            : [...state.favorites, disciplineId]
        })),
      
      removeFromFavorites: (disciplineId) =>
        set((state) => ({
          favorites: state.favorites.filter(id => id !== disciplineId)
        })),
      
      isFavorite: (disciplineId) =>
        get().favorites.includes(disciplineId),
      
      addToComparison: (disciplineId) => {
        const { comparison } = get();
        if (comparison.length < 3 && !comparison.includes(disciplineId)) {
          set((state) => ({
            comparison: [...state.comparison, disciplineId]
          }));
        }
      },
      
      removeFromComparison: (disciplineId) =>
        set((state) => ({
          comparison: state.comparison.filter(id => id !== disciplineId)
        })),
      
      clearComparison: () =>
        set({ comparison: [] }),
      
      canAddToComparison: () =>
        get().comparison.length < 3,
      
      setSearchTerm: (term) =>
        set({ searchTerm: term }),
      
      setFilters: (filters) =>
        set({ filters }),
      
      clearFilters: () =>
        set({ filters: {}, searchTerm: '' })
    }),
    {
      name: 'discipline-storage',
      version: 1,
    }
  )
);
