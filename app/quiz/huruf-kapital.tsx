import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion, FieldValue } from 'firebase/firestore';
import { useRouter } from 'expo-router';

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
const db = getFirestore(app);
const auth = getAuth(app);

const questions = [
  {
    question: "Kalimat mana yang menggunakan huruf kapital dengan benar?",
    options: ["'Besok pagi,' kata Ibu, 'kita akan pergi ke Pasar.'", "'Besok pagi,' kata Ibu, 'kita akan pergi ke pasar.'", "'Besok pagi,' kata ibu, 'Kita akan pergi ke Pasar.'"],
    correctAnswer: 1
  },
  {
    question: "Kalimat mana yang menggunakan huruf kapital dengan benar?",
    options: ["Presiden Republik Indonesia akan menghadiri acara tersebut.", "presiden republik Indonesia akan menghadiri acara tersebut.", "presiden Republik Indonesia akan menghadiri acara tersebut."],
    correctAnswer: 0
  },
  {
    question: "Tentukan penulisan yang tepat untuk menggunakan huruf kapital",
    options: ["Awal kalimat", "Nama diri", "Keduanya benar"],
    correctAnswer: 2
  },
  {
    question: "Kalimat mana yang menggunakan huruf kapital dengan benar?",
    options: ["Bahasa inggris diajarkan di sekolah.", "Bahasa Inggris diajarkan di sekolah.", "Bahasa Inggris diajarkan di Sekolah"],
    correctAnswer: 1
  },
  {
    question: "Kalimat mana yang menggunakan huruf kapital dengan benar?",
    options: ["Kami akan berlibur ke pulau Bali.", "Kami akan berlibur ke Pulau bali.", "Kami akan berlibur ke Pulau Bali."],
    correctAnswer: 1
  }
];

const QuizScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadQuestion();
  }, [currentQuestionIndex]);

  const loadQuestion = () => {
    setSelectedOption(null);
  };

  const selectOption = (optionNumber: number) => {
    setSelectedOption(optionNumber);
    checkAnswer(optionNumber);
  };

  const checkAnswer = (optionNumber: number) => {
    const question = questions[currentQuestionIndex];
    const isCorrect = optionNumber === question.correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      await saveProgressToFirestore();
      Alert.alert('Kuis Selesai', `Skor Anda: ${score}`);
      router.push('../two');
    }
  };

  const saveProgressToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const userId = user.uid;
    const quizId = 'huruf-kapital'; 
    const quizRef = doc(db, "users", userId, "quizzes", quizId);

    try {
      await setDoc(quizRef, {
        score: score,
      });

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        quizzesProgress: arrayUnion({
          quizId: quizId,
          score: score,
        }),
      }, { merge: true });
      console.log("Quiz progress saved successfully.");
    } catch (error) {
      console.error("Error saving quiz progress:", error);
    }
  };

  const question = questions[currentQuestionIndex];
  

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>
      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionCard,
              selectedOption === index && {
                backgroundColor: index === question.correctAnswer ? '#4CAF50' : '#D32F2F',
              },
            ]}
            onPress={() => selectOption(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={nextQuestion}
        disabled={selectedOption === null}
      >
        <Text style={styles.nextButtonText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    padding: 20,
  },
  questionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QuizScreen;