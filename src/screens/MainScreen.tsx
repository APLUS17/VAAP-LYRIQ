import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SectionSelectionModal } from '../components/SectionSelectionModal';
import { Sidebar } from '../components/Sidebar';

interface MainScreenProps {
  onEnterLyricPad: (sectionType: string, customLabel?: string) => void;
}

export function MainScreen({ onEnterLyricPad }: MainScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleCreateSection = (sectionType: string, customLabel?: string) => {
    setShowSectionModal(false);
    onEnterLyricPad(sectionType, customLabel);
  };

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      {/* Top Navigation */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => setShowSidebar(true)}
          className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
        >
          <Ionicons name="home" size={20} color="white" />
        </Pressable>

        <Pressable className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center">
          <Ionicons name="document-text" size={20} color="white" />
        </Pressable>

        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="settings" size={20} color="white" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          <Text className="text-5xl font-light text-gray-800 mb-4 text-center leading-tight">
            Lyrics + Structure
          </Text>
          
          <View className="mt-24">
            <Pressable
              onPress={() => setShowSectionModal(true)}
              className="bg-gray-800 px-8 py-4 rounded-full"
            >
              <Text className="text-white font-medium text-lg">
                CREATE SONG SECTION
              </Text>
            </Pressable>
            
            <Text className="text-gray-600 text-center mt-6 text-base">
              TAP 'CREATE SONG SECTION'{'\n'}TO START WRITING
            </Text>
          </View>
        </View>
      </View>

      {/* Section Selection Modal */}
      <SectionSelectionModal
        visible={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSelectSection={handleCreateSection}
      />

      {/* Sidebar */}
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSelectTool={(tool) => {
          console.log('Selected tool:', tool);
        }}
        onSelectProject={(project) => {
          console.log('Selected project:', project);
        }}
        onNewSong={() => {
          setShowSectionModal(true);
        }}
      />
    </View>
  );
}