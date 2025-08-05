import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>LYRIQ Test</Text>
      </View>
    </SafeAreaProvider>
  );
}