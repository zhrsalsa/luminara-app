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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  QuizDetail: { quiz: Quiz };
};

type QuizListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "QuizDetail"
>;

type Quiz = {
  id: string;
  title: string;
  questions: number;
  image: any;
  completed: boolean;
  disabled?: boolean;
};

const QuizList: React.FC = () => {
  const navigation = useNavigation<QuizListScreenNavigationProp>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Penulisan Huruf Kapital",
      questions: 5,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
    {
      id: "2",
      title: "Penulisan Imbuhan",
      questions: 5,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
    {
      id: "3",
      title: "Penggunaan Partikel",
      questions: 5,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
    {
      id: "4",
      title: "Penulisan Singkatan",
      questions: 5,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
    {
      id: "5",
      title: "Penulisan Angka dan Bilangan",
      questions: 5,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
    {
      id: "6",
      title: "Penulisan Kata Ganti",
      questions: 3,
      image: require("../../assets/images/card-home.png"),
      completed: false,
    },
  ]);

  useEffect(() => {
    initializeQuizProgress();
  }, []);

  const initializeQuizProgress = () => {
    setQuizzes((prev) =>
      prev.map((quiz, index) => ({
        ...quiz,
        disabled: index !== 0 && !prev[index - 1]?.completed,
      }))
    );
  };

  const handleQuizPress = (quiz: Quiz) => {
    if (quiz.disabled) {
      Alert.alert(
        "Kuis Terkunci",
        "Selesaikan kuis sebelumnya untuk membuka kuis ini."
      );
      return;
    }
    navigation.navigate("QuizDetail", { quiz });
  };

  const renderQuizCard = ({ item }: { item: Quiz }) => (
    <TouchableOpacity
      style={[styles.quizCard, item.disabled && styles.disabled]}
      onPress={() => handleQuizPress(item)}
    >
      <Image source={item.image} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizQuestions}>{item.questions} Soal</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.quizButton,
          item.completed && styles.completedButton,
        ]}
      >
        <Text style={styles.buttonText}>
          {item.completed ? "Ulangi" : "Mulai"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Kuis</Text>
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
    height: 83,
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