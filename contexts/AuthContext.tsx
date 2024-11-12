import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    UserCredential
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';

// Initialisation des services
const auth = getAuth(app);
const db = getFirestore(app);

// Types pour les données utilisateur stockées dans Firestore
interface UserData {
    username: string;
    email: string;
    createdAt: string;
}

// Interface définissant les fonctionnalités disponibles dans le contexte d'authentification
interface AuthContextType {
    user: User | null;        // Utilisateur Firebase
    userData: UserData | null; // Données supplémentaires de l'utilisateur
    loading: boolean;         // État de chargement
    login: (email: string, password: string) => Promise<UserCredential>;
    signup: (email: string, password: string, username: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
}

// Initialisation du contexte avec undefined comme valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour accéder facilement au contexte d'authentification
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // États pour gérer l'utilisateur et ses données
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Observer les changements d'état d'authentification
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Si l'utilisateur est connecté, récupérer ses données depuis Firestore
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data() as UserData);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fonction de connexion
    const login = async (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Fonction d'inscription qui crée aussi le profil utilisateur dans Firestore
    const signup = async (email: string, password: string, username: string) => {
        try {
            // Créer l'utilisateur dans Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Créer le document utilisateur dans Firestore
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });
            
            return userCredential;
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            throw error;
        }
    };

    // Fonction de déconnexion
    const logout = async () => {
        return signOut(auth);
    };

    // Valeurs fournies par le contexte
    const value = {
        user,
        userData,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 