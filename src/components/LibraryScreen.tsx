import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore } from '../state/lyricStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (24 * 2)

interface LibraryScreenProps {
  onBack: () => void;
  onOpenLyric: (lyricId: string) => void;
  onOpenMumble: () => void;
}

export function LibraryScreen({ onBack, onOpenLyric, onOpenMumble }: LibraryScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'melodies'>('lyrics');
  const { sections } = useLyricStore();
  
  // Get mumble recordings from the store (we'll need to make this accessible)
  const mumbleRecordings = []; // We'll connect this to MumbleRecorder store

  const slideAnimation = useSharedValue(0);

  React.useEffect(() => {
    slideAnimation.value = withTiming(activeTab === 'lyrics' ? 0 : 1, { duration: 200 });
  }, [activeTab]);

  const animatedTabStyle = useAnimatedStyle(() => {
    const translateX = interpolate(slideAnimation.value, [0, 1], [0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  // Generate some mock lyric projects for now
  const lyricProjects = [
    {
      id: '1',
      title: 'MIDNIGHT THOUGHTS',
      artist: 'untitled',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      sections: 3,
      lastModified: '2 days ago',
    },
    {
      id: '2', 
      title: 'SUMMER VIBES',
      artist: 'in progress',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      sections: 5,
      lastModified: '1 week ago',
    },
    {
      id: '3',
      title: 'CITY LIGHTS',
      artist: 'demo',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=400&fit=crop',
      sections: 2,
      lastModified: '3 days ago',
    },
    {
      id: '4',
      title: 'BROKEN DREAMS',
      artist: 'rough draft',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      sections: 4,
      lastModified: '5 days ago',
    },
  ];

  const melodyProjects = [
    {
      id: '1',
      title: 'GUITAR RIFF 01',
      artist: 'instrumental',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      duration: '1:23',
      lastModified: '1 hour ago',
    },
    {
      id: '2',
      title: 'VOCAL MELODY',
      artist: 'humming',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
      duration: '0:45',
      lastModified: '3 hours ago',
    },
    {
      id: '3',
      title: 'BEAT IDEA',
      artist: 'percussion',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      duration: '2:15',
      lastModified: '1 day ago',
    },
  ];

  const formatDate = (dateString: string) => dateString;

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={onBack} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        
        <Pressable className="p-2">
          <Ionicons name="search" size={24} color="white" />
        </Pressable>
      </View>

      {/* Tab Toggle */}
      <View className="px-6 mb-6">
        <View className="flex-row bg-gray-800 rounded-full p-1 relative">
          {/* Animated Background */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 4,
                left: 4,
                right: '50%',
                bottom: 4,
                backgroundColor: '#374151',
                borderRadius: 20,
              },
              animatedTabStyle,
            ]}
          />
          
          <Pressable
            onPress={() => setActiveTab('lyrics')}
            className="flex-1 py-3 items-center relative z-10"
          >
            <Text 
              className={`font-medium ${
                activeTab === 'lyrics' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Lyrics
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => setActiveTab('melodies')}
            className="flex-1 py-3 items-center relative z-10"
          >
            <Text 
              className={`font-medium ${
                activeTab === 'melodies' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Melodies
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {activeTab === 'lyrics' ? (
            lyricProjects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() => onOpenLyric(project.id)}
                className="mb-6"
                style={{ width: cardWidth }}
              >
                <View className="bg-gray-900 rounded-2xl overflow-hidden">
                  <View 
                    className="bg-gray-700 items-center justify-center"
                    style={{ height: cardWidth, width: cardWidth }}
                  >
                    <View className="w-16 h-16 bg-gray-600 rounded-full items-center justify-center">
                      <Ionicons name="musical-notes" size={24} color="#9CA3AF" />
                    </View>
                  </View>
                  
                  <View className="p-4">
                    <Text className="text-white font-medium text-base mb-1" numberOfLines={1}>
                      {project.title}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-2">
                      {project.artist}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">
                        {project.sections} sections
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {formatDate(project.lastModified)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            melodyProjects.map((project) => (
              <Pressable
                key={project.id}
                onPress={onOpenMumble}
                className="mb-6"
                style={{ width: cardWidth }}
              >
                <View className="bg-gray-900 rounded-2xl overflow-hidden">
                  <View 
                    className="bg-gradient-to-br from-orange-500 to-red-600 items-center justify-center"
                    style={{ height: cardWidth, width: cardWidth }}
                  >
                    <View className="w-16 h-16 bg-black bg-opacity-30 rounded-full items-center justify-center">
                      <Ionicons name="mic" size={24} color="white" />
                    </View>
                  </View>
                  
                  <View className="p-4">
                    <Text className="text-white font-medium text-base mb-1" numberOfLines={1}>
                      {project.title}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-2">
                      {project.artist}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">
                        {project.duration}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {formatDate(project.lastModified)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Empty State */}
        {((activeTab === 'lyrics' && lyricProjects.length === 0) || 
          (activeTab === 'melodies' && melodyProjects.length === 0)) && (
          <View className="items-center justify-center py-20">
            <Ionicons 
              name={activeTab === 'lyrics' ? 'musical-notes' : 'mic'} 
              size={64} 
              color="#374151" 
            />
            <Text className="text-gray-400 text-center mt-4 text-base">
              No {activeTab} yet.{'\n'}
              {activeTab === 'lyrics' 
                ? 'Create your first song to see it here.' 
                : 'Record your first melody to see it here.'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}