import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useLyricStore } from '../state/lyricStore';

interface ImprovedAIModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ImprovedAIModal({ visible, onClose }: ImprovedAIModalProps) {
  const insets = useSafeAreaInsets();
  const { sections, addSection, updateSection } = useLyricStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const handleClose = () => {
    Keyboard.dismiss();
    setResponse('');
    setCustomPrompt('');
    setSelectedPreset(null);
    onClose();
  };

  const aiPresets = [
    {
      id: 'next-line',
      title: 'Suggest Next Line',
      icon: 'arrow-forward-circle',
      prompt: 'Continue this lyric naturally',
    },
    {
      id: 'rhyme',
      title: 'Find Rhymes',
      icon: 'musical-note',
      prompt: 'Give me rhyming words for',
    },
    {
      id: 'rewrite',
      title: 'Improve This',
      icon: 'refresh-circle',
      prompt: 'Make this line more compelling',
    },
    {
      id: 'style',
      title: 'Change Style',
      icon: 'color-palette',
      prompt: 'Rewrite in a different style',
    },
  ];

  const getMockResponse = (presetId: string, hasLyrics: boolean) => {
    const responses = {
      'next-line': hasLyrics 
        ? ["And the world keeps spinning around", "But I'll find my way back home", "Through the storms that rage inside"]
        : ["Walking down this lonely road", "Chasing dreams that never fade", "In the silence of the night"],
      'rhyme': ["night/light/sight/bright", "home/roam/dome/chrome", "free/see/be/tree"],
      'rewrite': ["Transform your words into poetry", "Let emotion guide your pen", "Paint pictures with your lyrics"],
      'style': hasLyrics 
        ? ["[Country style] Down by the old oak tree", "[Pop style] Dancing through the neon lights", "[Rock style] Breaking chains that hold us down"]
        : ["[Ballad style] Softly singing to the moon", "[Upbeat style] Jumping to the rhythm", "[Folk style] Stories passed down through time"]
    };
    
    const options = responses[presetId as keyof typeof responses] || responses['next-line'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handlePresetPress = async (preset: typeof aiPresets[0]) => {
    setSelectedPreset(preset.id);
    setIsLoading(true);
    setResponse('');

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentLyrics = sections
      .map(section => `${section.title}:\n${section.content}`)
      .join('\n\n')
      .trim();

    const mockResponse = getMockResponse(preset.id, !!currentLyrics);
    setResponse(mockResponse);
    setIsLoading(false);
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = [
      "That's an interesting creative direction! Here's what I suggest...",
      "Let me help you explore that idea further.",
      "I love where you're going with this. How about...",
    ];

    setResponse(responses[Math.floor(Math.random() * responses.length)]);
    setIsLoading(false);
  };

  const handleAddToLyrics = () => {
    if (!response) return;

    if (sections.length === 0) {
      addSection('verse');
      setTimeout(() => {
        const newSections = useLyricStore.getState().sections;
        if (newSections.length > 0) {
          updateSection(newSections[0].id, response);
        }
      }, 100);
    } else {
      const lastSection = sections[sections.length - 1];
      const newContent = lastSection.content 
        ? lastSection.content + '\n' + response
        : response;
      updateSection(lastSection.id, newContent);
    }

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={handleClose} />
        </Animated.View>

        {/* Modal Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          <Animated.View
            style={[
              {
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '85%',
                paddingBottom: insets.bottom,
              },
              modalStyle,
            ]}
          >
            {/* Handle */}
            <View className="items-center py-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-6">
              <View>
                <Text className="text-2xl font-semibold text-gray-900">
                  AI Assistant
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Get creative help with your lyrics
                </Text>
              </View>
              <Pressable onPress={handleClose} className="p-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
              {/* Quick Actions */}
              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </Text>
                <View className="gap-3">
                  {aiPresets.map((preset) => (
                    <Pressable
                      key={preset.id}
                      onPress={() => handlePresetPress(preset)}
                      disabled={isLoading}
                      className={`flex-row items-center p-4 rounded-xl border-2 ${
                        selectedPreset === preset.id
                          ? 'bg-black border-black'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Ionicons
                        name={preset.icon as any}
                        size={20}
                        color={selectedPreset === preset.id ? 'white' : '#6B7280'}
                      />
                      <Text
                        className={`ml-3 text-base font-medium ${
                          selectedPreset === preset.id ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {preset.title}
                      </Text>
                      {isLoading && selectedPreset === preset.id && (
                        <View className="ml-auto">
                          <Ionicons name="hourglass" size={16} color="white" />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* AI Response */}
              {(response || isLoading) && (
                <View className="mb-6">
                  <Text className="text-lg font-medium text-gray-900 mb-3">
                    AI Suggestion
                  </Text>
                  <View className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    {isLoading ? (
                      <View className="flex-row items-center">
                        <Ionicons name="hourglass" size={16} color="#6B7280" />
                        <Text className="ml-2 text-gray-600">Thinking...</Text>
                      </View>
                    ) : (
                      <>
                        <Text className="text-base text-gray-800 leading-6 mb-4">
                          {response}
                        </Text>
                        <Pressable
                          onPress={handleAddToLyrics}
                          className="bg-black rounded-lg py-3 px-4 self-start"
                        >
                          <Text className="text-white font-medium">
                            Add to Lyrics
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              )}

              {/* Custom Prompt */}
              <View className="mb-6">
                <Text className="text-lg font-medium text-gray-900 mb-3">
                  Ask Anything
                </Text>
                <View className="gap-3">
                  <TextInput
                    placeholder="Ask me anything about your lyrics..."
                    value={customPrompt}
                    onChangeText={setCustomPrompt}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-base"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    maxLength={200}
                  />
                  <Pressable
                    onPress={handleCustomPrompt}
                    disabled={!customPrompt.trim() || isLoading}
                    className={`flex-row items-center justify-center py-3 px-4 rounded-xl ${
                      customPrompt.trim() && !isLoading
                        ? 'bg-black'
                        : 'bg-gray-200'
                    }`}
                  >
                    <Ionicons
                      name="send"
                      size={16}
                      color={customPrompt.trim() && !isLoading ? 'white' : '#9CA3AF'}
                    />
                    <Text
                      className={`ml-2 font-medium ${
                        customPrompt.trim() && !isLoading ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      Ask AI
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}