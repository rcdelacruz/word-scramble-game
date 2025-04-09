import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 p-4 transition-colors duration-300">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left side - Game info */}
        <div className="flex flex-col items-start space-y-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-game-primary animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-game-secondary animate-pulse delay-100"></div>
            <div className="h-2 w-2 rounded-full bg-game-accent animate-pulse delay-200"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-game-text dark:text-white font-display leading-tight">
            Word <span className="text-game-primary">Scramble</span> Game
          </h1>

          <p className="text-xl text-game-text-light dark:text-gray-300">
            Form words from a set of letters, challenge yourself, and compete for the highest score on the leaderboard!
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Link
              href="/game"
              className="game-button-primary py-3 px-8 text-xl flex items-center justify-center group"
            >
              <span>Play Now</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            <Link
              href="/leaderboard"
              className="game-button-secondary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              <span>Leaderboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm text-game-text-light dark:text-gray-400 mt-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>60 Second Rounds</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Multiplayer</span>
            </div>
          </div>
        </div>

        {/* Right side - Game preview */}
        <div className="hidden md:block relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-game-primary to-game-secondary rounded-2xl blur opacity-30 animate-pulse-slow"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-game-xl p-6 transition-all duration-300">
            <div className="flex justify-between mb-4">
              <div className="text-sm font-medium text-game-text-light dark:text-gray-300">Score: <span className="text-game-primary font-bold">120</span></div>
              <div className="text-sm font-medium text-game-text-light dark:text-gray-300">Time: <span className="text-game-error font-bold">45s</span></div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl flex items-center justify-center mb-4 border-2 border-indigo-100 dark:border-indigo-800/50">
              <p className="text-2xl font-bold tracking-wider text-game-primary dark:text-indigo-300">SCRAMBLE</p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {['S', 'C', 'R', 'A', 'M', 'B', 'L', 'E', 'W', 'O', 'R', 'D', 'G', 'A', 'M', 'E'].map((letter, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center text-lg font-bold rounded-lg shadow-sm transform transition-all duration-150 ${index < 8 ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 scale-95' : 'bg-game-primary text-white hover:bg-indigo-600 hover:scale-105'}`}
                >
                  {letter}
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Clear
              </button>
              <button className="flex-1 py-2 bg-game-success text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="w-full max-w-4xl mx-auto mt-20 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-game-text dark:text-white font-display mb-12">Game Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-game transition-all duration-300 hover:shadow-game-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-game-text dark:text-white mb-2">Customizable</h3>
            <p className="text-game-text-light dark:text-gray-400">Choose from different board sizes and difficulty levels to match your skill.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-game transition-all duration-300 hover:shadow-game-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-game-text dark:text-white mb-2">Fast-paced</h3>
            <p className="text-game-text-light dark:text-gray-400">60-second rounds keep the game exciting and challenging for players of all levels.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-game transition-all duration-300 hover:shadow-game-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-game-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-game-text dark:text-white mb-2">Competitive</h3>
            <p className="text-game-text-light dark:text-gray-400">Track your progress on the leaderboard and compete with players worldwide.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Override the default layout to remove the header for a cleaner landing page
Home.getLayout = (page) => page;
