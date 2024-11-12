import { NextPage } from 'next';
import Spinner from '../components/Spinner';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { checkValidity } from '../shared/utility';
import SeoMetadata from '../components/SeoMetadata';

const AuthPage: NextPage = () => {
    // État pour gérer le mode (connexion/inscription)
    const [isLogin, setIsLogin] = useState(true);
    
    // État pour stocker les données du formulaire
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        confirmPassword: ''
    });
    
    // États pour la gestion des erreurs et du chargement
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);

    // Récupération des fonctions d'authentification et du router
    const { login, signup } = useAuth();
    const router = useRouter();

    // Règles de validation pour chaque champ
    const validationRules = {
        email: {
            required: { value: true, message: 'Ce champ est requis' },
            email: { value: true, message: 'Email invalide' }
        },
        password: {
            required: { value: true, message: 'Ce champ est requis' },
            minLength: { value: 8, message: 'Minimum 8 caractères requis' },
            hasUpperCase: { value: true, message: 'Au moins une majuscule requise' },
            hasLowerCase: { value: true, message: 'Au moins une minuscule requise' },
            hasSpecialChar: { value: true, message: 'Au moins un caractère spécial requis (!@#$%^&*(),.?":{}|<>)' }
        },
        username: {
            required: { value: true, message: 'Ce champ est requis' },
            minLength: { value: 3, message: 'Minimum 3 caractères requis' },
            maxLength: { value: 20, message: 'Maximum 20 caractères autorisés' }
        },
        confirmPassword: {
            required: { value: true, message: 'Ce champ est requis' }
        }
    };

    // Gestion des changements dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Mise à jour des données du formulaire
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validation en temps réel du champ modifié
        if (validationRules[name as keyof typeof validationRules]) {
            const rules = validationRules[name as keyof typeof validationRules];
            const validationObject = Object.fromEntries(
                Object.entries(rules).map(([key, rule]) => [key, rule.value])
            );
            const isValid = checkValidity(value, validationObject);
            setValidationErrors(prev => ({
                ...prev,
                [name]: !isValid ? getErrorMessage(name, rules) : ''
            }));
        }
    };

    // Récupération du message d'erreur approprié
    const getErrorMessage = (fieldName: string, rules: Record<string, { value: any; message: string }>) => {
        const value = formData[fieldName as keyof typeof formData];
        
        for (const [ruleName, rule] of Object.entries(rules) as [string, { value: any; message: string }][]) {
            if (!checkValidity(value, { [ruleName]: rule.value })) {
                return rule.message;
            }
        }
        
        return '';
    };

    // Validation complète du formulaire avant soumission
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        let isValid = true;

        // Validation des champs requis selon le mode (connexion/inscription)
        const fieldsToValidate = isLogin ? ['email', 'password'] : ['email', 'password', 'username'];

        fieldsToValidate.forEach(field => {
            const valid = checkValidity(
                formData[field as keyof typeof formData],
                Object.fromEntries(
                    Object.entries(validationRules[field as keyof typeof validationRules])
                    .map(([key, value]) => [key, value.value])
                )
            );
            if (!valid) {
                newErrors[field] = getErrorMessage(field, validationRules[field as keyof typeof validationRules]);
                isValid = false;
            }
        });

        // Validation spécifique pour la confirmation du mot de passe en mode inscription
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
            isValid = false;
        }

        setValidationErrors(newErrors);
        return isValid;
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation avant soumission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Connexion ou inscription selon le mode
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, formData.username);
            }
            // Redirection vers la page d'accueil après succès
            router.push('/');
        } catch (err: any) {
            // Gestion des erreurs d'authentification
            setError(
                err.code === 'auth/wrong-password' ? 'Mot de passe incorrect' :
                err.code === 'auth/user-not-found' ? 'Utilisateur non trouvé' :
                err.code === 'auth/email-already-in-use' ? 'Email déjà utilisé' :
                'Une erreur est survenue. Veuillez réessayer.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        
        <div>
            {isLoading ? (
                    <Spinner/>
            ) : (
                <>
                {/* Métadonnées SEO */}
                    <SeoMetadata
                        title="Authentification"
                        description="Créer votre compte"
                        image="/movie-icon.png"
                    />
                    
                    <div className="container mx-auto px-4 pt-24">
                        {/* Boutons de basculement entre connexion et inscription */}
                        <div className="max-w-md mx-auto mb-6 flex gap-4">
                            <button 
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    isLogin ? 'btn-gradient' : 'bg-gray-800/50'
                                }`}
                            >
                                Connexion
                            </button>
                            <button 
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    !isLogin ? 'btn-gradient' : 'bg-gray-800/50'
                                }`}
                            >
                                Inscription
                            </button>
                        </div>

                        {/* Affichage des messages d'erreur */}
                        {error && (
                            <div className="max-w-md mx-auto mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
                                {error}
                            </div>
                        )}

                        {/* Formulaire d'authentification */}
                        <div className="max-w-md mx-auto bg-gray-800/50 p-6 rounded-xl">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div>
                                        <label className="block mb-2">Nom d'utilisateur</label>
                                        <input 
                                            type="text" 
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`w-full p-2 rounded bg-gray-700 ${
                                                validationErrors.username ? 'border border-red-500' : ''
                                            }`}
                                            placeholder="Votre nom d'utilisateur"
                                        />
                                        {validationErrors.username && (
                                            <p className="text-red-400 text-sm mt-1">{validationErrors.username}</p>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <label className="block mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full p-2 rounded bg-gray-700 ${
                                            validationErrors.email ? 'border border-red-500' : ''
                                        }`}
                                        placeholder="Votre email"
                                    />
                                    {validationErrors.email && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-2">Mot de passe</label>
                                    <input 
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full p-2 rounded bg-gray-700 ${
                                            validationErrors.password ? 'border border-red-500' : ''
                                        }`}
                                        placeholder="Votre mot de passe"
                                    />
                                    {validationErrors.password && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
                                    )}
                                </div>
                                {!isLogin && (
                                    <div>
                                        <label className="block mb-2">Confirmer le mot de passe</label>
                                        <input 
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full p-2 rounded bg-gray-700 ${
                                                validationErrors.confirmPassword ? 'border border-red-500' : ''
                                            }`}
                                            placeholder="Confirmez votre mot de passe"
                                        />
                                        {validationErrors.confirmPassword && (
                                            <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
                                        )}
                                    </div>
                                )}
                                <button 
                                    type="submit"
                                    className="w-full btn-gradient py-2 rounded-xl flex items-center justify-center h-10"
                                >
                                    <span className="text-white text-sm font-medium">
                                        {isLogin ? 'Se connecter' : "S'inscrire"}
                                    </span>
                                </button>

                                {/* Conditions du mot de passe - visible uniquement en mode inscription */}
                                {!isLogin && (
                                    <div className="mt-4 text-sm text-gray-400 space-y-1">
                                        <h4 className="font-medium text-white">Le mot de passe doit contenir :</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Au moins 8 caractères</li>
                                            <li>Au moins une lettre majuscule</li>
                                            <li>Au moins une lettre minuscule</li>
                                            <li>Au moins un caractère spécial (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                                        </ul>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AuthPage;