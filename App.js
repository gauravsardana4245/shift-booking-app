import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { useFonts } from "expo-font";
import AppNavigator from './AppNavigator';

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   'Poppins-ExtraLight': require('./assets/fonts/Lato-Bold.ttf'),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    // <SafeAreaProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    // </SafeAreaProvider>
  );
}
