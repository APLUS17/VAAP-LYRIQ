import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  interpolate,
} from 'react-native-reanimated';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
interface MumbleRecording {
  id: string;
  name: string;
  uri: string;
  duration: number;
  createdAt: Date;
}

// Zustand Store
interface MumbleStore {
  recordings: MumbleRecording[];
  currentlyPlaying: string | null;
  addRecording: (recording: MumbleRecording) => void;
  deleteRecording: (id: string) => void;
  setCurrentlyPlaying: (id: string | null) => void;
}

const useMumbleStore = create<MumbleStore>()(
  persist(
    (set) => ({
      recordings: [],
      currentlyPlaying: null,
      
      addRecording: (recording) => set((state) => ({
        recordings: [recording, ...state.recordings]
      })),
      
      deleteRecording: (id) => set((state) => ({
        recordings: state.recordings.filter(r => r.id !== id),
        currentlyPlaying: state.currentlyPlaying === id ? null : state.currentlyPlaying
      })),
      
      setCurrentlyPlaying: (id) => set({ currentlyPlaying: id }),
    }),
    {
      name: 'mumble-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MumbleRecorder() {
  const insets = useSafeAreaInsets();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showNamingModal, setShowNamingModal] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [tempRecordingUri, setTempRecordingUri] = useState<string | null>(null);
  const [tempDuration, setTempDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const { recordings, currentlyPlaying, addRecording, deleteRecording, setCurrentlyPlaying } = useMumbleStore();
  
  // Animations
  const recordButtonScale = useSharedValue(1);
  const recordButtonOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error('Failed to setup audio:', error);
      Alert.alert('Audio Error', 'Failed to setup audio permissions');
    }
  };

  const startRecording = async () => {
    try {
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
      // Start animations
      recordButtonScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
      
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      
      if (uri && status.isLoaded) {
        setTempRecordingUri(uri);
        setTempDuration(Math.floor((status.durationMillis || 0) / 1000));
        setShowNamingModal(true);
      }
      
      setRecording(null);
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop animations
      cancelAnimation(recordButtonScale);
      cancelAnimation(pulseScale);
      recordButtonScale.value = withTiming(1);
      pulseScale.value = withTiming(1);
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop recording');
    }
  };

  const saveRecording = () => {
    if (!tempRecordingUri) return;
    
    const newRecording: MumbleRecording = {
      id: Date.now().toString(),
      name: recordingName.trim() || `Mumble ${new Date().toLocaleTimeString()}`,
      uri: tempRecordingUri,
      duration: tempDuration,
      createdAt: new Date(),
    };
    
    addRecording(newRecording);
    setShowNamingModal(false);
    setRecordingName('');
    setTempRecordingUri(null);
    setTempDuration(0);
  };

  const playRecording = async (recordingItem: MumbleRecording) => {
    try {
      // Stop current playback if any
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      if (currentlyPlaying === recordingItem.id) {
        setCurrentlyPlaying(null);
        return;
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingItem.uri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setCurrentlyPlaying(recordingItem.id);
      
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setCurrentlyPlaying(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
      
    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert('Playback Error', 'Failed to play recording');
    }
  };

  const confirmDelete = (recording: MumbleRecording) => {
    Alert.alert(
      'Delete Recording',
      `Are you sure you want to delete "${recording.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecording(recording.id),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Animated styles
  const recordButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.5], [0.3, 0]),
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: '#1A1A1A', paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-light text-white mb-2">
          Mumble
        </Text>
        <Text className="text-sm text-gray-400">
          Capture your musical ideas
        </Text>
      </View>

      {/* Recording Section */}
      <View className="items-center py-12">
        {isRecording && (
          <Text className="text-white text-lg mb-4 font-mono">
            {formatTime(recordingTime)}
          </Text>
        )}
        
        <View className="relative">
          {/* Pulse Effect */}
          {isRecording && (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: '#FF6B35',
                  top: -10,
                  left: -10,
                },
                pulseStyle,
              ]}
            />
          )}
          
          {/* Record Button */}
          <AnimatedPressable
            onPress={isRecording ? stopRecording : startRecording}
            style={[
              {
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: isRecording ? '#FF4444' : '#FF6B35',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
              recordButtonStyle,
            ]}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={40}
              color="white"
            />
          </AnimatedPressable>
        </View>
        
        <Text className="text-gray-400 text-center mt-4">
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </Text>
      </View>

      {/* Recordings List */}
      <View className="flex-1 px-6">
        <Text className="text-lg font-medium text-white mb-4">
          Your Mumbles ({recordings.length})
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {recordings.map((recording) => (
            <View
              key={recording.id}
              className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-white font-medium mb-1" numberOfLines={1}>
                    {recording.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">
                      {formatTime(recording.duration)}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-2">
                      • {formatDate(recording.createdAt)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Pressable
                    onPress={() => playRecording(recording)}
                    className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center"
                  >
                    <Ionicons
                      name={currentlyPlaying === recording.id ? 'pause' : 'play'}
                      size={16}
                      color="white"
                    />
                  </Pressable>
                  
                  <Pressable
                    onPress={() => confirmDelete(recording)}
                    className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center"
                  >
                    <Ionicons name="trash" size={16} color="#FF4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
          
          {recordings.length === 0 && (
            <View className="items-center py-12">
              <Ionicons name="mic-outline" size={64} color="#374151" />
              <Text className="text-gray-400 text-center mt-4">
                No recordings yet.{'\n'}Tap the record button to start.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Naming Modal */}
      <Modal
        visible={showNamingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNamingModal(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            className="bg-gray-900 rounded-t-3xl p-6"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <Text className="text-xl font-medium text-white mb-4">
              Name Your Mumble
            </Text>
            
            <TextInput
              value={recordingName}
              onChangeText={setRecordingName}
              placeholder="Enter a name..."
              placeholderTextColor="#6B7280"
              className="bg-gray-800 text-white p-4 rounded-xl mb-6 text-base"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveRecording}
            />
            
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowNamingModal(false)}
                className="flex-1 bg-gray-700 p-4 rounded-xl"
              >
                <Text className="text-white text-center font-medium">
                  Cancel
                </Text>
              </Pressable>
              
              <Pressable
                onPress={saveRecording}
                className="flex-1 bg-orange-500 p-4 rounded-xl"
              >
                <Text className="text-white text-center font-medium">
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}