import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen'; // 1. Import the splash screen API
import { useEffect } from 'react'; // 2. Import useEffect

import { useColorScheme } from '@/hooks/use-color-scheme';

// 3. Immediately tell Expo to keep the splash screen visible
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 4. Manually control when the splash screen disappears
  useEffect(() => {
    async function prepareApp() {
      try {
        // Force a tiny 500ms delay to give Expo Go time to load your custom image over Wi-Fi
        await new Promise(resolve => setTimeout(resolve, 500)); 
      } catch (e) {
        console.warn(e);
      } finally {
        // Now it is safe to hide it
        await SplashScreen.hideAsync();
      }
    }
    
    prepareApp();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}