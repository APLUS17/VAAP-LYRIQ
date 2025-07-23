import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Pressable, ScrollView, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useLyricStore } from "./src/state/lyricStore";
import { LyricSection } from "./src/components/LyricSection";
import { SectionSelectionModal } from "./src/components/SectionSelectionModal";
import { ShimmerText } from "./src/components/ShimmerText";
import { ShimmeringTitle } from "./src/components/ShimmeringTitle";
import { Sidebar } from "./src/components/Sidebar";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

function MainScreen() {
  const insets = useSafeAreaInsets();
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'lyricpad'>('main');
  const { sections, addSection } = useLyricStore();

  const sectionTypes = [
    { type: 'verse' as const, label: 'Verse', icon: 'musical-note' },
    { type: 'chorus' as const, label: 'Chorus', icon: 'repeat' },
    { type: 'bridge' as const, label: 'Bridge', icon: 'git-branch' },
  ];

  const handleCreateSection = (sectionType: string, customLabel?: string) => {
    const mappedType = sectionType === 'main' ? 'verse' : 
                      sectionType === 'pre-chorus' ? 'verse' :
                      sectionType === 'custom' ? 'verse' :
                      sectionType as 'verse' | 'chorus' | 'bridge';
    
    addSection(mappedType);
    setShowSectionModal(false);
    setCurrentScreen('lyricpad');
  };

  if (currentScreen === 'lyricpad') {
    return (
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1 px-6"
          style={{ paddingTop: insets.top + 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Pressable
              onPress={() => setCurrentScreen('main')}
              className="p-2 -ml-2 rounded-lg"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
            
            <View className="flex-1 ml-4">
              <Text className="text-2xl font-light text-gray-900 mb-1">
                Lyric Pad
              </Text>
              <Text className="text-sm text-gray-500">
                {sections.length === 0 
                  ? "Start writing your song" 
                  : `${sections.length} section${sections.length !== 1 ? 's' : ''}`
                }
              </Text>
            </View>
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

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      {/* Top Navigation */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable 
          onPress={() => setShowSidebar(true)}
          className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
        >
          <Ionicons name="menu" size={20} color="white" />
        </Pressable>

        <View className="flex-1" />

        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="settings" size={20} color="white" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        <ShimmerText />
        
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
          setShowSidebar(false);
        }}
        onSelectProject={(project) => {
          console.log('Selected project:', project);
          setShowSidebar(false);
        }}
        onNewSong={() => {
          setShowSectionModal(true);
          setShowSidebar(false);
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainScreen />
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}