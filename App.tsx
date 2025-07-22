import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { LyricPadScreen } from "./src/screens/LyricPadScreen";

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
        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Lyric Writer App
          </Text>
          <Text className="text-gray-600">
            Testing basic setup...
          </Text>
        </View>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
