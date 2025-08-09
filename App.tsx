import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, TextInput, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';

// Import the new modular components
import { useLyricStore } from './src/state/lyricStore';
import RecordingModal from './src/components/RecordingModal';
import { Sidebar } from './src/components/Sidebar';
import PerformanceView from './src/components/PerformanceView';
import ProjectsScreen from './src/screens/ProjectsScreen';



// Enhanced Section Card Component with Swipe-to-Delete
const AnimatedView = Animated.createAnimatedComponent(View);

function SectionCard({ section, updateSection, updateSectionType, removeSection }: {
  section: any;
  updateSection: (id: string, content: string) => void;
  updateSectionType: (id: string, type: string) => void;
  removeSection: (id: string) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isDragging = useSharedValue(false);
  
  const sectionTypes = [
    'verse', 'chorus', 'bridge', 'pre-chorus', 'outro', 'tag', 'intro'
  ];

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context: any) => {
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal && context.startX !== undefined) {
        // Horizontal swipe - only allow left swipe for delete
        translateX.value = Math.min(0, context.startX + event.translationX);
      } else if (context.startY !== undefined) {
        // Vertical drag for reordering - constrain to Y-axis only
        translateY.value = context.startY + event.translationY;
        translateX.value = withSpring(0); // Always snap back to center horizontally
        isDragging.value = true;
      }
    },
    onEnd: (event) => {
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal && translateX.value < -100) {
        // Swipe left to delete
        translateX.value = withTiming(-400, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(removeSection)(section.id);
          }
        });
      } else {
        // Snap back to original position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        isDragging.value = false;
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ] as any,
    opacity: opacity.value,
    zIndex: isDragging.value ? 999 : 1,
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -50 ? 1 : 0,
  }));

  return (
    <View className="mb-4">
      {/* Delete Background */}
      <AnimatedView 
        style={[
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 100,
            backgroundColor: '#EF4444',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 0,
          },
          backgroundStyle
        ]}
      >
        <Ionicons name="trash" size={24} color="white" />
      </AnimatedView>

      {/* Card */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <AnimatedView 
          style={[
            {
              backgroundColor: '#2A2A2A',
              borderRadius: 14,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: 12,
              elevation: 7,
              zIndex: 1,
            },
            animatedStyle
          ]}
        >
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
        <View 
          className="absolute top-12 left-4 bg-gray-800 rounded-lg z-10"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            minWidth: 120,
          }}
        >
          {sectionTypes.map((type, index) => (
            <Pressable
              key={type}
              onPress={() => {
                updateSectionType(section.id, type);
                setShowDropdown(false);
              }}
              className="px-3 py-2.5"
              style={{
                borderBottomWidth: index < sectionTypes.length - 1 ? 1 : 0,
                borderBottomColor: '#4B5563',
              }}
            >
              <Text className="text-sm text-gray-200 capitalize font-medium">
                {type}
              </Text>
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
        </AnimatedView>
      </PanGestureHandler>
    </View>
  );
}

// Add Section Button Component
function AddSectionButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-2 rounded-lg mb-6 border border-gray-700 bg-gray-800/60"
    >
      <Text className="text-gray-300 font-medium">add section</Text>
      <Text className="text-gray-400 ml-2 text-lg">+</Text>
    </Pressable>
  );
}

// Main App
function MainScreen() {
  /* 🚨 Hooks: ALWAYS top-level, same order every render */
  const insets = useSafeAreaInsets();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation<any>();
  
  const { 
    sections, 
    addSection, 
    updateSection, 
    updateSectionType, 
    updateSectionCount, 
    removeSection, 
    reorderSections,
    toggleRecordingModal,
    isPerformanceMode,
    togglePerformanceMode
  } = useLyricStore();

  const handleSelectTool = useCallback((toolId: string) => {
    if (toolId === 'mumbl') {
      toggleRecordingModal(true);
    }
  }, [toggleRecordingModal]);

  const handleSelectProject = useCallback((_projectId: string) => {
    navigation.navigate('Projects');
  }, [navigation]);

  const handleNewSong = useCallback(() => {
    addSection('verse');
  }, [addSection]);

  /* callback to open modal */
  const openRecorder = useCallback(() => toggleRecordingModal(true), [toggleRecordingModal]);

  /* ✅ ALWAYS call this hook - logic inside handler, not around hook */
  const swipeUpGestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      // Detect upward swipe from bottom area with safe bounds
      const screenHeight = 800; // approximate screen height
      const isFromBottom = event.absoluteY > screenHeight * 0.6; // bottom 40% of screen
      const isUpwardSwipe = event.translationY < -50 && event.velocityY < -500;
      
      if (isUpwardSwipe && isFromBottom) {
        runOnJS(toggleRecordingModal)(true);
      }
    },
  });

  // Conditional rendering based on view mode
  if (isPerformanceMode) {
    return <PerformanceView />;
  }

  return (
    <View className="flex-1" style={{ 
      backgroundColor: '#1A1A1A',
      paddingTop: insets.top + 20 
    }}>
      {/* Header with View Toggle */}
      <View className="flex-row items-center justify-between px-6 mb-6">
        <View className="flex-row items-center">
          <Pressable
            accessibilityLabel="Open sidebar menu"
            onPress={() => setSidebarVisible(true)}
            className="pr-3"
            style={{ padding: 10, marginHorizontal: -10 }}
          >
            <View style={{ width: 22 }}>
              <View style={{ height: 2, backgroundColor: '#9CA3AF', borderRadius: 1, marginBottom: 4 }} />
              <View style={{ height: 2, backgroundColor: '#9CA3AF', borderRadius: 1 }} />
            </View>
          </Pressable>
          <Text className="text-4xl font-light text-white">LYRIQ</Text>
        </View>
        <Pressable
          onPress={() => togglePerformanceMode(true)}
          className="p-2"
        >
          <Ionicons name="play" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Sections Container with Swipe-Up Gesture */}
      <PanGestureHandler onGestureEvent={swipeUpGestureHandler}>
        <Animated.View className="flex-1">
          <ScrollView 
            className="flex-1 px-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            {/* Section Cards */}
            {sections.map((section) => (
              <SectionCard 
                key={section.id} 
                section={section}
                updateSection={updateSection}
                updateSectionType={updateSectionType}
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

          {/* Sidebar Modal */}
          <Sidebar
            visible={isSidebarVisible}
            onClose={() => setSidebarVisible(false)}
            onSelectTool={handleSelectTool}
            onSelectProject={handleSelectProject}
          />
        </Animated.View>
      </PanGestureHandler>

      {/* Recording Modal */}
      <RecordingModal />
    </View>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Projects" component={ProjectsScreen} />
          </Stack.Navigator>
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}