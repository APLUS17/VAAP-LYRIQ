import React from 'react';
import { View, ScrollView, Text, Pressable, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore } from '../state/lyricStore';
import { LyricSection } from '../components/LyricSection';

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
        <View className="mb-8">
          <Text className="text-2xl font-light text-gray-900 mb-2">
            Lyric Pad
          </Text>
          <Text className="text-sm text-gray-500">
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
        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-600 mb-3">
            Add Section
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {sectionTypes.map(({ type, label, icon }) => (
              <Pressable
                key={type}
                onPress={() => addSection(type)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3"
              >
                <Ionicons name={icon as any} size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-700">
                  + {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {sections.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="musical-notes" size={64} color="#E5E7EB" />
            <Text className="text-gray-400 text-center mt-4 text-base">
              Your lyrics will appear here.{'\n'}Tap a button above to get started.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}