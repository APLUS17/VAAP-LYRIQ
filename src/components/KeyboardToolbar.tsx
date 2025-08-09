import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Keyboard, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getSuggestNextLine, rewriteLine, findRhyme } from '../api/lyricAI';

interface KeyboardToolbarProps {
  sectionContent: string;
  sectionType: string;
  onSuggestion: (text: string) => void;
}

export function KeyboardToolbar({ 
  sectionContent, 
  sectionType, 
  onSuggestion 
}: KeyboardToolbarProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const slideAnim = new Animated.Value(-60);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.spring(slideAnim, {
        toValue: -60,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start(() => {
        setKeyboardVisible(false);
      });
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const actions = [
    {
      id: 'next',
      icon: 'add-circle',
      label: 'Next',
      action: async () => {
        setLoading('next');
        const suggestion = await getSuggestNextLine(sectionContent, sectionType);
        onSuggestion(suggestion);
        setLoading(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    {
      id: 'rewrite',
      icon: 'refresh',
      label: 'Rewrite',
      action: async () => {
        if (!sectionContent.trim()) return;
        setLoading('rewrite');
        const lines = sectionContent.split('\n').filter(line => line.trim());
        const lastLine = lines[lines.length - 1] || '';
        const rewritten = await rewriteLine(lastLine, sectionContent);
        onSuggestion(rewritten);
        setLoading(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    {
      id: 'rhyme',
      icon: 'musical-notes',
      label: 'Rhyme',
      action: async () => {
        setLoading('rhyme');
        const words = sectionContent.trim().split(/\s+/);
        const lastWord = words[words.length - 1]?.replace(/[.,!?]/g, '') || 'love';
        const rhyme = await findRhyme(lastWord, sectionContent);
        onSuggestion(rhyme);
        setLoading(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  ];

  if (!keyboardVisible) return null;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray-800"
      style={{ paddingBottom: insets.bottom, backgroundColor: '#1F1F1F' }}
    >
      <View className="flex-row items-center px-4 py-2">
        <View className="flex-row items-center mr-3">
          <Ionicons name="sparkles" size={16} color="#6366F1" />
          <Text className="ml-2 text-sm font-medium text-gray-700">
            AI Assist
          </Text>
        </View>
        
        <View className="flex-row items-center space-x-3">
          {actions.map((action) => (
            <Pressable
              key={action.id}
              onPress={action.action}
              disabled={loading !== null}
              className="flex-row items-center bg-gray-100 rounded-full px-3 py-2"
              style={{ opacity: loading === action.id ? 0.5 : 1 }}
            >
              {loading === action.id ? (
                <View className="w-4 h-4 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <Ionicons 
                  name={action.icon as any} 
                  size={14} 
                  color="#6366F1" 
                />
              )}
              <Text className="ml-1 text-xs font-medium text-gray-700">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}