import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontSize: 32, color: '#333' }}>Lyriq</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 10 }}>Basic version test</Text>
    </View>
  );
}