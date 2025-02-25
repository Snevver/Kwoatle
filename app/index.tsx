import React from 'react';
import { View, Text, StatusBar, Pressable, Image, Dimensions, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import globalStyles from '../styles/globalStyles';

export default function SplashScreen() {
  const { width, height } = Dimensions.get('window');
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
  });
  const router = useRouter();
  const callback =() => {
    console.log('Start button pressed');
    router.push('/dashboard');
  }

  return (
    <>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, backgroundColor: '#07263B' }}>
        {/* Background image */}
        <View style={styles.container}>
          <Image
            source={require('../assets/images/background.png')}
            style={styles.image}
            resizeMode="cover"
          />
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
          {/* Gotta change the font + space has to be fixed*/}
          <Text style={{ fontSize: 40, color: '#fff'}}>Start </Text>
        </Pressable>
      </View>
    </>
  );
}