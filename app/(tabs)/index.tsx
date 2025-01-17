import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { NavigationProp } from '@react-navigation/native';
import { useRouter, Stack } from 'expo-router';

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

type Quiz = {
  id: string;
  title: string;
  questions: number;
  image: any;
  completed: boolean;
  disabled?: boolean;
}

const Home = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Penulisan Huruf Kapital",
      questions: 5,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
    {
      id: "2",
      title: "Penulisan Imbuhan",
      questions: 5,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
    {
      id: "3",
      title: "Penggunaan Partikel",
      questions: 5,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
    {
      id: "4",
      title: "Penulisan Singkatan",
      questions: 5,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
    {
      id: "5",
      title: "Penulisan Angka dan Bilangan",
      questions: 5,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
    {
      id: "6",
      title: "Penulisan Kata Ganti",
      questions: 3,
      image: require("../../assets/images/card.png"),
      completed: false,
    },
  ]);

  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const name = userDoc.data().name || "Pengguna";
          setUserName(name.toUpperCase());
          const userData = userDoc.data();
          const quizzesProgress = userData.quizzesProgress || [];
          setQuizzes((prev) => {
            let previousCompleted = true;
            return prev.map((quiz) => {
              const progress = quizzesProgress.find(
                (item: Quiz) => item.id === quiz.id
              );
              const isCompleted = progress?.completed || false;
              const isDisabled = !previousCompleted;

              previousCompleted = isCompleted;

              return {
                ...quiz,
                completed: isCompleted,
                disabled: isDisabled,
              };
            });
          });
        }
      } else {
        navigation.navigate('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleQuizPress = async (quiz: any) => {
    if (quiz.disabled) {
      Alert.alert(
        "Kuis Terkunci",
        "Selesaikan kuis sebelumnya untuk membuka kuis ini."
      );
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const quizzesProgress = userData?.quizzesProgress || [];
  
        const updatedProgress = quizzes.map((item) =>
          item.id === quiz.id
            ? { id: item.id, completed: true }
            : { id: item.id, completed: quizzesProgress.some((q: { id: string; completed: boolean }) => q.id === item.id && q.completed) }
        );
  
        await setDoc(userRef, { quizzesProgress: updatedProgress }, { merge: true });

        const quizRoutes: { [key: string]: string } = {
          "1": "../quiz/huruf-kapital",
          "2": "../quiz/imbuhan",
          "3": "../quiz/partikel",
          "4": "../quiz/singkatan",
          "5": "../quiz/angka-bilangan",
          "6": "../quiz/kata-ganti",
        };
        router.push(quizRoutes[quiz.id] as any || "../quiz");
      }
    }
  };

  const renderQuizCard = (quiz: any) => (
    <View
      key={quiz.id}
      style={[styles.quizCard, quiz.disabled && styles.disabled]}>
      <Image source={quiz.image} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizQuestions}>{quiz.questions} Soal</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.quizButton,
          quiz.completed && styles.completedButton,
          quiz.disabled && styles.disabledButton,
        ]}
        onPress={() => handleQuizPress(quiz)}
        disabled={quiz.disabled}>
        <Text style={styles.buttonText}>
          {quiz.completed ? "Ulangi" : "Mulai"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!userName) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeSection}>
        <Image
          source={require('../../assets/images/panah.png')}
          style={styles.headerImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Selamat datang, {userName}!</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity style={styles.featureBox}>
          <Image
            source={require('../../assets/images/buku-home.png')}
            style={styles.featureImage}
          />
          <Text style={styles.featureTitle}>Belajar Kosakata</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.featureBox}
          onPress={() => navigation.navigate('Jelajah')}>
          <Image
            source={require('../../assets/images/footsteps.png')}
            style={styles.featureImage}
          />
          <Text style={styles.featureTitle}>Jelajah Bahasa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Kuis Bahasa</Text>
      <View>{quizzes.map(renderQuizCard)}</View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#49366F",
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#49366F',
    marginBottom: 15,
  },
  quizCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8e1e1",
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quizImage: {
    width: 100,
    height: 145,
    marginRight: 15,
    borderRadius: 8,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#49366F",
  },
  quizQuestions: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  quizButton: {
    backgroundColor: "#fce5c2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },  
  completedButton: {
    backgroundColor: "#c2e5fc",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#BA3B59",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Home;