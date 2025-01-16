import React from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = () => {
  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <LottieView
        source={require('../assets/splash.json')} // Lokasi file JSON Lottie Anda
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#492a6f', // Warna latar belakang
  },
  animation: {
    width: 300, // Sesuaikan ukuran
    height: 300,
  },
});

export default SplashScreen;