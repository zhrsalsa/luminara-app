import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const firestore = getFirestore(app);

export { auth, firestore, createUserWithEmailAndPassword, updateProfile };