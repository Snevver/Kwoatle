import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          header: () => (
            <View style={{
              height: 70, // Your desired height
              backgroundColor: '#ffffff',
              justifyContent: 'center', // Aligns title to bottom
              paddingBottom: 10, // Space from bottom
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: ''
              }}>
                Quotely
              </Text>
            </View>
          ),
          // Or if you want to keep the default header structure but make it taller:
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }} 
      />
    </Stack>
  );
}

