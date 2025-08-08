import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#1A1A1A' 
      }}>
        <Text style={{ color: 'white', fontSize: 32, fontWeight: '300' }}>
          LYRIQ
        </Text>
        <Text style={{ color: '#9CA3AF', marginTop: 20 }}>
          Server Running ✅
        </Text>
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}