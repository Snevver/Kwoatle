import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Load the Delius font
  const [fontsLoaded] = useFonts({
    Delius: require('./assets/fonts/Delius-Regular.ttf'), // Load local font
  });

  if (!fontsLoaded) {
    // Show splash screen until fonts are loaded
    SplashScreen.showAsync();
    return null;
  }

  // Hide splash screen after fonts are loaded
  SplashScreen.hideAsync();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <View
              style={{
                height: 70,
                backgroundColor: '#ffffff',
                justifyContent: 'center',
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontFamily: 'Delius', // Apply the custom font
                }}
              >
                Quotely
              </Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
    </Stack>
  );
}
