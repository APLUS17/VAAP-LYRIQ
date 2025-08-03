import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Pressable, TextInput, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// Enhanced state management
const useLyricStore = () => {
  const [sections, setSections] = useState([]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: '',
      count: 1,
    };
    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (id, content) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  const updateSectionType = (id, type) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, type, title: type.charAt(0).toUpperCase() + type.slice(1) } : section
    ));
  };

  const updateSectionCount = (id, count) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, count: Math.max(1, count) } : section
    ));
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  return { sections, addSection, updateSection, updateSectionType, updateSectionCount, removeSection };
};

// ChatGPT-style Sidebar Component
function SongSidebar({ visible, onClose, onSelectSong }) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(-100, { duration: 250 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  // Mock song data - would come from storage in real app
  const songs = [
    { id: '1', title: 'Midnight Dreams', lastEdited: '2 hours ago', preview: 'Walking through the city lights...' },
    { id: '2', title: 'Summer Vibes', lastEdited: '1 day ago', preview: 'Golden hour feelings wash...' },
    { id: '3', title: 'Heartbreak Anthem', lastEdited: '3 days ago', preview: 'Never thought I would be here...' },
    { id: '4', title: 'Road Trip Song', lastEdited: '1 week ago', preview: 'Miles and miles of open road...' },
    { id: '5', title: 'Coffee Shop Blues', lastEdited: '2 weeks ago', preview: 'Sitting in this corner booth...' },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            {
              width: '85%',
              backgroundColor: '#1C1C1E',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            sidebarStyle,
          ]}
        >
          {/* Header */}
          <View className="px-4 py-4 border-b border-gray-700">
            <Text className="text-white text-lg font-semibold">Your Songs</Text>
          </View>

          {/* New Song Button */}
          <View className="px-4 py-3">
            <Pressable
              onPress={() => {
                onClose();
                // This would trigger creating a new song
              }}
              className="flex-row items-center p-3 rounded-lg bg-gray-800"
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text className="text-blue-500 font-medium ml-3">New Song</Text>
            </Pressable>
          </View>

          {/* Songs List */}
          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            <Text className="text-gray-400 text-sm mb-3 px-3">Recent</Text>
            
            {songs.map((song) => (
              <Pressable
                key={song.id}
                onPress={() => {
                  onSelectSong?.(song);
                  onClose();
                }}
                className="p-3 rounded-lg mb-2 active:bg-gray-700"
              >
                <Text className="text-white font-medium mb-1" numberOfLines={1}>
                  {song.title}
                </Text>
                <Text className="text-gray-400 text-sm mb-1" numberOfLines={1}>
                  {song.preview}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {song.lastEdited}
                </Text>
              </Pressable>
            ))}

            {/* Show More */}
            <Pressable className="p-3 rounded-lg">
              <Text className="text-gray-400 text-sm">Show more songs...</Text>
            </Pressable>
          </ScrollView>

          {/* User Profile */}
          <View className="px-4 py-4 border-t border-gray-700">
            <Pressable className="flex-row items-center p-3 rounded-lg">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-sm">A</Text>
              </View>
              <Text className="text-white font-medium ml-3">ayo omoloja</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

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

// Enhanced Section Card Component
function SectionCard({ section, updateSection, updateSectionType, updateSectionCount, removeSection }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const sectionTypes = [
    'verse', 'chorus', 'bridge', 'pre-chorus', 'outro', 'tag', 'intro'
  ];

  return (
    <View className="mb-4" style={{
      backgroundColor: '#2A2A2A',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    }}>
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        {/* Section Type Dropdown */}
        <Pressable
          onPress={() => setShowDropdown(!showDropdown)}
          className="flex-row items-center bg-gray-700 px-3 py-2 rounded-lg"
        >
          <Ionicons name="menu" size={12} color="#9CA3AF" />
          <Text className="ml-2 text-sm font-medium text-gray-200">
            {section.title}
          </Text>
          <Ionicons name="chevron-down" size={12} color="#9CA3AF" className="ml-1" />
        </Pressable>

        {/* Drag Handle */}
        <Pressable className="p-2">
          <Ionicons name="grid" size={16} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View className="mb-3 bg-gray-800 rounded-lg p-2">
          {sectionTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => {
                updateSectionType(section.id, type);
                setShowDropdown(false);
              }}
              className="p-2 rounded"
            >
              <Text className="text-sm text-gray-200 capitalize">{type}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Lyrics Text Area */}
      <TextInput
        multiline
        placeholder={`Write your ${section.type} here...`}
        value={section.content}
        onChangeText={(text) => updateSection(section.id, text)}
        className="min-h-[100px] text-base leading-6"
        style={{ 
          fontFamily: 'Georgia', 
          textAlignVertical: 'top',
          color: '#F3F4F6'
        }}
        placeholderTextColor="#6B7280"
      />
    </View>
  );
}

// Add Section Button Component
function AddSectionButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-gray-700 px-4 py-3 rounded-lg mb-6"
    >
      <Text className="text-gray-200 font-medium">add section</Text>
      <Text className="text-gray-200 ml-2 text-lg">+</Text>
    </Pressable>
  );
}

// Main App
function MainScreen() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showSidebar, setShowSidebar] = useState(false);
  const { sections, addSection, updateSection, updateSectionType, updateSectionCount, removeSection } = useLyricStore();

  if (currentScreen === 'lyricpad') {
    return (
      <View className="flex-1" style={{ 
        backgroundColor: '#1A1A1A',
        paddingTop: insets.top + 20 
      }}>
        {/* Header */}
        <View className="flex-row items-center px-6 mb-6">
          <Pressable onPress={() => setCurrentScreen('main')} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#F3F4F6" />
          </Pressable>
        </View>

        {/* Title */}
        <View className="px-6 mb-6">
          <Text className="text-4xl font-light text-white">
            LYRIQ
          </Text>
        </View>

        {/* Sections Container */}
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Section Cards */}
          {sections.map((section) => (
            <SectionCard 
              key={section.id} 
              section={section}
              updateSection={updateSection}
              updateSectionType={updateSectionType}
              updateSectionCount={updateSectionCount}
              removeSection={removeSection}
            />
          ))}

          {/* Add Section Button */}
          <AddSectionButton onPress={() => addSection('verse')} />

          {sections.length === 0 && (
            <View className="items-center py-12">
              <Text className="text-gray-500 text-center">
                Tap "add section" to start writing
              </Text>
            </View>
          )}
        </ScrollView>

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
        <Pressable 
          onPress={() => setShowSidebar(true)}
          className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
        >
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

      {/* Song Sidebar */}
      <SongSidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onSelectSong={(song) => {
          console.log('Selected song:', song.title);
          // Here you would load the selected song
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