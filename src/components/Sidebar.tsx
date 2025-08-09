import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  // The following callbacks are retained for compatibility, but not used in this minimalist drawer
  onSelectTool?: (tool: string) => void;
  onSelectProject?: (project: string) => void;
  onNewSong?: () => void;
}

export function Sidebar({ visible, onClose, onSelectTool, onSelectProject }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  
  const translateX = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(-100, { duration: 250 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  // Minimal sections to mirror the OpenAI app
  const menuItems = [
    { id: 'lyriq', label: 'LYRIQ', icon: (color: string) => <Ionicons name="musical-notes-outline" size={22} color={color} /> },
    { id: 'projects', label: 'Projects', icon: (color: string) => <Ionicons name="folder-outline" size={22} color={color} /> },
    { id: 'mumbl', label: 'MUMBL', icon: (color: string) => <Ionicons name="mic-outline" size={22} color={color} /> },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            backdropStyle,
          ]}
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            {
              width: '85%',
              backgroundColor: '#1A1A1A',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            sidebarStyle,
          ]}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Top Search with pen icon */}
            <View className="px-4 pt-2 pb-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3 bg-[#1F1F1F] rounded-2xl px-4 py-3 flex-row items-center">
                  <Ionicons name="search" size={18} color="#8E8E93" />
                  <TextInput
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 ml-3 text-white text-base"
                    placeholderTextColor="#8E8E93"
                  />
                </View>
                <Pressable
                  accessibilityLabel="Compose"
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: '#1F1F1F' }}
                >
                  <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            {/* Minimal Menu */}
            <View className="px-4">
              {menuItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (item.id === 'mumbl') {
                      onSelectTool?.('mumbl');
                    } else if (item.id === 'projects') {
                      onSelectProject?.('projects');
                    }
                    onClose();
                  }}
                  className="flex-row items-center rounded-2xl px-4 py-3 mb-3 active:bg-[#1F1F1F]"
                >
                  <View className="mr-3">
                    {item.icon('#FFFFFF')}
                  </View>
                  <Text className="text-white text-lg font-medium">{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}