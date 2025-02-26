import React from 'react';
import { View, Text, StatusBar, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import globalStyles from '../styles/globalStyles';

export default function SplashScreen() {
  const router = useRouter();
  const goToDashboard = () => {
    console.log('Start button pressed');
    router.push('/dashboard');
  };

  return (
    <>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Background image */}
        <Image
          source={require('../assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Titel and quote */}
        <View style={styles.textContainer}>
          <Text style={[globalStyles.text, styles.title]}>Kwoatle</Text>
          <Text style={[globalStyles.text, styles.subtitle]}>
            "Your daily dose of inspiration„
          </Text>
        </View>

        {/* Start button */}
        <Pressable style={styles.startButton} onPress={goToDashboard}>
          <Text style={[globalStyles.text, styles.buttonText]}>Start</Text>
        </Pressable>
      </View>
    </>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07263B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 65,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    height: 70,
    backgroundColor: '#218690',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 40,
    color: '#fff',
  },
});

