import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();

  const Tile: React.FC<{ label: string; iconName: keyof typeof Ionicons.glyphMap }>
    = ({ label, iconName }) => (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        className="items-center justify-center border border-gray-800"
        style={{
          width: 86,
          height: 86,
          borderRadius: 24,
          backgroundColor: '#2A2A2A',
        }}
      >
        <Ionicons name={iconName as any} size={26} color="#9CA3AF" />
      </Pressable>
      <Text className="text-gray-400 mt-2 font-medium">{label}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1A1A1A', paddingTop: insets.top + 16 }}>
      <StatusBar style="light" />
      <View className="px-6 mb-6">
        <Text className="text-4xl font-semibold text-white">Projects</Text>
      </View>

      <View className="px-6 flex-row items-center justify-start space-x-6">
        <Tile label="LYRIQs" iconName="musical-notes-outline" />
        <Tile label="VERSES" iconName="document-text-outline" />
        <Tile label="TAKES" iconName="mic-outline" />
      </View>
    </View>
  );
}


