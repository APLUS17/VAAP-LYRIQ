import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainScreen } from "./src/screens/MainScreen";
import { LyricPadScreen } from "./src/screens/LyricPadScreen";
import { useLyricStore } from "./src/state/lyricStore";

const Stack = createNativeStackNavigator();

function MainScreenWrapper({ navigation }: any) {
  const { addSection } = useLyricStore();

  const handleEnterLyricPad = (sectionType: string, customLabel?: string) => {
    // Add the selected section type to the store
    const mappedType = sectionType === 'main' ? 'verse' : 
                      sectionType === 'pre-chorus' ? 'verse' :
                      sectionType === 'custom' ? 'verse' :
                      sectionType as 'verse' | 'chorus' | 'bridge';
    
    addSection(mappedType);
    navigation.navigate('LyricPad');
  };

  return (
    <MainScreen onEnterLyricPad={handleEnterLyricPad} />
  );
}

function LyricPadScreenWrapper({ navigation }: any) {
  return <LyricPadScreen onBack={() => navigation.goBack()} />;
}

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project. 
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="Home" component={MainScreenWrapper} />
          <Stack.Screen name="LyricPad" component={LyricPadScreenWrapper} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}