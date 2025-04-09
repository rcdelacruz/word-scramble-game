import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Leaderboard() {
  // In a real app, we'd fetch this from the API
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, username: 'WordMaster', score: 520, date: '2025-04-08' },
    { id: 2, username: 'LetterNinja', score: 480, date: '2025-04-07' },
    { id: 3, username: 'VocabKing', score: 450, date: '2025-04-09' },
    { id: 4, username: 'WordWizard', score: 420, date: '2025-04-08' },
    { id: 5, username: 'SpellingBee', score: 390, date: '2025-04-06' },
    { id: 6, username: 'Scrambler99', score: 370, date: '2025-04-09' },
    { id: 7, username: 'WordSmith', score: 340, date: '2025-04-05' },
    { id: 8, username: 'AlphabetSoup', score: 320, date: '2025-04-04' },
    { id: 9, username: 'Lexicographer', score: 300, date: '2025-04-03' },
    { id: 10, username: 'Wordie', score: 280, date: '2025-04-02' },
  ]);

  const [timeFilter, setTimeFilter] = useState('all');

  // Filter leaderboard based on selected time period
  const filteredLeaderboard = () => {
    if (timeFilter === 'all') return leaderboardData;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeFilter === 'daily') {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (timeFilter === 'weekly') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeFilter === 'monthly') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return leaderboardData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
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
        
        <div className="overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaderboard().map((entry, index) => (
                <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {entry.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link href="/game" className="game-button-primary mb-4">
        Play Game
      </Link>
      
      <Link href="/" className="text-indigo-600 hover:text-indigo-800">
        Back to Home
      </Link>
    </div>
  );
}