import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from '../components/Sidebar';

interface HomeScreenProps {
  onNavigateToLyrics: () => void;
}

export function HomeScreen({ onNavigateToLyrics }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-6"
        style={{ paddingTop: insets.top + 20 }}
      >
        {/* Home Button */}
        <Pressable
          onPress={() => setShowSidebar(true)}
          className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
        >
          <Ionicons name="home" size={20} color="white" />
        </Pressable>

        {/* Library Button */}
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="library" size={20} color="white" />
        </Pressable>

        {/* Settings Button */}
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="settings" size={20} color="white" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Title */}
        <Text 
          className="text-center mb-32"
          style={{
            fontSize: 64,
            fontWeight: '400',
            color: '#2D2D2D',
            lineHeight: 72,
            fontFamily: 'Georgia',
          }}
        >
          Lyrics + Structure
        </Text>

        {/* Instructions */}
        <View className="mb-16">
          <Text 
            className="text-center text-gray-700 mb-2"
            style={{
              fontSize: 16,
              fontWeight: '500',
              letterSpacing: 2,
            }}
          >
            TAP 'CREATE SONG SECTION'
          </Text>
          <Text 
            className="text-center text-gray-700"
            style={{
              fontSize: 16,
              fontWeight: '500',
              letterSpacing: 2,
            }}
          >
            TO START WRITING
          </Text>
        </View>

        {/* Create Button */}
        <Pressable
          onPress={onNavigateToLyrics}
          className="bg-transparent border-2 border-gray-800 rounded-full px-12 py-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text 
            className="text-gray-800 text-center"
            style={{
              fontSize: 18,
              fontWeight: '500',
              letterSpacing: 1,
            }}
          >
            Create Song Section
          </Text>
        </Pressable>
      </View>

      {/* Bottom Navigation */}
      <View 
        className="flex-row items-center justify-between px-8"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Back Arrow */}
        <Pressable className="w-8 h-8 items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#2D2D2D" />
        </Pressable>

        {/* Menu Lines */}
        <View className="items-center">
          <View className="flex-row gap-1">
            <View className="w-6 h-0.5 bg-gray-800" />
            <View className="w-6 h-0.5 bg-gray-800" />
            <View className="w-6 h-0.5 bg-gray-800" />
          </View>
          <View className="flex-row gap-1 mt-1">
            <View className="w-6 h-0.5 bg-gray-800" />
            <View className="w-6 h-0.5 bg-gray-300" />
            <View className="w-6 h-0.5 bg-gray-300" />
          </View>
        </View>

        {/* Record Button */}
        <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center">
          <View className="w-6 h-6 bg-white rounded-full" />
        </View>
      </View>

      {/* Sidebar */}
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSelectTool={(tool) => {
          console.log('Selected tool:', tool);
          if (tool === 'writer') {
            onNavigateToLyrics();
          }
        }}
        onSelectProject={(project) => {
          console.log('Selected project:', project);
        }}
        onNewSong={() => {
          onNavigateToLyrics();
        }}
      />
    </View>
  );
}