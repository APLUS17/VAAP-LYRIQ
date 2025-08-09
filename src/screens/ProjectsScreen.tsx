import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();

  const Tile: React.FC<{ label: string; iconName: keyof typeof Ionicons.glyphMap }>
    = ({ label, iconName }) => (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        className="items-center justify-center"
        style={{
          width: 86,
          height: 86,
          borderRadius: 24,
          backgroundColor: '#F3F4F6',
        }}
      >
        <Ionicons name={iconName as any} size={26} color="#111827" />
      </Pressable>
      <Text className="text-gray-600 mt-2 font-medium">{label}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: insets.top + 16 }}>
      <View className="px-6 mb-6">
        <Text className="text-4xl font-semibold text-black">Projects</Text>
      </View>

      <View className="px-6 flex-row items-center justify-start space-x-6">
        <Tile label="LYRIQs" iconName="musical-notes-outline" />
        <Tile label="VERSES" iconName="document-text-outline" />
        <Tile label="TAKES" iconName="mic-outline" />
      </View>
    </View>
  );
}


