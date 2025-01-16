import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

type Quiz = {
  id: string;
  title: string;
  questions: number;
  image: any;
  completed: boolean;
  disabled?: boolean;
};

const QuizList: React.FC = () => {
  const router = useRouter();
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

  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const quizzesProgress = userData?.quizzesProgress || [];
    
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
      }
    };    
  
    loadProgress();
  }, []);  

  const handleQuizPress = async (quiz: Quiz) => {
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

  const renderQuizCard = ({ item }: { item: Quiz }) => (
    <View style={[styles.quizCard, item.disabled && styles.disabled]}>
      <Image source={item.image} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizQuestions}>{item.questions} Soal</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.quizButton,
          item.completed && styles.completedButton,
          item.disabled && styles.disabledButton,
        ]}
        onPress={() => handleQuizPress(item)}
        disabled={item.disabled} 
      >
        <Text style={styles.buttonText}>
          {item.completed ? "Ulangi" : "Mulai"}
        </Text>
      </TouchableOpacity>
    </View>
  );  

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        renderItem={renderQuizCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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

export default QuizList;