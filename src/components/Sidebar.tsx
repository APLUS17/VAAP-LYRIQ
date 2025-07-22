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
  onSelectTool: (tool: string) => void;
  onSelectProject: (project: string) => void;
  onNewSong: () => void;
}

export function Sidebar({ visible, onClose, onSelectTool, onSelectProject, onNewSong }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  
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

  const tools = [
    { id: 'mumbl', name: 'MUMBL', icon: '🎙️', description: 'Auto-humming & melody gen' },
  ];

  const projects = [
    { id: 'muse2', name: 'MUSE 2.0', lastEdited: '2 days ago' },
    { id: 'prompt', name: 'PROMPT MASTER', lastEdited: '1 week ago' },
    { id: 'baes', name: 'BAES STUFF', lastEdited: '2 weeks ago' },
  ];

  const songs: any[] = [];

  const filteredSongs = songs.filter(song => 
    song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              backgroundColor: '#1C1C1E',
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
            sidebarStyle,
          ]}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View className="px-4 pb-4">
              <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3">
                <Ionicons name="search" size={18} color="#8E8E93" />
                <TextInput
                  placeholder="Search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 ml-3 text-white text-base"
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </View>

            {/* Tools Section */}
            <View className="px-4 pb-6">
              <Text className="text-lg font-semibold text-white mb-3">
                🛠️ Tools
              </Text>
              {tools.map((tool) => (
                <Pressable
                  key={tool.id}
                  onPress={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="flex-row items-center p-3 rounded-lg mb-2 active:bg-gray-700"
                >
                  <Text className="text-xl mr-3">{tool.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-white font-medium">{tool.name}</Text>
                    <Text className="text-gray-400 text-xs">{tool.description}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Projects Section */}
            <View className="px-4 pb-6">
              <Pressable
                onPress={() => setProjectsExpanded(!projectsExpanded)}
                className="flex-row items-center justify-between mb-3"
              >
                <Text className="text-lg font-semibold text-white">
                  📁 Projects
                </Text>
                <Ionicons
                  name={projectsExpanded ? "chevron-down" : "chevron-forward"}
                  size={16}
                  color="#8E8E93"
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  onSelectProject('new');
                  onClose();
                }}
                className="flex-row items-center p-3 rounded-lg mb-2 bg-gray-800 active:bg-gray-700"
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text className="text-blue-500 font-medium ml-3">New Project</Text>
              </Pressable>

              {projectsExpanded && projects.map((project) => (
                <Pressable
                  key={project.id}
                  onPress={() => {
                    onSelectProject(project.id);
                    onClose();
                  }}
                  className="flex-row items-center p-3 rounded-lg mb-2 active:bg-gray-700"
                >
                  <Ionicons name="folder" size={18} color="#8E8E93" />
                  <View className="flex-1 ml-3">
                    <Text className="text-white font-medium">{project.name}</Text>
                    <Text className="text-gray-400 text-xs">{project.lastEdited}</Text>
                  </View>
                </Pressable>
              ))}

              {projectsExpanded && (
                <Pressable className="flex-row items-center p-3 rounded-lg">
                  <Text className="text-gray-400 text-sm ml-6">10 more</Text>
                  <Ionicons name="chevron-down" size={14} color="#8E8E93" className="ml-1" />
                </Pressable>
              )}
            </View>

            {/* Songs Section */}
            <View className="px-4 pb-6">
              <Text className="text-lg font-semibold text-white mb-3">
                🎵 Songs
              </Text>

              <Pressable
                onPress={() => {
                  onNewSong();
                  onClose();
                }}
                className="flex-row items-center p-3 rounded-lg mb-3 bg-gray-800 active:bg-gray-700"
              >
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text className="text-blue-500 font-medium ml-3">New Song</Text>
              </Pressable>

              {filteredSongs.length === 0 && (
                <View className="p-4">
                  <Text className="text-gray-400 text-center text-sm">
                    No songs yet. Create your first song!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* User Profile */}
          <View className="px-4 pt-4 border-t border-gray-700">
            <Pressable className="flex-row items-center p-3 rounded-lg">
              <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-sm">A</Text>
              </View>
              <Text className="text-white font-medium ml-3">ayo omoloja</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}