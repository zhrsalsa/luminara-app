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
      await setDoc(userRef,{
        name: username,
        email: email,
        uid: user.uid,
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
      <View style={styles.formContainer}>
        <View style={styles.formBox}>
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
            Sudah punya akun? <Text style={styles.link} onPress={() => router.push('/login/page')}>Login</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wandImage: {
    width: 150,
    height: 150,
    marginRight: 20,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    width: 320,
    boxShadow: '0 4px 10px rgba(197, 139, 39, 0.648)',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(73, 54, 111)',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: 'rgb(101, 79, 147)',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  footerText: {
    fontSize: 14,
    marginTop: 10,
  },
  link: {
    color: 'rgb(73, 54, 111)',
    fontWeight: 'bold',
  },
});
