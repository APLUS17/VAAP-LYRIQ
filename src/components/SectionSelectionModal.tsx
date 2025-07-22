import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface SectionSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSection: (sectionType: string, customLabel?: string) => void;
}

export function SectionSelectionModal({ visible, onClose, onSelectSection }: SectionSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedSection, setSelectedSection] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
      // Reset state when modal closes
      setSelectedSection('');
      setCustomLabel('');
      setShowCustomInput(false);
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

  const sectionTypes = [
    { id: 'main', label: 'main', color: '#E55451' },
    { id: 'verse', label: 'verse', color: '#F5E6D3' },
    { id: 'pre-chorus', label: 'pre-chorus', color: '#F5E6D3' },
    { id: 'chorus', label: 'chorus', color: '#F5E6D3' },
    { id: 'bridge', label: 'bridge', color: '#F5E6D3' },
    { id: 'instrumental', label: 'instrumental', color: '#F5E6D3' },
  ];

  const handleSectionPress = (section: typeof sectionTypes[0]) => {
    if (section.id === 'custom') {
      setShowCustomInput(true);
      setSelectedSection('custom');
    } else {
      setSelectedSection(section.id);
    }
  };

  const handleCustomPress = () => {
    setShowCustomInput(true);
    setSelectedSection('custom');
  };

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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
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
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* Modal Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end"
        >
          <Animated.View
            style={[
              {
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
            {/* Question */}
            <Text className="text-white text-xl font-medium text-center mb-8">
              How do you want to label this section?
            </Text>

            {/* Section Options */}
            <View className="flex-row flex-wrap justify-center gap-3 mb-6">
              {sectionTypes.map((section) => (
                <Pressable
                  key={section.id}
                  onPress={() => handleSectionPress(section)}
                  className={`px-6 py-3 rounded-full ${
                    selectedSection === section.id ? 'opacity-80' : 'opacity-100'
                  }`}
                  style={{
                    backgroundColor: section.color,
                    borderWidth: selectedSection === section.id ? 3 : 0,
                    borderColor: selectedSection === section.id ? 'white' : 'transparent',
                  }}
                >
                  <Text 
                    className="font-medium text-base"
                    style={{ 
                      color: section.id === 'main' ? 'white' : '#4A5568' 
                    }}
                  >
                    {section.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Custom Input */}
            <Pressable
              onPress={handleCustomPress}
              className={`px-6 py-4 rounded-full mb-8 self-center ${
                selectedSection === 'custom' ? 'opacity-80' : 'opacity-100'
              }`}
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

            {/* Bottom Actions */}
            <View className="flex-row justify-between items-center">
              <Pressable
                onPress={onClose}
                className="w-12 h-12 items-center justify-center"
              >
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
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}