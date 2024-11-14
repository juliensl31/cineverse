// Définition des routes de l'application
const routes = {
    home: '/cineverse', // Page d'accueil
    movies: '/cineverse/movies', // Page des films
    series: '/cineverse/series', // Page des séries
    artist: (id: number) => `/cineverse/artist/${id}`, // Page d'un artiste
    movie: (id: number) => `/cineverse/movie/${id}`, // Page d'un film
    serie: (id: number) => `/cineverse/serie/${id}`, // Page d'une série
    auth: '/cineverse/auth', // Page d'authentification
    profile: '/cineverse/profile', // Page de profil
  };
  
  export default routes;