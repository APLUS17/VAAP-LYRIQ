import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#1A1A1A' 
        }}>
          <Text style={{ 
            color: 'white', 
            fontSize: 32, 
            fontWeight: '300' 
          }}>
            LYRIQ
          </Text>
          <Text style={{ 
            color: '#9CA3AF', 
            fontSize: 14,
            marginTop: 8
          }}>
            Server Test - Working
          </Text>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}