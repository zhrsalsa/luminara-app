import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { router, Stack } from 'expo-router'; 

// Firebase config (use your own config)
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
const db = getFirestore(app);

const Profile = () => {
  const [user, setUser] = useState<any>(null); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProfile(user);
      } else if (!isLoggingOut) {
        Alert.alert('Error', 'You must be logged in to view the profile.');
      }
    });

    return () => unsubscribe();
  }, [isLoggingOut]);

  const loadUserProfile = async (user: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setName(userData.name || user.displayName);
        setEmail(user.email);
      } else {
        await setDoc(userRef, { name: user.displayName, email: user.email, uid: user.uid });
        setName(user.displayName);
        setEmail(user.email);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name });

      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Set flag sebelum logout
      console.log('Attempting to logout...');
      await signOut(auth);
      console.log('Logout successful!');
      router.replace('/login/page');
      console.log('Redirecting to login page...');
    } catch (error) {
      console.error('Error logging out:', error);
      console.log('Logout failed!');
      Alert.alert('Error', 'Failed to log out.');
      setIsLoggingOut(false); // Reset flag jika terjadi error
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={email}
          editable={false} 
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Change Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => Alert.alert('Cancelled', 'No changes were made')}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(73, 54, 111)',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'rgb(73, 54, 111)',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: 'rgb(73, 54, 111)',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: 'rgb(73, 54, 111)',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 45,
    backgroundColor: 'rgb(73, 54, 111)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  logoutButton: {
    marginTop: 30,
    height: 45,
    backgroundColor: '#dc3545',
    flex: 0,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;