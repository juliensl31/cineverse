import React from 'react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SeoMetadata from '../components/SeoMetadata';
import { useRouter } from 'next/router';
import Spinner from '../components/UI/Spinner';

interface UserProfile {
  username: string;
  email: string;
}


const Profile: NextPage = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setProfile({
          username: user.displayName || '',
          email: user.email || ''
        });
      } catch (error) {
        console.error("Erreur détaillée:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
        <Spinner />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <SeoMetadata 
        title="Mon Profil"
        description="Gérez votre profil CinéVerse"
        image="/movie-icon.png"
      />

      <main>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mon Profil
            </h1>
          </div>

          <div className="space-y-10">
            {/* Informations personnelles */}
            <section className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Informations personnelles
              </h2>
              <div className="space-y-3 text-gray-300">
                <p><span className="font-medium">Nom d'utilisateur :</span> {userData?.username}</p>
                <p><span className="font-medium">Email :</span> {profile.email}</p>
              </div>
            </section>

            {/* Favoris */}
            <section className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mes favoris
              </h2>
                <p className="text-gray-400 text-center py-8">Vous n'avez pas encore de favoris</p>
            </section>

            {/* Historique */}
            <section className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Historique de visionnage
              </h2>
                <p className="text-gray-400 text-center py-8">Votre historique de visionnage est vide</p>
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default Profile;