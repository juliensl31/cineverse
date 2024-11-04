import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
    <Head>
        <title>CinéVerse | Votre univers cinématographique</title>
        <meta name="description" content="Explorez les films populaires, découvrez les dernières sorties et créez votre watchlist personnalisée" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen h-full w-full p-4 bg-primary text-white">
      <div className='container mx-auto px-4 py-12 min-h-screen'>
          <div className="text-center space-y-6 mb-16">
            <h1 className='relative text-6xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
              animate-gradient-x tracking-tight leading-tight'>
              CinéVerse
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 md:w-40 lg:w-48 h-1.5 
                bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
                rounded-full blur-sm"></span>
            </h1>
            <p className='text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 font-medium 
              tracking-wide animate-fade-in-up max-w-3xl mx-auto'>
              Explorez l&apos;univers infini du cinéma
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
