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

// AI Voice Input Component (adapted for React Native)
function AIVoiceInput({ 
  onStart, 
  onStop, 
  visualizerBars = 48, 
  demoMode = false, 
  demoInterval = 3000 
}) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [barHeights, setBarHeights] = useState(Array(visualizerBars).fill(4));

  React.useEffect(() => {
    let intervalId;
    
    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      onStop?.(time);
      setTime(0);
    }
    
    return () => clearInterval(intervalId);
  }, [submitted, time, onStart, onStop]);

  React.useEffect(() => {
    if (!isDemo) return;
    
    let timeoutId;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };
    
    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  React.useEffect(() => {
    let animationId;
    
    if (submitted) {
      const animateBars = () => {
        setBarHeights(Array(visualizerBars).fill(0).map(() => 
          4 + Math.random() * 20
        ));
        animationId = setTimeout(animateBars, 100);
      };
      animateBars();
    } else {
      setBarHeights(Array(visualizerBars).fill(4));
    }
    
    return () => clearTimeout(animationId);
  }, [submitted, visualizerBars]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      setSubmitted((prev) => !prev);
    }
  };

  return (
    <View className="items-center py-4">
      <View className="items-center gap-2">
        {/* Main Button */}
        <Pressable
          onPress={handleClick}
          className="w-16 h-16 rounded-xl items-center justify-center"
          style={{
            backgroundColor: submitted ? 'transparent' : 'transparent',
          }}
        >
          {submitted ? (
            <View 
              className="w-6 h-6 rounded-sm bg-black"
              style={{
                transform: [{ rotate: '45deg' }],
              }}
            />
          ) : (
            <Ionicons name="mic" size={24} color="#374151" />
          )}
        </Pressable>

        {/* Timer */}
        <Text className="font-mono text-sm" style={{ 
          color: submitted ? '#374151' : '#9CA3AF' 
        }}>
          {formatTime(time)}
        </Text>

        {/* Visualizer Bars */}
        <View className="h-4 w-64 flex-row items-center justify-center">
          {barHeights.map((height, i) => (
            <View
              key={i}
              className="w-0.5 rounded-full mx-0.5"
              style={{
                height: submitted ? height : 4,
                backgroundColor: submitted ? '#6B7280' : '#E5E7EB',
              }}
            />
          ))}
        </View>

        {/* Status Text */}
        <Text className="text-xs" style={{ color: '#6B7280' }}>
          {submitted ? 'Listening...' : 'Click to speak'}
        </Text>
      </View>
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

        {/* AI Voice Input */}
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <AIVoiceInput 
            onStart={() => console.log("Recording started")}
            onStop={(duration) => console.log(`Recording stopped after ${duration}s`)}
            visualizerBars={32}
          />
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