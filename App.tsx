import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Pressable, TextInput, Modal, ScrollView, Keyboard } from "react-native";
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

// Enhanced state management
const useLyricStore = () => {
  const [sections, setSections] = useState([]);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);

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

  const reorderSections = (draggedId, direction, currentIndex) => {
    setSections(prev => {
      const newSections = [...prev];
      const draggedIndex = newSections.findIndex(s => s.id === draggedId);
      
      if (draggedIndex === -1) return prev;
      
      const targetIndex = direction === 'down' ? 
        Math.min(draggedIndex + 1, newSections.length - 1) : 
        Math.max(draggedIndex - 1, 0);
      
      if (targetIndex === draggedIndex) return prev;
      
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);
      
      return newSections;
    });
  };

  const toggleRecordingModal = (visible = null) => {
    setIsRecordingModalVisible(visible !== null ? visible : !isRecordingModalVisible);
  };

  return { 
    sections, 
    addSection, 
    updateSection, 
    updateSectionType, 
    updateSectionCount, 
    removeSection, 
    reorderSections,
    isRecordingModalVisible,
    toggleRecordingModal
  };
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

// Recording Modal Component
function RecordingModal({ visible, onClose, children }) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      Keyboard.dismiss(); // Auto-dismiss keyboard when modal opens
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(100, { duration: 300 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: `${translateY.value}%` }],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // Only allow downward swipe to dismiss
      const newTranslateY = Math.max(0, context.startY + (event.translationY / 3));
      translateY.value = newTranslateY;
    },
    onEnd: (event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        // Dismiss modal
        translateY.value = withTiming(100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 250 }, () => {
          runOnJS(onClose)();
        });
      } else {
        // Snap back to open position
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    },
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* Modal Content */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#2A2A2A',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 20,
                paddingHorizontal: 16,
                paddingBottom: Math.max(insets.bottom, 20),
                minHeight: 300,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 12,
              },
              modalStyle,
            ]}
          >
            {/* Drag Handle */}
            <View className="items-center mb-6">
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: '#666',
                  borderRadius: 2.5,
                }}
              />
            </View>

            {/* Modal Content */}
            <View className="flex-1 items-center justify-center">
              {children}
            </View>
          </Animated.View>
        </PanGestureHandler>
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
      <View className="items-center gap-4">
        {/* Main Button */}
        <Pressable
          onPress={handleClick}
          className="w-20 h-20 rounded-full items-center justify-center"
          style={{
            backgroundColor: submitted ? '#EF4444' : '#EF4444',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {submitted ? (
            <Ionicons name="stop" size={28} color="white" />
          ) : (
            <Ionicons name="mic" size={28} color="white" />
          )}
        </Pressable>

        {/* Timer */}
        <Text className="font-mono text-lg font-medium" style={{ 
          color: submitted ? '#F3F4F6' : '#9CA3AF' 
        }}>
          {formatTime(time)}
        </Text>

        {/* Visualizer Bars */}
        <View className="h-6 w-80 flex-row items-center justify-center">
          {barHeights.map((height, i) => (
            <View
              key={i}
              className="w-1 rounded-full mx-0.5"
              style={{
                height: submitted ? height : 4,
                backgroundColor: submitted ? '#EF4444' : '#4B5563',
              }}
            />
          ))}
        </View>

        {/* Status Text */}
        <Text className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
          {submitted ? 'Recording... Tap to stop' : 'Tap to start recording'}
        </Text>
      </View>
    </View>
  );
}

// Enhanced Section Card Component with Swipe-to-Delete
const AnimatedView = Animated.createAnimatedComponent(View);

function SectionCard({ section, updateSection, updateSectionType, removeSection }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isDragging = useSharedValue(false);
  
  const sectionTypes = [
    'verse', 'chorus', 'bridge', 'pre-chorus', 'outro', 'tag', 'intro'
  ];

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const isHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      
      if (isHorizontal) {
        // Horizontal swipe - only allow left swipe for delete
        translateX.value = Math.min(0, context.startX + event.translationX);
      } else {
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
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(removeSection)(section.id);
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
    ],
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
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 4,
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
  const { 
    sections, 
    addSection, 
    updateSection, 
    updateSectionType, 
    updateSectionCount, 
    removeSection, 
    reorderSections,
    isRecordingModalVisible,
    toggleRecordingModal
  } = useLyricStore();

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

        {/* Sections Container with Swipe-Up Gesture */}
        <PanGestureHandler
          onGestureEvent={useAnimatedGestureHandler({
            onEnd: (event) => {
              // Detect upward swipe from bottom area
              if (event.translationY < -50 && event.velocityY < -500 && event.absoluteY > 600) {
                runOnJS(toggleRecordingModal)(true);
              }
            },
          })}
        >
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

            {/* Swipe Up Indicator */}
            <View className="absolute bottom-4 left-0 right-0 items-center">
              <Pressable 
                onPress={() => toggleRecordingModal(true)}
                className="bg-red-500 w-16 h-16 rounded-full items-center justify-center"
                style={{
                  shadowColor: '#EF4444',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="mic" size={24} color="white" />
              </Pressable>
              <Text className="text-gray-400 text-xs mt-2">Swipe up to record</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Recording Modal */}
        <RecordingModal
          visible={isRecordingModalVisible}
          onClose={() => toggleRecordingModal(false)}
        >
          <AIVoiceInput 
            onStart={() => console.log("Recording started")}
            onStop={(duration) => console.log(`Recording stopped after ${duration}s`)}
            visualizerBars={32}
          />
        </RecordingModal>
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
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <NavigationContainer>
          <MainScreen />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}