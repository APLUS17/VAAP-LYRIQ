import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore, LyricSection as LyricSectionType } from '../state/lyricStore';
import { cn } from '../utils/cn';

interface LyricSectionProps {
  section: LyricSectionType;
}

export function LyricSection({ section }: LyricSectionProps) {
  const { updateSection, toggleCollapse, removeSection } = useLyricStore();

  // Color scheme for different section types
  const getSectionColors = (type: string) => {
    switch (type) {
      case 'verse':
        return {
          bg: 'bg-blue-50/50',
          border: 'border-blue-100',
          accent: '#3B82F6',
        };
      case 'chorus':
        return {
          bg: 'bg-purple-50/50',
          border: 'border-purple-100',
          accent: '#8B5CF6',
        };
      case 'bridge':
        return {
          bg: 'bg-emerald-50/50',
          border: 'border-emerald-100',
          accent: '#10B981',
        };
      default:
        return {
          bg: 'bg-gray-50/50',
          border: 'border-gray-100',
          accent: '#6B7280',
        };
    }
  };

  const colors = getSectionColors(section.type);

  return (
    <View 
      className={cn(
        "mb-6 rounded-2xl border shadow-sm shadow-black/5",
        colors.bg,
        colors.border
      )}
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Section Header */}
      <Pressable
        onPress={() => toggleCollapse(section.id)}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <Text 
          className="text-xl font-light text-gray-900"
          style={{ 
            fontFamily: 'Georgia',
            fontWeight: '300',
            letterSpacing: 0.3,
          }}
        >
          {section.title}
        </Text>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => removeSection(section.id)}
            className="mr-3 p-2 rounded-full"
            style={{ backgroundColor: `${colors.accent}10` }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.accent} />
          </Pressable>
          <Ionicons
            name={section.collapsed ? "chevron-down" : "chevron-up"}
            size={22}
            color={colors.accent}
          />
        </View>
      </Pressable>

      {/* Section Content */}
      {!section.collapsed && (
        <View className="px-5 pb-5">
          <TextInput
            multiline
            placeholder={`Write your ${section.type} here...`}
            value={section.content}
            onChangeText={(text) => updateSection(section.id, text)}
            className="bg-white/80 rounded-xl p-4 min-h-[120px] text-base leading-7"
            style={{
              fontFamily: 'System',
              fontWeight: '400',
              textAlignVertical: 'top',
              fontSize: 16,
              lineHeight: 24,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      )}
    </View>
  );
}