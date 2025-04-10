import axios from 'axios';

// Determine if we're running on localhost or on the deployed site
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Determine if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';

// For Vercel deployment, we need to use the API routes in the Next.js app
// or the absolute URL to the backend if it's deployed separately
const getBaseURL = () => {
  // PRODUCTION ENVIRONMENT: Never use localhost in production
  if (!isDevelopment) {
    // First priority: Use the environment variable if it exists
    if (process.env.NEXT_PUBLIC_API_URL) {
      console.log('PRODUCTION: Using API URL from environment:', process.env.NEXT_PUBLIC_API_URL);
      return process.env.NEXT_PUBLIC_API_URL;
    }

    // Second priority: If we're using API routes within the Next.js app
    if (process.env.NEXT_PUBLIC_USE_API_ROUTES === 'true') {
      console.log('PRODUCTION: Using Next.js API routes');
      return '/api';
    }

    // Last resort for production: Use the hardcoded production URL
    console.log('PRODUCTION: Using hardcoded production URL');
    return 'https://scramble.rcdc.me/api';
  }

  // DEVELOPMENT ENVIRONMENT: Only reach here if in development

  // First priority: Use the environment variable if it exists
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('DEVELOPMENT: Using API URL from environment:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Second priority: If we're using API routes within the Next.js app
  if (process.env.NEXT_PUBLIC_USE_API_ROUTES === 'true') {
    console.log('DEVELOPMENT: Using Next.js API routes');
    return '/api';
  }

  // Last resort for development: Use localhost
  console.log('DEVELOPMENT: Using localhost backend on port 3003');
  return 'http://localhost:3003/api';
};

// Get the base URL for API requests
const baseURL = getBaseURL();

// Log the API configuration for debugging
console.log('API Configuration:', {
  baseURL,
  isLocalhost,
  isDevelopment,
  nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
  useApiRoutes: process.env.NEXT_PUBLIC_USE_API_ROUTES,
  nodeEnv: process.env.NODE_ENV
});

// Create an axios instance with default config
const api = axios.create({
  baseURL,
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
  getLeaderboard: async (timeFrame = 'all', limit = 10, gameMode = null, boardSize = null) => {
    try {
      const query = new URLSearchParams();
      if (timeFrame) query.append('timeFrame', timeFrame);
      if (limit) query.append('limit', limit);
      if (gameMode) query.append('gameMode', gameMode);
      if (boardSize) query.append('boardSize', boardSize);

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
