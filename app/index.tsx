import React from 'react';
import { View, Text, StatusBar, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import globalStyles from '../styles/globalStyles';

export default function SplashScreen() {
  const router = useRouter();
  const callback =() => {
    console.log('Start button pressed');
    router.push('/dashboard');
  }

  return (
    <>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: '#07263B' }}>
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
          }}
        />
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
          }}
        />
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
          }}
        />
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
          }}
        />
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
          }}
        />
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: '#1E3A4C',
            borderRadius: 100,
            position: 'absolute',
            top: 650,
            left: 250,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        />

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
            <Text style={[globalStyles.text, { fontSize: 65 }]}>"Quotely„</Text>
            <Text style={[globalStyles.text, { fontSize: 20 }]}>"Your daily dose of inspiration„</Text>
          </View>
        </View>

        {/* Start button */}
        <Pressable
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
            zIndex: 10,
          }}
          onPress={callback}
        >
          <Text style={{ fontSize: 40, color: '#fff' }}>Start</Text>
        </Pressable>
      </View>
    </>
  );
}