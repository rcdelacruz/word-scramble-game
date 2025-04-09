import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  getLeaderboard: async (gameMode, timeFrame, limit = 10) => {
    try {
      const query = new URLSearchParams();
      if (gameMode) query.append('gameMode', gameMode);
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

// User related API calls
export const userService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Logout user (client-side only)
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/profile/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default api;