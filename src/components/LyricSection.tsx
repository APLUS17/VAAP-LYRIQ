import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLyricStore, LyricSection as LyricSectionType } from '../state/lyricStore';
import { AIPopover } from './AIPopover';
import { cn } from '../utils/cn';

interface LyricSectionProps {
  section: LyricSectionType;
}

export function LyricSection({ section }: LyricSectionProps) {
  const { updateSection, toggleCollapse, removeSection } = useLyricStore();
  const [showAIPopover, setShowAIPopover] = useState(false);
  const [aiPosition, setAIPosition] = useState({ x: 0, y: 0 });
  const aiButtonRef = useRef<View>(null);

  const handleAIPress = () => {
    aiButtonRef.current?.measureInWindow((x, y, width, height) => {
      setAIPosition({ x: x + width / 2, y: y + height });
      setShowAIPopover(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });
  };

  const handleAISuggestion = (suggestion: string) => {
    if (section.content.trim()) {
      updateSection(section.id, section.content + '\n' + suggestion);
    } else {
      updateSection(section.id, suggestion);
    }
  };

  return (
    <View className="mb-6">
      {/* Section Header */}
      <Pressable
        onPress={() => toggleCollapse(section.id)}
        className="flex-row items-center justify-between mb-3"
      >
        <View className="flex-row items-center">
          <Text className="text-lg font-medium text-gray-900 mr-3">
            {section.title}
          </Text>
          <Pressable
            ref={aiButtonRef}
            onPress={handleAIPress}
            className="p-1.5 rounded-full"
            style={{ backgroundColor: '#F3F4F6' }}
          >
            <Ionicons name="sparkles" size={14} color="#6366F1" />
          </Pressable>
        </View>
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
          className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px] text-base leading-6"
          style={{
            fontFamily: 'Georgia',
            textAlignVertical: 'top',
          }}
          placeholderTextColor="#9CA3AF"
        />
      )}

      <AIPopover
        visible={showAIPopover}
        onClose={() => setShowAIPopover(false)}
        position={aiPosition}
        sectionContent={section.content}
        sectionType={section.type}
        onSuggestion={handleAISuggestion}
      />
    </View>
  );
}