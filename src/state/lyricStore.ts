import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LyricSection {
  id: string;
  type: string;
  title: string;
  content: string;
  count: number;
}

interface LyricState {
  // Recording Modal State
  isRecordingModalVisible: boolean;
  toggleRecordingModal: (value?: boolean) => void;
  
  // View Mode State
  isPerformanceMode: boolean;
  togglePerformanceMode: (value?: boolean) => void;
  
  // Sections State
  sections: LyricSection[];
  addSection: (type: string) => void;
  updateSection: (id: string, content: string) => void;
  updateSectionType: (id: string, type: string) => void;
  updateSectionCount: (id: string, count: number) => void;
  removeSection: (id: string) => void;
  reorderSections: (draggedId: string, direction: string, currentIndex: number) => void;
}

export const useLyricStore = create<LyricState>()(
  persist(
    (set) => ({
      // Recording Modal State
      isRecordingModalVisible: false,
      toggleRecordingModal: (value) =>
        set((state) => ({
          isRecordingModalVisible: value ?? !state.isRecordingModalVisible,
        })),

      // View Mode State
      isPerformanceMode: false,
      togglePerformanceMode: (value) =>
        set((state) => ({
          isPerformanceMode: value ?? !state.isPerformanceMode,
        })),

      // Sections State
      sections: [],
      
      addSection: (type) => set((state) => {
        const newSection: LyricSection = {
          id: Date.now().toString(),
          type,
          title: type.charAt(0).toUpperCase() + type.slice(1),
          content: '',
          count: 1,
        };
        return { sections: [...state.sections, newSection] };
      }),

      updateSection: (id, content) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? { ...section, content } : section
        ),
      })),

      updateSectionType: (id, type) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id
            ? { ...section, type, title: type.charAt(0).toUpperCase() + type.slice(1) }
            : section
        ),
      })),

      updateSectionCount: (id, count) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? { ...section, count: Math.max(1, count) } : section
        ),
      })),

      removeSection: (id) => set((state) => ({
        sections: state.sections.filter((section) => section.id !== id),
      })),

      reorderSections: (draggedId, direction, currentIndex) => set((state) => {
        const newSections = [...state.sections];
        const draggedIndex = newSections.findIndex((s) => s.id === draggedId);

        if (draggedIndex === -1) return state;

        const targetIndex =
          direction === 'down'
            ? Math.min(draggedIndex + 1, newSections.length - 1)
            : Math.max(draggedIndex - 1, 0);

        if (targetIndex === draggedIndex) return state;

        const [draggedSection] = newSections.splice(draggedIndex, 1);
        newSections.splice(targetIndex, 0, draggedSection);

        return { sections: newSections };
      }),
    }),
    {
      name: 'lyric-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sections: state.sections }), // Only persist sections, not modal state
    }
  )
);