// app/login/page.tsx
import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, Image } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBNu8V547_Eg5hg1_hmbuibGmTf5olOJg",
  authDomain: "bahasaku-eb21d.firebaseapp.com",
  projectId: "bahasaku-eb21d",
  storageBucket: "bahasaku-eb21d.firebasestorage.app",
  messagingSenderId: "636276077242",
  appId: "1:636276077242:web:aa463e78c2e0385594c883",
  measurementId: "G-RHC681N2XH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login berhasil!");
      router.push("/two");
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Jika error adalah instance dari Error, akses message-nya
        Alert.alert(`Login gagal: ${error.message}`);
      } else {
        // Tangani error lainnya jika perlu
        Alert.alert("Login gagal: Terjadi kesalahan yang tidak terduga.");
      }
    }
  };  

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/wand.png')} style={styles.wandImage} />
      <Text style={styles.header}>Login</Text>
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
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Belum memiliki akun?{' '}
        <Text style={styles.link} onPress={() => router.push('/signup/page')}>
          Sign Up
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
  logo: {
    fontSize: 28,
    fontWeight: "600",
    color: "#FFDD57",
    marginBottom: 30,
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
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 16,
  },
  btn: {
    width: "100%",
    padding: 14,
    backgroundColor: "rgb(101, 79, 147)",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
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