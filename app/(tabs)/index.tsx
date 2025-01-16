import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { NavigationProp } from '@react-navigation/native';
import { Stack } from 'expo-router';

const firebaseConfig = {
  apiKey: "AIzaSyCBNu8V547_Eg5hg1_hmbuibGmTf5olOJg",
  authDomain: "bahasaku-eb21d.firebaseapp.com",
  projectId: "bahasaku-eb21d",
  storageBucket: "bahasaku-eb21d.firebasestorage.app",
  messagingSenderId: "636276077242",
  appId: "1:636276077242:web:aa463e78c2e0385594c883",
  measurementId: "G-RHC681N2XH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

type RootStackParamList = {
  Home: undefined;
  Kuis: undefined;
  Jelajah: undefined;
  Login: undefined;
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const Home = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const name = userDoc.data().name || "Pengguna";
          setUserName(name.toUpperCase());
        } else {
          console.error("Data pengguna tidak ditemukan di Firestore.");
          setUserName("PENGGUNA");
        }
      } else {
        navigation.navigate('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  if (!userName) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeSection}>
        <Image source={require('../../assets/images/panah.png')} style={styles.headerImage} />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Selamat datang, {userName}!</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity style={styles.featureBox}>
          <Image source={require('../../assets/images/buku-home.png')} style={styles.featureImage} />
          <Text style={styles.featureTitle}>Belajar Kosakata</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureBox} onPress={() => navigation.navigate('Kuis')}>
          <Image source={require('../../assets/images/card-home.png')} style={styles.featureImage} />
          <Text style={styles.featureTitle}>Kuis Bahasa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureBox} onPress={() => navigation.navigate('Jelajah')}>
          <Image source={require('../../assets/images/footsteps.png')} style={styles.featureImage} />
          <Text style={styles.featureTitle}>Jelajah Bahasa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 30,
  },
  headerImage: {
    width: 120,
    height: 120,
  },
  headerText: {
    flexDirection: 'column',
    flex: 1, 
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#49366F',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    flexWrap: 'wrap',
  },  
  featuresContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  featureBox: {
    backgroundColor: '#fff',
    width: '45%',
    height: 150,
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  featureImage: {
    width: 60,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#49366F',
    textAlign: 'center',
  },
});

export default Home;