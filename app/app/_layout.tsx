import { Stack } from 'expo-router';
import { View, Text, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Layout() {
  return (
    <>
      {/* Hide status bar */}
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => (
              <View
                style={{
                  height: 70,
                  backgroundColor: '#07263B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,  // Ensure header is on top
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 85,
                    backgroundColor: '#218690',
                    borderRadius: 20,
                    margin: 10,
                    marginTop: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={globalStyles.text}>
                    “Quotely“
                  </Text>
                </View>
              </View>
            ),
          }}
        />

        {/* Scrollable content */}
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 120, // Space to avoid header overlap
              paddingBottom: 50, // Add some padding to the bottom
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Random divs to show scrolling */}
            {Array.from({ length: 20 }).map((_, index) => (
              <View
                key={index}
                style={{
                  width: '90%', // Make each div take up some width
                  height: 100,
                  backgroundColor: index % 2 === 0 ? '#d0e6f1' : '#c8d8a9',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  Random Item {index + 1}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Stack>
    </>
  );
}
