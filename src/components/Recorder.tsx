import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecorderProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
}

export default function Recorder({ 
  onStart, 
  onStop, 
  visualizerBars = 48, 
  demoMode = false, 
  demoInterval = 3000 
}: RecorderProps) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [barHeights, setBarHeights] = useState(Array(visualizerBars).fill(4));

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (submitted) {
      onStart?.();
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else if (time > 0) {
      onStop?.(time);
      setTime(0);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [submitted]); // Fixed: removed time, onStart, onStop from dependencies

  React.useEffect(() => {
    if (!isDemo) return;
    
    let timeoutId: NodeJS.Timeout;
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
    let animationId: NodeJS.Timeout;
    
    if (submitted) {
      const animateBars = () => {
        setBarHeights(prevHeights => 
          prevHeights.map((_, i) => 4 + Math.random() * 20)
        );
        animationId = setTimeout(animateBars, 100);
      };
      animationId = setTimeout(animateBars, 100); // Fixed: start animation immediately
    } else {
      setBarHeights(Array(visualizerBars).fill(4));
    }
    
    return () => {
      if (animationId) clearTimeout(animationId);
    };
  }, [submitted, visualizerBars]);

  const formatTime = (seconds: number) => {
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