import axios from 'axios';

// Determine if we're running on localhost or on the deployed site
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// For Vercel deployment, we need to use the API routes in the Next.js app
// or the absolute URL to the backend if it's deployed separately
const getBaseURL = () => {
  // If we're on localhost, use the local backend
  if (isLocalhost) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  // For Vercel deployment with monorepo
  // Check if we're using API routes within the Next.js app
  if (process.env.NEXT_PUBLIC_USE_API_ROUTES === 'true') {
    return '/api';
  }

  // Otherwise use the deployed backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://word-scramble-backend.vercel.app/api';
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  // Add a longer timeout for deployed environments
  timeout: isLocalhost ? 10000 : 30000
});

// Sample data for fallback when API is not available
const sampleData = {
  // Sample letters for different difficulties
  letters: {
    easy: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    medium: ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l'],
    hard: ['q', 'z', 'x', 'j', 'k', 'v', 'b', 'p', 'y', 'w']
  },
  // Sample leaderboard data
  leaderboard: [
    { id: 1, username: 'WordMaster', score: 120, boardSize: 10, date: new Date().toISOString() },
    { id: 2, username: 'LetterNinja', score: 105, boardSize: 10, date: new Date().toISOString() },
    { id: 3, username: 'VocabHero', score: 98, boardSize: 15, date: new Date().toISOString() },
    { id: 4, username: 'SpellingBee', score: 87, boardSize: 10, date: new Date().toISOString() },
    { id: 5, username: 'WordWizard', score: 82, boardSize: 15, date: new Date().toISOString() },
  ]
};

// Game related API calls
export const gameService = {
  // Get a new set of letters
  getLetters: async (difficulty = 'medium') => {
    try {
      const response = await api.get(`/game/letters?difficulty=${difficulty}`);
      return response.data;
    } catch (error) {
      // Error getting letters, using fallback
      // Return sample letters as fallback
      return {
        success: true,
        letters: sampleData.letters[difficulty] || sampleData.letters.medium
      };
    }
  },

  // Validate a word
  validateWord: async (word, letters) => {
    try {
      const response = await api.post('/game/validate', { word, letters });
      return response.data;
    } catch (error) {
      // Error validating word, using local validation

      // Fallback validation logic when API is not available
      // Simple check if the word can be formed from the letters
      const letterCounts = {};
      letters.forEach(letter => {
        letterCounts[letter.toLowerCase()] = (letterCounts[letter.toLowerCase()] || 0) + 1;
      });

      const wordLetters = word.toLowerCase().split('');
      const canBeFormed = wordLetters.every(letter => {
        if (!letterCounts[letter]) return false;
        letterCounts[letter]--;
        return true;
      });

      // Calculate a score based on word length
      const calculateScore = (word) => {
        const length = word.length;
        let score = length;
        if (length >= 5) score += 3;
        if (length >= 7) score += 5;
        if (length >= 9) score += 7;
        return score;
      };

      return {
        success: true,
        word,
        isValid: canBeFormed,
        score: canBeFormed ? calculateScore(word) : 0
      };
    }
  },

  // Submit a score
  submitScore: async (scoreData) => {
    try {
      const response = await api.post('/game/score', scoreData);
      return response.data;
    } catch (error) {
      // Error submitting score, using offline mode

      // Fallback for when API is not available
      // Return a mock successful response
      return {
        success: true,
        message: 'Score submitted successfully (offline mode)',
        score: {
          ...scoreData,
          id: `offline-${Date.now()}`,
          date: new Date().toISOString()
        }
      };
    }
  },

  // Get leaderboard
  getLeaderboard: async (timeFrame = 'all', limit = 10) => {
    try {
      const query = new URLSearchParams();
      if (timeFrame) query.append('timeFrame', timeFrame);
      if (limit) query.append('limit', limit);

      const response = await api.get(`/game/leaderboard?${query.toString()}`);
      return response.data;
    } catch (error) {
      // Error getting leaderboard, using sample data

      // Fallback for when API is not available
      // Return sample leaderboard data
      return {
        success: true,
        message: 'Sample leaderboard data (offline mode)',
        scores: sampleData.leaderboard
      };
    }
  }
};

export default api;
