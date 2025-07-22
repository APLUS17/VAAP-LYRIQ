import { create } from 'zustand';

export interface AIPreset {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

interface AIAssistantState {
  isVisible: boolean;
  isLoading: boolean;
  currentResponse: string;
  selectedText: string;
  showModal: () => void;
  hideModal: () => void;
  setLoading: (loading: boolean) => void;
  setResponse: (response: string) => void;
  setSelectedText: (text: string) => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  isVisible: false,
  isLoading: false,
  currentResponse: '',
  selectedText: '',
  
  showModal: () => set({ isVisible: true }),
  hideModal: () => set({ isVisible: false, currentResponse: '', selectedText: '' }),
  setLoading: (loading) => set({ isLoading: loading }),
  setResponse: (response) => set({ currentResponse: response }),
  setSelectedText: (text) => set({ selectedText: text }),
}));

export const aiPresets: AIPreset[] = [
  {
    id: 'suggest-next',
    title: 'Suggest Next Line',
    prompt: 'Given this lyric context, suggest the next line that flows naturally:',
    icon: 'arrow-forward-circle',
  },
  {
    id: 'rewrite-line',
    title: 'Rewrite This Line',
    prompt: 'Rewrite this line to make it more compelling while keeping the same meaning:',
    icon: 'refresh-circle',
  },
  {
    id: 'find-rhyme',
    title: 'Find Rhymes',
    prompt: 'Give me creative rhyming words and phrases for:',
    icon: 'musical-note',
  },
  {
    id: 'style-artist',
    title: 'Style Like Artist',
    prompt: 'Rewrite this in the style of [artist name]:',
    icon: 'person-circle',
  },
];