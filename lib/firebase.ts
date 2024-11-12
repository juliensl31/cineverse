import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase avec les variables d'environnement
// Ces valeurs sont stockées dans .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialisation de Firebase
// Vérifie si une instance existe déjà pour éviter les doubles initialisations
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialisation des services Firebase
const auth = getAuth(app);     // Service d'authentification
const db = getFirestore(app);  // Service Firestore (base de données)

export { app, auth, db }; 