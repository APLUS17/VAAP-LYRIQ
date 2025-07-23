import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-200" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-5xl font-light text-gray-800 mb-4 text-center leading-tight">
          Lyriq
        </Text>
        <Text className="text-gray-600 text-center mt-6 text-base">
          Simple version - working!
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainScreen />
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}