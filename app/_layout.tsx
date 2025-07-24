// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
// import { Stack } from "expo-router";
// import {useFonts} from "expo-font"
// export default function RootLayout() {
//   useFonts({
//     'outfit': require('./../assets/fonts/Poppins-Light.ttf'),
//     'outfitmedium':require('./../assets/fonts/Poppins-Medium.ttf'),
//     'outfitbold':require('./../assets/fonts/Poppins-Bold.ttf'),
//     'outfitsemibold':require('./../assets/fonts/Poppins-SemiBold.ttf'),
    
//   })
//   return (
//     <Stack>
//       <Stack.Screen name="index"/>
      
//     </Stack>
 

//   );
// }