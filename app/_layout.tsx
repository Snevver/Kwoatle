import { Stack } from 'expo-router';
import { View, Text, StatusBar } from 'react-native';
import globalStyles from '../assets/styles/globalStyles';

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
              // Main screen
              <View
                style={{
                  height: 70,
                  backgroundColor: '#07263B',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Background circles */}
                <View
                  style={{
                    height: 200,
                    width: 200,
                    backgroundColor: '#1E3A4C',
                    borderRadius: 100,
                    position: 'absolute',
                    top: -40,
                    left: -80,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>
                <View
                  style={{
                    height: 200,
                    width: 200,
                    backgroundColor: '#1E3A4C',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 200,
                    left: 250,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>
                <View
                  style={{
                    height: 200,
                    width: 200,
                    backgroundColor: '#4F8D91',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 350,
                    left: -130,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>
                <View
                  style={{
                    height: 200,
                    width: 200,
                    backgroundColor: '#1E3A4C',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 580,
                    left: 200,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>
                <View
                  style={{
                    height: 75,
                    width: 75,
                    backgroundColor: '#4F8D91',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 280,
                    left: 100,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: '#218690',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 70,
                    left: 200,
                    shadowColor: '#fff',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                </View>

                {/* Start page text */}
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 135,
                    margin: 20,
                    marginTop: 105,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                > 
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={[globalStyles.text, { fontSize: 65 }]}>
                      “Quotely„
                    </Text>
                    <Text style={[globalStyles.text, { fontSize: 20 }]}>
                      “Your daily dose of inspiration„
                    </Text>
                  </View>
                </View>

                {/* Start button */}
                <View
                  style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 70,
                  backgroundColor: '#218690',
                  borderRadius: 20,
                  margin: 20,
                  marginTop: 520,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  }}
                >
                  <Text style={[globalStyles.text, { fontSize: 40 }]}>
                  Start
                  </Text>
                </View>
              </View>
            ),
          }}
        />
      </Stack>
    </>
  );
}
