import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen p-4 bg-primary text-white">
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">CineVerse</h1>
        <p className="text-lg mb-4">
        Explorez l&apos;univers infini du cinéma
        </p>
      </main>
    </div>

  )
}

export default Home
