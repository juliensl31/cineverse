import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
import Spinner from './Spinner';

// Interface définissant les props du composant
interface ProtectedRouteProps {
    children: ReactNode;  // Contenu à protéger
}

// Composant HOC (High Order Component) pour protéger les routes
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Récupération de l'état d'authentification et du statut de chargement
    const { user, loading } = useAuth();
    // Redirection
    const router = useRouter();

    // Affichage d'un état de chargement pendant la vérification de l'auth
    if (loading) {
        return <Spinner/>;
    }

    // Redirection vers la page de login si l'utilisateur n'est pas connecté
    if (!user) {
        router.push('/auth');
        return null;
    }

    // Si l'utilisateur est authentifié, affiche le contenu protégé
    return <>{children}</>;
} 