import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion, FieldValue } from 'firebase/firestore';
import { useRouter, Stack } from 'expo-router';
import * as Progress from 'react-native-progress';

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
        question: "Pilihlah kalimat yang tepat!",
        options: ["Sebanyak 5.000 orang telah mendaftar untuk mengikuti ujian.", "Sebanyak Lima Ribu orang telah mendaftar untuk mengikuti ujian.", "Sebanyak 5000 orang telah mendaftar untuk mengikuti ujian."],
        correctAnswer: 0
    },
    {
        question: "Pilihlah kalimat yang tepat!",
        options: ["Pemerintah akan menginvestasikan dana sebesar 10 juta dolar", "Pemerintah akan menginvestasikan dana sebesar sepuluh juta dolar", "Pemerintah akan menginvestasikan dana sebesar 10 juta Dolar."],
        correctAnswer: 1
    },
    {
        question: "Pilihlah kalimat yang tepat!",
        options: ["Perang Dunia Ke-2 terjadi pada abad ke-20.", "Perang Dunia II terjadi pada abad ke-20.", "Perang Dunia Ke-2 terjadi pada abad Ke-20.keduanya benar."],
        correctAnswer: 1
    },
    {
        question: "Pilihlah kalimat yang tepat!",
        options: ["Bab 5 membahas topik ini secara mendalam.", "Bab V membahas topik ini secara mendalam.", " Bab kelima membahas topik ini secara mendalam."],
        correctAnswer: 1
    },
    {
        question: "Pilihlah kalimat yang tepat!",
        options: ["Setengah dari anggaran telah dialokasikan untuk proyek ini.", "Tiga perempat dari peserta sudah terdaftar untuk acara tersebut.", "Lima ribu dua persepuluh peserta telah mendaftar."],
        correctAnswer: 1
    }
];

const QuizScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadQuestion();
  }, [currentQuestionIndex]);

  const loadQuestion = () => {
    setSelectedOption(null);
    setShowNextButton(false);
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
    setShowNextButton(true);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      await saveProgressToFirestore();
      Alert.alert('Kuis Selesai', `Skor Anda: ${score}`);
      router.replace('/(tabs)');
    }
  };

  const saveProgressToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const userId = user.uid;
    const quizId = 'angka-bilangan'; 
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

  const progress = (currentQuestionIndex + 1) / questions.length;

  const question = questions[currentQuestionIndex];

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };
  
  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.push('/(tabs)');
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      <Progress.Bar 
        progress={progress} 
        width={300} 
        color="#4CAF50" 
        style={styles.progressBar} 
      />
      <Text style={styles.progressText}>
        {`Pertanyaan ${currentQuestionIndex + 1} dari ${questions.length}`}
      </Text>
      <Text style={styles.questionText}>{question.question}</Text>
      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionCard,
              selectedOption !== null &&
                index === question.correctAnswer &&
                { backgroundColor: "#4CAF50" },
              selectedOption !== null &&
                selectedOption === index &&
                selectedOption !== question.correctAnswer &&
                { backgroundColor: "#D32F2F" },
            ]}
            onPress={() => selectOption(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showNextButton && (
      <TouchableOpacity
        style={styles.nextButton}
        onPress={nextQuestion}
      >
        <Text style={styles.nextButtonText}>Lanjut</Text>
      </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitButtonText}>X</Text>
      </TouchableOpacity>
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelExit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Apakah Anda ingin keluar?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelExit}>
                <Text style={styles.modalButtonText}>Lanjut</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmExit}>
                <Text style={styles.modalButtonText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>      
    </View>
    </>
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
  progressBar: {
    marginBottom: 10,
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
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
  exitButton: {
    position: 'absolute',
    top: 50,
    left: 13,
    borderRadius: 50,
    padding: 10,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QuizScreen;