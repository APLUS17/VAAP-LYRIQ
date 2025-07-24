import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Pressable, ScrollView, Keyboard, TextInput, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// Simple state management without Zustand for now
const useLyricStore = () => {
  const [sections, setSections] = useState([]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: '',
      collapsed: false,
    };
    setSections(prev => [...prev, newSection]);
  };

  const updateSection = (id, content) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  const toggleCollapse = (id) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, collapsed: !section.collapsed } : section
    ));
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  return { sections, addSection, updateSection, toggleCollapse, removeSection };
};

// Clean Section Component
function LyricSection({ section, updateSection, toggleCollapse, removeSection }) {
  return (
    <View className="mb-6">
      <Pressable
        onPress={() => toggleCollapse(section.id)}
        className="flex-row items-center justify-between mb-3"
      >
        <Text className="text-lg font-medium text-gray-900">
          {section.title}
        </Text>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => removeSection(section.id)}
            className="mr-3 p-1"
          >
            <Ionicons name="trash-outline" size={16} color="#6B7280" />
          </Pressable>
          <Ionicons
            name={section.collapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6B7280"
          />
        </View>
      </Pressable>

      {!section.collapsed && (
        <TextInput
          multiline
          placeholder={`Write your ${section.type} here...`}
          value={section.content}
          onChangeText={(text) => updateSection(section.id, text)}
          className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px] text-base leading-6"
          style={{
            fontFamily: 'Georgia',
            textAlignVertical: 'top',
          }}
          placeholderTextColor="#9CA3AF"
        />
      )}
    </View>
  );
}

// Section Selection Modal
function SectionSelectionModal({ visible, onClose, onSelectSection }) {
  const insets = useSafeAreaInsets();
  const [selectedSection, setSelectedSection] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 250 });
      setSelectedSection('');
      setCustomLabel('');
      setShowCustomInput(false);
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const sectionTypes = [
    { id: 'main', label: 'main', color: '#E55451' },
    { id: 'verse', label: 'verse', color: '#F5E6D3' },
    { id: 'pre-chorus', label: 'pre-chorus', color: '#F5E6D3' },
    { id: 'chorus', label: 'chorus', color: '#F5E6D3' },
    { id: 'bridge', label: 'bridge', color: '#F5E6D3' },
    { id: 'instrumental', label: 'instrumental', color: '#F5E6D3' },
  ];

  const handleConfirm = () => {
    if (selectedSection === 'custom' && customLabel.trim()) {
      onSelectSection('custom', customLabel.trim());
    } else if (selectedSection && selectedSection !== 'custom') {
      onSelectSection(selectedSection);
    }
    onClose();
  };

  const canConfirm = selectedSection && (selectedSection !== 'custom' || customLabel.trim());

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#4A5568',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: insets.bottom + 20,
              paddingTop: 30,
              paddingHorizontal: 24,
            },
            modalStyle,
          ]}
        >
          <Text className="text-white text-xl font-medium text-center mb-8">
            How do you want to label this section?
          </Text>

          <View className="flex-row flex-wrap justify-center gap-3 mb-6">
            {sectionTypes.map((section) => (
              <Pressable
                key={section.id}
                onPress={() => setSelectedSection(section.id)}
                className="px-6 py-3 rounded-full"
                style={{
                  backgroundColor: section.color,
                  borderWidth: selectedSection === section.id ? 3 : 0,
                  borderColor: selectedSection === section.id ? 'white' : 'transparent',
                }}
              >
                <Text 
                  className="font-medium text-base"
                  style={{ color: section.id === 'main' ? 'white' : '#4A5568' }}
                >
                  {section.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => {
              setSelectedSection('custom');
              setShowCustomInput(true);
            }}
            className="px-6 py-4 rounded-full mb-8 self-center"
            style={{
              backgroundColor: '#F5E6D3',
              borderWidth: selectedSection === 'custom' ? 3 : 0,
              borderColor: selectedSection === 'custom' ? 'white' : 'transparent',
            }}
          >
            {showCustomInput ? (
              <TextInput
                placeholder="type custom here..."
                value={customLabel}
                onChangeText={setCustomLabel}
                className="text-gray-700 font-medium text-base min-w-[180px] text-center"
                placeholderTextColor="#9CA3AF"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />
            ) : (
              <Text className="text-gray-700 font-medium text-base">
                type custom here...
              </Text>
            )}
          </Pressable>

          <View className="flex-row justify-between items-center">
            <Pressable onPress={onClose} className="w-12 h-12 items-center justify-center">
              <Ionicons name="close" size={28} color="white" />
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={!canConfirm}
              className="w-12 h-12 items-center justify-center"
            >
              <Ionicons 
                name="checkmark" 
                size={28} 
                color={canConfirm ? "white" : "#6B7280"} 
              />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Main App Component
function MainScreen() {
  const insets = useSafeAreaInsets();
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('main');
  const { sections, addSection, updateSection, toggleCollapse, removeSection } = useLyricStore();

  const sectionTypes = [
    { type: 'verse', label: 'Verse', icon: 'musical-note' },
    { type: 'chorus', label: 'Chorus', icon: 'repeat' },
    { type: 'bridge', label: 'Bridge', icon: 'git-branch' },
  ];

  const handleCreateSection = (sectionType, customLabel) => {
    const mappedType = sectionType === 'main' ? 'verse' : 
                      sectionType === 'pre-chorus' ? 'verse' :
                      sectionType === 'custom' ? 'verse' :
                      sectionType;
    
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

          {sections.map((section) => (
            <LyricSection 
              key={section.id} 
              section={section}
              updateSection={updateSection}
              toggleCollapse={toggleCollapse}
              removeSection={removeSection}
            />
          ))}

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
                  <Ionicons name={icon} size={16} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-700">
                    + {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {sections.length === 0 && (
            <View className="items-center justify-center py-12">
              <Ionicons name="musical-notes" size={64} color="#E5E7EB" />
              <Text className="text-gray-400 text-center mt-4 text-base">
                Your lyrics will appear here.{'\n'}Tap a button above to get started.
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="home" size={20} color="white" />
        </Pressable>
        <Pressable className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center">
          <Ionicons name="document-text" size={20} color="white" />
        </Pressable>
        <Pressable className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="settings" size={20} color="white" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-light text-gray-800 mb-4 text-center leading-tight">
          Lyriq
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

      <SectionSelectionModal
        visible={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSelectSection={handleCreateSection}
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