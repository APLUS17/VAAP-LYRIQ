import React from 'react';
import { View, ScrollView, Text, Pressable, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore } from '../state/lyricStore';
import { LyricSection } from '../components/LyricSection';
import { AIAssistantButton } from '../components/AIAssistantButton';
import { AIAssistantModal } from '../components/AIAssistantModal';

export function LyricPadScreen() {
  const insets = useSafeAreaInsets();
  const { sections, addSection } = useLyricStore();

  const sectionTypes = [
    { type: 'verse' as const, label: 'Verse', icon: 'musical-note' },
    { type: 'chorus' as const, label: 'Chorus', icon: 'repeat' },
    { type: 'bridge' as const, label: 'Bridge', icon: 'git-branch' },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingHorizontal: 24,
          paddingTop: insets.top + 20,
          paddingBottom: 100 
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {/* Header */}
        <View className="mb-10">
          <Text 
            className="text-3xl text-gray-900 mb-3"
            style={{ 
              fontFamily: 'Georgia',
              fontWeight: '300',
              letterSpacing: -0.5,
            }}
          >
            Lyric Pad
          </Text>
          <Text 
            className="text-sm text-gray-600"
            style={{
              fontFamily: 'System',
              fontWeight: '500',
              letterSpacing: 0.2,
            }}
          >
            {sections.length === 0 
              ? "Start writing your song" 
              : `${sections.length} section${sections.length !== 1 ? 's' : ''}`
            }
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section) => (
          <LyricSection key={section.id} section={section} />
        ))}

        {/* Add Section Buttons */}
        <View className="mb-10">
          <Text 
            className="text-sm text-gray-600 mb-4"
            style={{
              fontFamily: 'System',
              fontWeight: '600',
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}
          >
            Add Section
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {sectionTypes.map(({ type, label, icon }) => {
              const getButtonColors = (buttonType: string) => {
                switch (buttonType) {
                  case 'verse':
                    return { bg: '#EFF6FF', border: '#DBEAFE', text: '#1D4ED8', icon: '#3B82F6' };
                  case 'chorus':
                    return { bg: '#FAF5FF', border: '#E9D5FF', text: '#7C3AED', icon: '#8B5CF6' };
                  case 'bridge':
                    return { bg: '#ECFDF5', border: '#D1FAE5', text: '#059669', icon: '#10B981' };
                  default:
                    return { bg: '#F9FAFB', border: '#E5E7EB', text: '#374151', icon: '#6B7280' };
                }
              };
              
              const colors = getButtonColors(type);
              
              return (
                <Pressable
                  key={type}
                  onPress={() => addSection(type)}
                  className="flex-row items-center rounded-2xl px-5 py-3.5 border"
                  style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 1,
                  }}
                >
                  <Ionicons name={icon as any} size={18} color={colors.icon} />
                  <Text 
                    className="ml-2.5 text-sm"
                    style={{
                      fontFamily: 'System',
                      fontWeight: '600',
                      color: colors.text,
                    }}
                  >
                    + {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Empty State */}
        {sections.length === 0 && (
          <View className="items-center justify-center py-16">
            <View 
              className="w-20 h-20 rounded-full bg-gray-50 items-center justify-center mb-6"
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Ionicons name="musical-notes" size={32} color="#9CA3AF" />
            </View>
            <Text 
              className="text-gray-500 text-center text-base leading-6"
              style={{
                fontFamily: 'System',
                fontWeight: '400',
                maxWidth: 240,
              }}
            >
              Your lyrics will appear here.{'\n'}Tap a button above to get started.
            </Text>
          </View>
        )}

      </ScrollView>

      {/* AI Assistant */}
      <AIAssistantButton />
      <AIAssistantModal />
    </View>
  );
}