import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MumbleRecorder } from '../components/MumbleRecorder';
import { useNavigation } from '@react-navigation/native';

export default function MumbleScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1" style={{ backgroundColor: '#1A1A1A', paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-medium">Mumble</Text>
        <View style={{ width: 24 }} />
      </View>

      <MumbleRecorder />
    </View>
  );
}