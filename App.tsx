import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Simple state management
const useLyricStore = () => {
  const [sections, setSections] = useState([]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: '',
    };
    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (id, content) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  return { sections, addSection, updateSection };
};

// Simple Recording Button
function SimpleRecordButton() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <View className="items-center">
      <Pressable
        onPress={() => setIsRecording(!isRecording)}
        className="w-16 h-16 rounded-full items-center justify-center"
        style={{
          backgroundColor: isRecording ? '#DC2626' : '#EF4444',
        }}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={24}
          color="white"
        />
      </Pressable>
      <Text className="text-gray-600 text-sm mt-2">
        {isRecording ? 'Recording...' : 'Voice note'}
      </Text>
    </View>
  );
}

// Simple Section Component
function SimpleSection({ section, updateSection }) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-medium text-gray-900 mb-3">
        {section.title}
      </Text>
      <TextInput
        multiline
        placeholder={`Write your ${section.type} here...`}
        value={section.content}
        onChangeText={(text) => updateSection(section.id, text)}
        className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px] text-base"
        style={{ fontFamily: 'Georgia', textAlignVertical: 'top' }}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

// Main App
function MainScreen() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState('main');
  const { sections, addSection, updateSection } = useLyricStore();

  if (currentScreen === 'lyricpad') {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 20 }}>
        <View className="px-6">
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => setCurrentScreen('main')} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
            <Text className="text-2xl font-light text-gray-900">Lyric Pad</Text>
          </View>

          {/* Sections */}
          {sections.map((section) => (
            <SimpleSection 
              key={section.id} 
              section={section}
              updateSection={updateSection}
            />
          ))}

          {/* Add Section */}
          <Pressable
            onPress={() => addSection('verse')}
            className="bg-gray-100 p-4 rounded-lg mb-6"
          >
            <Text className="text-gray-700 text-center">+ Add Verse</Text>
          </Pressable>

          {sections.length === 0 && (
            <View className="items-center py-12">
              <Text className="text-gray-400 text-center">
                Tap "Add Verse" to start writing
              </Text>
            </View>
          )}
        </View>

        {/* Recording Button */}
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <SimpleRecordButton />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between px-6 py-4">
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="menu" size={20} color="white" />
        </Pressable>
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="settings" size={20} color="white" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-light text-gray-800 mb-4 text-center">
          Lyriq
        </Text>
        
        <Pressable
          onPress={() => {
            addSection('verse');
            setCurrentScreen('lyricpad');
          }}
          className="bg-gray-800 px-8 py-4 rounded-full mt-24"
        >
          <Text className="text-white font-medium text-lg">
            START WRITING
          </Text>
        </Pressable>
      </View>
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