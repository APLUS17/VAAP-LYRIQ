import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore, LyricSection as LyricSectionType } from '../state/lyricStore';

interface LyricSectionProps {
  section: LyricSectionType;
}

export function LyricSection({ section }: LyricSectionProps) {
  const { updateSection, toggleCollapse, removeSection } = useLyricStore();

  return (
    <View className="mb-6">
      {/* Section Header */}
      <Pressable
        onPress={() => toggleCollapse(section.id)}
        className="flex-row items-center justify-between mb-3"
      >
        <Text className="text-lg font-medium text-gray-200">
          {section.title}
        </Text>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => removeSection(section.id)}
            className="mr-3 p-1"
          >
            <Ionicons name="trash-outline" size={16} color="#6B7280" />
          </Pressable>
          <Ionicons
            name={section.collapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6B7280"
          />
        </View>
      </Pressable>

      {/* Section Content */}
      {!section.collapsed && (
        <TextInput
          multiline
          placeholder={`Write your ${section.type} here...`}
          value={section.content}
          onChangeText={(text) => updateSection(section.id, text)}
          className="rounded-lg p-4 min-h-[100px] text-base leading-6"
          style={{
            fontFamily: 'Georgia',
            textAlignVertical: 'top',
            backgroundColor: '#202020',
            borderColor: '#2F2F2F',
            borderWidth: 1,
            color: '#E5E7EB',
          }}
          placeholderTextColor="#9CA3AF"
        />
      )}
    </View>
  );
}