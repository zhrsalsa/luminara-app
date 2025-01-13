import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Belajar bahasa indonesia dengan <Text style={styles.highlight}>Luminara</Text>
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/signup/page')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/login/page')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#492a6f',
    justifyContent: 'space-between', // Ensures content at top and buttons at bottom
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#492a6f',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffdd57',
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the text
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 600,
    flex: 1,
    alignItems: 'center', // Center the content horizontally
  },
  heroTitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  highlight: {
    color: '#ffdd57',
  },
  buttonsContainer: {
    paddingBottom: 40, // Add space from the bottom of the screen
  },
  button: {
    backgroundColor: '#ffdd57',
    padding: 17,
    borderRadius: 10,
    marginVertical: 7,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ffdd57',
  },
  buttonText: {
    color: '#492a6f',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#492a6f',
  },
});