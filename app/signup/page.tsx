import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, firestore, createUserWithEmailAndPassword, updateProfile } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        name: username,
        email: email,
        uid: user.uid,
        quizzesProgress: [],
      });

      Alert.alert('Registrasi berhasil!', 'Anda akan diarahkan ke halaman login.', [
        { text: 'OK', onPress: () => router.push('/login/page') },
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Registrasi gagal', error.message);
      } else {
        Alert.alert('Registrasi gagal', 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/wand.png')} style={styles.wandImage} />
      <Text style={styles.header}>Sign Up</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Sudah memiliki akun?{' '}
        <Text style={styles.link} onPress={() => router.push('/login/page')}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  wandImage: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    transform: [{scaleX: -1}],
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: 'rgb(73, 54, 111)',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputGroup: {
    width: '98%',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    width: '98%',
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    borderColor: 'rgb(101, 79, 147)',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  button: {
    width: '98%',
    padding: 12,
    backgroundColor: 'rgb(101, 79, 147)',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    marginTop: 15,
    alignSelf: 'center',
  },
  link: {
    color: 'rgb(73, 54, 111)',
    fontWeight: 'bold',
  },
});