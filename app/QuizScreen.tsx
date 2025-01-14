import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const QuizScreen = () => {
  const router = useRouter();

  const quizzes = [
    { name: 'Huruf Kapital', route: '/kuis/huruf-kapital' },
    { name: 'Huruf Tebal', route: '/kuis/huruf-tebal' },
    { name: 'Penulisan Imbuhan', route: '/kuis/imbuhan' },
    { name: 'Unsur Terikat', route: '/kuis/unsur-terikat' },
    { name: 'Unsur Serapan', route: '/kuis/serapan' },
    { name: 'Penulisan Kata Majemuk', route: '/kuis/kata-majemuk' },
  ];

  const [progress, setProgress] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      // Simulate progress fetching (replace with actual logic if needed)
      const simulatedProgress: Record<string, string> = {};
      setProgress(simulatedProgress);
    };

    fetchProgress();
  }, []);

  const handleQuizPress = (route: string, index: number) => {
    if (index > 0 && progress[quizzes[index - 1].route] !== 'completed') {
      Alert.alert('Perhatian', 'Selesaikan kuis sebelumnya untuk membuka kuis ini.');
      return;
    }
    router.push(route);
  };

  const renderQuizCards = () => {
    return quizzes.map((quiz, index) => {
      const isCompleted = progress[quiz.route] === 'completed';
      const isDisabled = index > 0 && progress[quizzes[index - 1].route] !== 'completed';

      return (
        <TouchableOpacity
          key={quiz.route}
          style={[
            styles.quizCard,
            isCompleted && styles.completedCard,
            isDisabled && styles.disabledCard,
          ]}
          onPress={() => handleQuizPress(quiz.route, index)}
          disabled={isDisabled}
        >
          <Image source={require('./card.png')} style={styles.quizImage} />
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{quiz.name}</Text>
            <Text style={styles.quizSubtitle}>5 Soal</Text>
          </View>
          <View style={styles.quizActions}>
            <Text style={styles.quizButton}>{isCompleted ? 'Ulangi' : 'Mulai'}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Luminara</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderQuizCards()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgb(73, 54, 111)',
  },
  contentContainer: {
    padding: 20,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: '#c2e5fc',
  },
  disabledCard: {
    opacity: 0.5,
  },
  quizImage: {
    width: 80,
    height: 120,
    marginRight: 20,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(73, 54, 111)',
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  quizActions: {
    alignItems: 'flex-end',
  },
  quizButton: {
    backgroundColor: '#fce5c2',
    color: 'rgb(186, 59, 89)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QuizScreen;
