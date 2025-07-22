import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImprovedAIModal } from './ImprovedAIModal';

export function SimpleAIButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        className="flex-row items-center justify-center px-6 py-4 rounded-full bg-black shadow-lg"
        style={{ 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Ionicons name="sparkles" size={18} color="white" />
        <Text className="ml-2 text-white font-semibold text-base">
          AI Assistant
        </Text>
      </Pressable>

      <ImprovedAIModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}