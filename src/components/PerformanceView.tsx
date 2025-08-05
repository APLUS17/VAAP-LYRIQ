import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLyricStore } from '../state/lyricStore';
import RecordingModal from './RecordingModal';

// Audio Player Component
function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(65); // 1:05
  const [totalTime] = useState(154); // 2:34
  const [progress, setProgress] = useState(0.42); // 42% progress

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newProgress: number) => {
    const newTime = Math.floor(newProgress * totalTime);
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  return (
    <View className="bg-gray-800 rounded-2xl p-6 mx-6 mb-6">
      {/* Track Info */}
      <View className="items-center mb-4">
        <Text className="text-white text-xl font-medium mb-1">Beat</Text>
        <Text className="text-gray-400 text-sm">+Beats • ntes</Text>
      </View>

      {/* Waveform/Progress Bar */}
      <View className="mb-6">
        <Pressable
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const width = 300; // approximate width
            const newProgress = locationX / width;
            handleSeek(Math.max(0, Math.min(1, newProgress)));
          }}
          className="h-16 justify-center"
        >
          <View className="h-12 flex-row items-center justify-center" style={{ gap: 1 }}>
            {Array.from({ length: 80 }, (_, i) => {
              const waveHeight = Math.sin(i * 0.2) * 12 + Math.random() * 8 + 4;
              return (
                <View
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: waveHeight,
                    backgroundColor: i < progress * 80 ? '#FFFF00' : '#4B5563',
                  }}
                />
              );
            })}
          </View>
        </Pressable>
        
        {/* Time Display */}
        <Text className="text-gray-300 text-center text-sm mt-2">
          {formatTime(currentTime)} / {formatTime(totalTime)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View className="flex-row items-center justify-center"
        style={{ gap: 32 }}>
        <Pressable className="p-2">
          <Ionicons name="share-outline" size={24} color="#9CA3AF" />
        </Pressable>
        
        <Pressable className="p-2">
          <Ionicons name="play-skip-back" size={28} color="white" />
        </Pressable>
        
        <Pressable
          onPress={handlePlayPause}
          className="w-16 h-16 rounded-full bg-white items-center justify-center"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="black"
            style={{ marginLeft: isPlaying ? 0 : 2 }}
          />
        </Pressable>
        
        <Pressable className="p-2">
          <Ionicons name="play-skip-forward" size={28} color="white" />
        </Pressable>
        
        <Pressable className="p-2">
          <Ionicons name="shuffle" size={24} color="#9CA3AF" />
        </Pressable>
      </View>
    </View>
  );
}

// Performance View Component
export default function PerformanceView() {
  const insets = useSafeAreaInsets();
  const { sections, togglePerformanceMode, toggleRecordingModal } = useLyricStore();

  // Disable keyboard in read-only mode
  React.useEffect(() => {
    Keyboard.dismiss();
  }, []);

  // Render structured lyrics with proper formatting
  const renderLyrics = () => {
    if (sections.length === 0) {
      return (
        <View className="items-center py-12">
          <Ionicons name="musical-notes-outline" size={48} color="#4B5563" />
          <Text className="text-gray-400 text-center mt-4 text-lg">
            No lyrics written yet.{'\n'}Tap "Edit" to start writing.
          </Text>
        </View>
      );
    }

    return sections.map((section, index) => (
      <View key={section.id} className="mb-8">
        {/* Section Header */}
        <View 
          className="mb-4 px-4 py-2 rounded-lg self-start"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        >
          <Text 
            className="text-blue-300 font-semibold text-lg"
            style={{ fontFamily: 'System' }}
          >
            [{section.title}]
          </Text>
        </View>
        
        {/* Section Content */}
        <Text 
          className="text-gray-200 text-lg leading-8 pl-2"
          style={{ 
            fontFamily: 'Georgia',
            lineHeight: 32,
          }}
          selectable={false} // Prevent text selection and keyboard popup
        >
          {section.content || (
            <Text className="text-gray-500 italic">
              (No lyrics written for this section)
            </Text>
          )}
        </Text>
      </View>
    ));
  };

  return (
    <View className="flex-1" style={{ 
      backgroundColor: '#1A1A1A',
      paddingTop: insets.top + 20 
    }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mb-6">
        <Text className="text-4xl font-light text-white">LYRIQ</Text>
        <View className="w-10" />
      </View>

      {/* Audio Player */}
      <AudioPlayer />

      {/* Elevated Lyrics Card */}
      <View className="flex-1 mx-4 mb-4">
        <View 
          className="flex-1 bg-gray-800 rounded-3xl"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 16,
          }}
        >
          <ScrollView 
            className="flex-1 p-6"
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            contentContainerStyle={{ 
              paddingTop: 12,
              paddingBottom: 20,
            }}
            decelerationRate="normal"
            scrollEventThrottle={16}
          >
            {renderLyrics()}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Button Bar */}
      <View 
        className="flex-row items-center justify-between px-8"
        style={{ 
          paddingBottom: Math.max(insets.bottom, 20),
          paddingTop: 16,
        }}
      >
        {/* Record Button (left side - where "notes" is in screenshot) */}
        <Pressable
          onPress={() => toggleRecordingModal(true)}
          className="items-center"
        >
          <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mb-2">
            <Ionicons name="mic" size={20} color="white" />
          </View>
          <Text className="text-gray-400 text-xs">record</Text>
        </Pressable>

        {/* Edit Button (right side - no label) */}
        <Pressable
          onPress={() => togglePerformanceMode(false)}
          className="p-2"
        >
          <Ionicons name="create" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Recording Modal */}
      <RecordingModal />
    </View>
  );
}