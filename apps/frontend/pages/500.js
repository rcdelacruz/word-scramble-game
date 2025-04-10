import Link from 'next/link';
import Head from 'next/head';

export default function Custom500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>500 - Server Error | Word Scramble Game</title>
      </Head>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Server Error</h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          We're sorry, something went wrong on our server. Please try again later.
        </p>

        <Link href="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
