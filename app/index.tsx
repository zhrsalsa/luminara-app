import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import SplashScreen from './SplashScreen'; 

export default function HomePage() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false); 
    }, 10000);

    return () => clearTimeout(timer); 
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }


  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroContent}>
        <Image 
              source={require('../assets/images/door.png')}
              style={styles.heroImage}
            />
          <Text style={styles.heroTitle}>
            Belajar bahasa indonesia dengan <Text style={styles.highlight}>Luminara</Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/signup/page')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/login/page')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#492a6f',
    justifyContent: 'space-between',
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 600,
    flex: 1,
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins'
  },
  highlight: {
    color: '#ffdd57',
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#ffdd57',
    padding: 17,
    borderRadius: 10,
    marginVertical: 7,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffdd57',
  },
  buttonText: {
    color: '#492a6f',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#492a6f',
  },
  heroImage: {
    width: 300, 
    height: 300, 
    marginBottom: 20, 
  },
});
