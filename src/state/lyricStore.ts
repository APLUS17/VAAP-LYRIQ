import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LyricSection {
  id: string;
  type: 'verse' | 'chorus' | 'bridge';
  title: string;
  content: string;
  collapsed: boolean;
}

interface LyricState {
  sections: LyricSection[];
  addSection: (type: 'verse' | 'chorus' | 'bridge') => void;
  updateSection: (id: string, content: string) => void;
  toggleCollapse: (id: string) => void;
  removeSection: (id: string) => void;
}

export const useLyricStore = create<LyricState>()(
  persist(
    (set) => ({
      sections: [],
      
      addSection: (type) => set((state) => {
        const newSection: LyricSection = {
          id: Date.now().toString(),
          type,
          title: type.charAt(0).toUpperCase() + type.slice(1),
          content: '',
          collapsed: false,
        };
        return { sections: [...state.sections, newSection] };
      }),

      updateSection: (id, content) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? { ...section, content } : section
        ),
      })),

      toggleCollapse: (id) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? { ...section, collapsed: !section.collapsed } : section
        ),
      })),

      removeSection: (id) => set((state) => ({
        sections: state.sections.filter((section) => section.id !== id),
      })),
    }),
    {
      name: 'lyric-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);