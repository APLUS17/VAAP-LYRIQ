import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getSuggestNextLine, rewriteLine, findRhyme, styleAsArtist } from '../api/lyricAI';

interface AIPopoverProps {
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  sectionContent: string;
  sectionType: string;
  onSuggestion: (text: string) => void;
}

export function AIPopover({ 
  visible, 
  onClose, 
  position, 
  sectionContent, 
  sectionType, 
  onSuggestion 
}: AIPopoverProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const actions = [
    {
      id: 'next_line',
      label: 'Suggest next line',
      icon: 'add-circle-outline',
      action: async () => {
        setLoading('next_line');
        const suggestion = await getSuggestNextLine(sectionContent, sectionType);
        onSuggestion(suggestion);
        setLoading(null);
        onClose();
      }
    },
    {
      id: 'rewrite',
      label: 'Rewrite',
      icon: 'refresh-outline',
      action: async () => {
        if (!sectionContent.trim()) return;
        setLoading('rewrite');
        const lines = sectionContent.split('\n').filter(line => line.trim());
        const lastLine = lines[lines.length - 1] || '';
        const rewritten = await rewriteLine(lastLine, sectionContent);
        onSuggestion(rewritten);
        setLoading(null);
        onClose();
      }
    },
    {
      id: 'rhyme',
      label: 'Rhyme',
      icon: 'musical-notes-outline',
      action: async () => {
        setLoading('rhyme');
        const words = sectionContent.trim().split(/\s+/);
        const lastWord = words[words.length - 1]?.replace(/[.,!?]/g, '') || 'love';
        const rhyme = await findRhyme(lastWord, sectionContent);
        onSuggestion(rhyme);
        setLoading(null);
        onClose();
      }
    },
    {
      id: 'style',
      label: 'Style like Taylor Swift',
      icon: 'star-outline',
      action: async () => {
        if (!sectionContent.trim()) return;
        setLoading('style');
        const styled = await styleAsArtist(sectionContent, 'Taylor Swift');
        onSuggestion(styled);
        setLoading(null);
        onClose();
      }
    }
  ];

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1" 
        onPress={onClose}
      >
        <View
          className="absolute bg-white border border-gray-200 rounded-2xl shadow-lg px-2 py-2"
          style={{
            left: Math.min(position.x, screenWidth - 200),
            top: position.y + 10,
            minWidth: 180,
          }}
        >
          {actions.map((action, index) => (
            <Pressable
              key={action.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                action.action();
              }}
              className="flex-row items-center px-3 py-3 rounded-xl"
              style={{ opacity: loading === action.id ? 0.5 : 1 }}
              disabled={loading !== null}
            >
              <View className="w-6 h-6 mr-3 items-center justify-center">
                {loading === action.id ? (
                  <View className="w-4 h-4 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <Ionicons 
                    name={action.icon as any} 
                    size={18} 
                    color="#6366F1" 
                  />
                )}
              </View>
              <Text className="text-gray-900 text-sm font-medium">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}