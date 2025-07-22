import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useAIAssistantStore } from '../state/aiAssistantStore';

export function AIAssistantButton() {
  const { showModal } = useAIAssistantStore();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    // Subtle breathing animation
    const breathingAnimation = () => {
      opacity.value = withSequence(
        withTiming(0.7, { duration: 2000 }),
        withTiming(0.9, { duration: 2000 })
      );
    };

    const interval = setInterval(breathingAnimation, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    // Tap animation
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 100 })
    );
    
    // Sparkle rotation
    rotate.value = withTiming(rotate.value + 360, { duration: 500 });
    
    // Open modal after animation
    runOnJS(showModal)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 34,
          right: 20,
          zIndex: 1000,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        className="w-14 h-14 bg-black rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="sparkles" size={24} color="white" />
      </Pressable>
    </Animated.View>
  );
}