import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gameService } from '../services/api';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [boardSizeFilter, setBoardSizeFilter] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Sample leaderboard data for fallback
  const sampleLeaderboardData = [
    { id: 1, username: 'WordMaster', score: 120, boardSize: 10, date: new Date().toISOString() },
    { id: 2, username: 'LetterNinja', score: 105, boardSize: 10, date: new Date().toISOString() },
    { id: 3, username: 'VocabHero', score: 98, boardSize: 15, date: new Date().toISOString() },
    { id: 4, username: 'SpellingBee', score: 87, boardSize: 10, date: new Date().toISOString() },
    { id: 5, username: 'WordWizard', score: 82, boardSize: 15, date: new Date().toISOString() },
    { id: 6, username: 'Scrabbler', score: 75, boardSize: 10, date: new Date().toISOString() },
    { id: 7, username: 'Wordsmith', score: 68, boardSize: 25, date: new Date().toISOString() },
    { id: 8, username: 'Lexicon', score: 62, boardSize: 15, date: new Date().toISOString() },
    { id: 9, username: 'Speller', score: 55, boardSize: 10, date: new Date().toISOString() },
    { id: 10, username: 'Linguist', score: 48, boardSize: 25, date: new Date().toISOString() },
  ];

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await gameService.getLeaderboard(timeFilter, 10, null, boardSizeFilter);
        if (response && response.success) {
          setLeaderboardData(response.scores || []);
          setOfflineMode(false);
        } else {
          // Fallback to sample data when no scores found
          setLeaderboardData(sampleLeaderboardData);
          setOfflineMode(true);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        // Error loading leaderboard, falling back to sample data
        setLeaderboardData(sampleLeaderboardData);
        setOfflineMode(true);
        setError('Using sample leaderboard data (offline mode)');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter, boardSizeFilter]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 transition-colors duration-300">
      <Head>
        <title>Word Scramble - Leaderboard</title>
        <meta name="description" content="Word Scramble Game Leaderboard" />
      </Head>

      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-game-text dark:text-white font-display">
        <span className="text-game-primary">Leader</span>board
      </h1>

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-game-lg p-6 mb-8 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-game-text dark:text-white font-display">Top Scores</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="p-3 pl-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-game-text dark:text-white focus:outline-none focus:ring-2 focus:ring-game-primary focus:border-transparent shadow-sm transition-colors duration-200 appearance-none"
            >
              <option value="all">All Time</option>
              <option value="daily">Last 24 Hours</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            <div className="relative">
              <select
                value={boardSizeFilter || ''}
                onChange={(e) => setBoardSizeFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="p-3 pl-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-game-text dark:text-white focus:outline-none focus:ring-2 focus:ring-game-primary focus:border-transparent shadow-sm transition-colors duration-200 appearance-none"
              >
                <option value="">All Sizes</option>
                <option value="10">10 Letters</option>
                <option value="15">15 Letters</option>
                <option value="25">25 Letters</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-game-primary to-game-secondary blur opacity-30 animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-game-primary"></div>
            </div>
          </div>
        ) : error ? (
          <div className={`text-center py-16 ${offlineMode ? 'text-amber-600 dark:text-amber-400' : 'text-game-error dark:text-red-400'}`}>
            {offlineMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">{error}</p>
                <p className="mt-2">Showing sample leaderboard data</p>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg font-medium">{error}</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Board</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboardData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No scores found</p>
                      <p className="mt-1">Be the first to submit a score!</p>
                    </td>
                  </tr>
                ) : (
                  leaderboardData.map((entry, index) => (
                    <tr
                      key={entry.id || index}
                      className={index < 3 ? `${index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : index === 1 ? 'bg-gray-50 dark:bg-gray-700/30' : 'bg-amber-50 dark:bg-amber-900/20'}` : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {index === 0 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full mr-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        {index === 1 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-full mr-2 shadow-sm">
                            2
                          </span>
                        )}
                        {index === 2 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full mr-2 shadow-sm">
                            3
                          </span>
                        )}
                        {index > 2 && (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full mr-2">
                            {index + 1}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-game-text dark:text-gray-300 font-medium">
                        {entry.username || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-game-primary dark:text-indigo-400">
                        {entry.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.boardSize || 8} Letters
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <Link href="/game" className="game-button-primary px-8 py-4 text-xl font-medium rounded-xl shadow-game hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 mb-6 inline-flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Play Game
        </Link>
      </div>

      <Link href="/" className="text-game-text-light dark:text-gray-400 hover:text-game-primary dark:hover:text-white transition-colors duration-300 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
