import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const questions = [
  {
    question: "Kalimat mana yang menggunakan huruf kapital dengan benar?",
    options: [
      "saya pergi ke Jakarta.",
      "Kemarin saya bertemu Andi.",
      "Hari ini adalah hari rabu."
    ],
    correctAnswer: 1
  },
  {
    question: "Pilih kalimat yang benar:",
    options: [
      "Dia tinggal di bandung.",
      "saya suka belajar.",
      "Ibu pergi ke Pasar."
    ],
    correctAnswer: 2
  },
  {
    question: "Huruf kapital digunakan di ...",
    options: [
      "awal kalimat.",
      "nama diri.",
      "keduanya benar."
    ],
    correctAnswer: 2
  },
];

const HurufKapitalQuiz = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextPress = () => {
    if (selectedOption === null) {
      Alert.alert("Perhatian", "Pilih salah satu jawaban terlebih dahulu.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      router.push(`/kuis/hasil?score=${score}&total=${questions.length}`);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === index &&
                (index === currentQuestion.correctAnswer
                  ? styles.correctOption
                  : styles.incorrectOption),
            ]}
            onPress={() => handleOptionPress(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? "Lanjut" : "Selesai"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e1e2e',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#D32F2F',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default HurufKapitalQuiz;
