import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'editor'>('main');
  const [lyrics, setLyrics] = useState('');

  if (currentScreen === 'editor') {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
          <Pressable 
            onPress={() => setCurrentScreen('main')}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 18 }}>← Back</Text>
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: '300', marginLeft: 20 }}>Lyric Pad</Text>
        </View>
        
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <TextInput
            multiline
            placeholder="Write your lyrics here..."
            value={lyrics}
            onChangeText={setLyrics}
            style={{
              fontSize: 18,
              fontFamily: 'Georgia',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 10,
              padding: 15,
              minHeight: 200,
              textAlignVertical: 'top'
            }}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#e5e7eb', paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 40 }}>
        <View style={{ width: 48, height: 48, backgroundColor: '#1f2937', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>🏠</Text>
        </View>
        
        <View style={{ width: 48, height: 48, backgroundColor: '#6b7280', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>📄</Text>
        </View>
        
        <View style={{ width: 48, height: 48, backgroundColor: '#1f2937', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>⚙️</Text>
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 48, fontWeight: '300', color: '#1f2937', marginBottom: 16, textAlign: 'center' }}>
          Lyriq
        </Text>
        
        <View style={{ marginTop: 96 }}>
          <Pressable
            onPress={() => setCurrentScreen('editor')}
            style={{
              backgroundColor: '#1f2937',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 25
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500', fontSize: 18 }}>
              CREATE SONG SECTION
            </Text>
          </Pressable>
          
          <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 24, fontSize: 16 }}>
            TAP 'CREATE SONG SECTION'{'\n'}TO START WRITING
          </Text>
        </View>
      </View>
    </View>
  );
}