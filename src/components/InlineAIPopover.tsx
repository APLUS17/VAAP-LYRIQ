import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface InlineAIPopoverProps {
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  sectionContent: string;
  sectionType: 'verse' | 'chorus' | 'bridge';
  onSuggestion: (suggestion: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function InlineAIPopover({
  visible,
  onClose,
  position,
  sectionContent,
  sectionType,
  onSuggestion,
}: InlineAIPopoverProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
      setSelectedOption(null);
      setIsLoading(false);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const aiOptions = [
    {
      id: 'suggest-next',
      title: 'Suggest next line',
      icon: 'add-circle',
      color: '#10B981',
    },
    {
      id: 'rewrite',
      title: 'Rewrite',
      icon: 'refresh-circle',
      color: '#3B82F6',
    },
    {
      id: 'rhyme',
      title: 'Rhyme',
      icon: 'musical-note',
      color: '#8B5CF6',
    },
    {
      id: 'style',
      title: 'Style like Taylor Swift',
      icon: 'star',
      color: '#F59E0B',
    },
  ];

  const getMockSuggestion = (optionId: string) => {
    const suggestions = {
      'suggest-next': sectionContent 
        ? ["And the world keeps turning still", "But I'll find my way back home", "Through the darkness in my mind"]
        : ["Walking down this empty street", "Lost in thoughts of yesterday", "Dancing with the morning light"],
      'rewrite': ["Let the music guide your words", "Paint your story with emotion", "Find the rhythm in your heart"],
      'rhyme': sectionContent.includes('night') ? "light, sight, bright, flight" : "time, rhyme, climb, shine",
      'style': ["You were my crown, now you're my ghost", "We danced like we were twenty-two", "This love was golden, now it's rust"],
    };

    const options = suggestions[optionId as keyof typeof suggestions] || suggestions['suggest-next'];
    return Array.isArray(options) ? options[Math.floor(Math.random() * options.length)] : options;
  };

  const handleOptionPress = async (option: typeof aiOptions[0]) => {
    setSelectedOption(option.id);
    setIsLoading(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestion = getMockSuggestion(option.id);
    onSuggestion(suggestion);
    setIsLoading(false);
  };

  if (!visible) return null;

  // Calculate position to keep popover on screen
  const popoverWidth = 280;
  const popoverHeight = 200;
  const leftPosition = Math.max(20, Math.min(position.x - popoverWidth / 2, screenWidth - popoverWidth - 20));
  const topPosition = position.y + 10;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable className="flex-1" onPress={onClose}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: leftPosition,
              top: topPosition,
              width: popoverWidth,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 24,
              elevation: 8,
            },
            animatedStyle,
          ]}
        >
          {/* Arrow pointing up */}
          <View
            style={{
              position: 'absolute',
              top: -6,
              left: popoverWidth / 2 - 6,
              width: 12,
              height: 12,
              backgroundColor: 'white',
              transform: [{ rotate: '45deg' }],
            }}
          />

          <View className="gap-3">
            {aiOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => handleOptionPress(option)}
                disabled={isLoading}
                className={`flex-row items-center p-3 rounded-xl ${
                  selectedOption === option.id ? 'bg-gray-100' : 'bg-white'
                }`}
                style={{
                  borderWidth: 1,
                  borderColor: selectedOption === option.id ? option.color : '#E5E7EB',
                }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  {isLoading && selectedOption === option.id ? (
                    <Ionicons name="hourglass" size={16} color={option.color} />
                  ) : (
                    <Ionicons name={option.icon as any} size={16} color={option.color} />
                  )}
                </View>
                <Text
                  className={`text-sm font-medium ${
                    selectedOption === option.id ? 'text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {option.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Footer */}
          <View className="mt-4 pt-3 border-t border-gray-100">
            <Text className="text-xs text-gray-500 text-center">
              Tap an option for AI suggestions
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}