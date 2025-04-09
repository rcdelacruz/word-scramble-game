import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gameService } from '../services/api';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [clearingLeaderboard, setClearingLeaderboard] = useState(false);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await gameService.getLeaderboard(timeFilter);
        if (response && response.success) {
          setLeaderboardData(response.scores || []);
        } else {
          // Use empty leaderboard for a clean slate
          setLeaderboardData(getEmptyLeaderboard());
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
        // Use empty leaderboard for a clean slate
        setLeaderboardData(getEmptyLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter]);

  // Empty array as fallback - clean slate
  const getEmptyLeaderboard = () => {
    return [];
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-indigo-100 to-purple-100">
      <Head>
        <title>Word Scramble - Leaderboard</title>
        <meta name="description" content="Word Scramble Game Leaderboard" />
      </Head>

      <h1 className="text-4xl font-bold mb-6 text-indigo-800">Leaderboard</h1>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">Top Scores</h2>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.map((entry, index) => (
                  <tr key={entry.id || index} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index === 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-400 text-white rounded-full mr-2">
                          1
                        </span>
                      )}
                      {index === 1 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-300 text-white rounded-full mr-2">
                          2
                        </span>
                      )}
                      {index === 2 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-600 text-white rounded-full mr-2">
                          3
                        </span>
                      )}
                      {index > 2 && (
                        <span>{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {entry.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.boardSize || 8} Letters
                    </td>
                  </tr>
                ))}

                {leaderboardData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                      No scores available for this time period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Link href="/game" className="px-8 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors mb-4 inline-block">
        Play Game
      </Link>

      <Link href="/" className="text-indigo-600 hover:text-indigo-800">
        Back to Home
      </Link>
    </div>
  );
}
