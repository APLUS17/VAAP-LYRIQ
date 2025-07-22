import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAnthropicChatResponse } from '../api/chat-service';
import { useLyricStore } from '../state/lyricStore';

export function SimpleAIButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { sections, addSection, updateSection } = useLyricStore();

  const handleAIHelp = async () => {
    setIsLoading(true);
    
    try {
      const currentLyrics = sections
        .map(section => `${section.title}:\n${section.content}`)
        .join('\n\n')
        .trim();

      const prompt = currentLyrics 
        ? `Help me write the next line for this song:\n\n${currentLyrics}`
        : "Help me start writing song lyrics. Give me a simple first line for a verse.";

      const response = await getAnthropicChatResponse(prompt);
      
      // Show the response in an alert for now
      Alert.alert("AI Suggestion", response.content, [
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
                  updateSection(newSections[0].id, response.content);
                }
              }, 100);
            } else {
              const lastSection = sections[sections.length - 1];
              const newContent = lastSection.content 
                ? lastSection.content + '\n' + response.content
                : response.content;
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