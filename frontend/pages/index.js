import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-purple-100 p-4">
      <Head>
        <title>Word Scramble Game</title>
        <meta name="description" content="A fun word game for everyone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center text-center max-w-md">
        <h1 className="text-5xl font-bold text-indigo-800 mb-4">Word Scramble</h1>
        <p className="text-xl mb-8 text-indigo-700">Form words from a set of letters and challenge yourself!</p>
        
        <div className="w-full flex flex-col space-y-4">
          <Link 
            href="/game"
            className="game-button-primary py-3 text-xl"
          >
            Start Game
          </Link>

          <Link 
            href="/leaderboard"
            className="game-button-secondary"
          >
            Leaderboard
          </Link>
        </div>

        <div className="mt-16 text-gray-700">
          <h2 className="text-2xl font-bold mb-2">How to Play</h2>
          <ol className="text-left list-decimal pl-5 space-y-2">
            <li>You'll get 8 random letters</li>
            <li>Create words using these letters</li>
            <li>Longer words earn more points</li>
            <li>Score as many points as possible in 60 seconds</li>
          </ol>
        </div>
      </main>
    </div>
  );
}