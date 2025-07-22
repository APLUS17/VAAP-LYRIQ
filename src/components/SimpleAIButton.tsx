import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLyricStore } from '../state/lyricStore';

export function SimpleAIButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { sections, addSection, updateSection } = useLyricStore();

  const handleAIHelp = async () => {
    setIsLoading(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const currentLyrics = sections
        .map(section => `${section.title}:\n${section.content}`)
        .join('\n\n')
        .trim();

      // Mock AI responses for testing
      const mockResponses = {
        noLyrics: [
          "Walking down this empty street tonight",
          "Stars are calling out my name",
          "Lost in thoughts that never fade",
          "Dancing with the morning light"
        ],
        withLyrics: [
          "But I'll keep moving on",
          "Through the darkness and the pain",
          "Finding hope in every breath",
          "Like a river flowing free",
          "With the music in my soul"
        ]
      };

      const responseOptions = currentLyrics ? mockResponses.withLyrics : mockResponses.noLyrics;
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      // Show the response in an alert
      Alert.alert("AI Suggestion", randomResponse + "\n\n(Mock response - APIs temporarily unavailable)", [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Add to Lyrics", 
          onPress: () => {
            if (sections.length === 0) {
              addSection('verse');
              // Wait a moment for state to update, then add content
              setTimeout(() => {
                const newSections = useLyricStore.getState().sections;
                if (newSections.length > 0) {
                  updateSection(newSections[0].id, randomResponse);
                }
              }, 100);
            } else {
              const lastSection = sections[sections.length - 1];
              const newContent = lastSection.content 
                ? lastSection.content + '\n' + randomResponse
                : randomResponse;
              updateSection(lastSection.id, newContent);
            }
          }
        }
      ]);

    } catch (error) {
      console.error('AI Error:', error);
      Alert.alert("AI Error", "Sorry, I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleAIHelp}
      disabled={isLoading}
      className={`flex-row items-center justify-center px-4 py-3 rounded-full ${
        isLoading ? 'bg-gray-200' : 'bg-black'
      }`}
      style={{ marginBottom: 20 }}
    >
      <Ionicons 
        name={isLoading ? "hourglass" : "sparkles"} 
        size={16} 
        color={isLoading ? "#9CA3AF" : "white"} 
      />
      <Text className={`ml-2 font-medium ${
        isLoading ? 'text-gray-500' : 'text-white'
      }`}>
        {isLoading ? "Thinking..." : "AI Help"}
      </Text>
    </Pressable>
  );
}