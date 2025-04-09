import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Game related API calls
export const gameService = {
  // Get a new set of letters
  getLetters: async (difficulty = 'medium') => {
    try {
      const response = await api.get(`/game/letters?difficulty=${difficulty}`);
      return response.data;
    } catch (error) {
      console.error('Error getting letters:', error);
      throw error;
    }
  },
  
  // Validate a word
  validateWord: async (word, letters) => {
    try {
      const response = await api.post('/game/validate', { word, letters });
      return response.data;
    } catch (error) {
      console.error('Error validating word:', error);
      throw error;
    }
  },
  
  // Submit a score
  submitScore: async (scoreData) => {
    try {
      const response = await api.post('/game/score', scoreData);
      return response.data;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
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
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
};

export default api;
