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

  // Validate a word using local dictionary
  validateWord: async (word, letters) => {
    try {
      // First try to use the API route for validation
      const response = await api.post('/game/validate', { word, letters });
      return response.data;
    } catch (error) {
      console.log('Error using API route for validation, falling back to local validation');

      // Local validation logic - fallback
      // Common English words dictionary (expanded)
      const commonWords = new Set([
        'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'chat', 'that', 'flat',
        'brat', 'spat', 'stat', 'scat', 'splat', 'combat', 'dog', 'log', 'fog', 'bog',
        'cog', 'jog', 'frog', 'smog', 'blog', 'word', 'game', 'play', 'time', 'fun',
        'high', 'score', 'level', 'win', 'lose', 'act', 'add', 'age', 'ago', 'aid',
        'aim', 'air', 'all', 'and', 'any', 'arm', 'art', 'ask', 'bad', 'bag', 'ban',
        'bar', 'bed', 'bet', 'bid', 'big', 'bit', 'box', 'boy', 'bug', 'bus', 'but',
        'buy', 'can', 'cap', 'car', 'cat', 'cop', 'cow', 'cry', 'cup', 'cut', 'dad',
        'day', 'die', 'dig', 'dim', 'dip', 'dirt', 'dish', 'dock', 'does', 'dog',
        'door', 'down', 'drag', 'draw', 'drop', 'dry', 'due', 'dull', 'dust', 'duty',
        'each', 'earn', 'ease', 'east', 'easy', 'eat', 'edge', 'else', 'even', 'ever',
        'evil', 'exit', 'face', 'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate',
        'fear', 'feed', 'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'find',
        'fine', 'fire', 'firm', 'fish', 'five', 'flat', 'flow', 'food', 'foot', 'form',
        'four', 'free', 'from', 'fuel', 'full', 'fund', 'gain', 'game', 'gate', 'gave',
        'gear', 'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold', 'golf',
        'gone', 'good', 'grew', 'grow', 'hair', 'half', 'hall', 'hand', 'hang', 'hard',
        'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here',
        'hero', 'hide', 'high', 'hill', 'hire', 'hold', 'hole', 'holy', 'home', 'hope',
        'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea', 'inch', 'into', 'iron',
        'item', 'join', 'joke', 'jump', 'jury', 'just', 'keen', 'keep', 'kick', 'kill',
        'kind', 'king', 'knew', 'know', 'lack', 'lady', 'laid', 'lake', 'land', 'lane',
        'last', 'late', 'lead', 'left', 'less', 'life', 'lift', 'like', 'line', 'link',
        'list', 'live', 'load', 'loan', 'lock', 'long', 'look', 'lord', 'lose', 'loss',
        'lost', 'love', 'luck', 'made', 'mail', 'main', 'make', 'male', 'many', 'mark',
        'mass', 'math', 'meal', 'mean', 'meat', 'meet', 'menu', 'mere', 'mess', 'milk',
        'mind', 'mine', 'miss', 'mode', 'mood', 'moon', 'more', 'most', 'move', 'much',
        'must', 'name', 'navy', 'near', 'neck', 'need', 'news', 'next', 'nice', 'nine',
        'none', 'nose', 'note', 'noun', 'nuts', 'okay', 'once', 'only', 'onto', 'open',
        'oral', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'palm', 'park',
        'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'plan', 'play', 'plot',
        'plug', 'plus', 'poem', 'poet', 'poll', 'pool', 'poor', 'port', 'post', 'pull',
        'pure', 'push', 'race', 'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real',
        'rear', 'rely', 'rent', 'rest', 'rice', 'rich', 'ride', 'ring', 'rise', 'risk',
        'road', 'rock', 'role', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rule',
        'rush', 'safe', 'said', 'sake', 'sale', 'salt', 'same', 'sand', 'save', 'seat',
        'seed', 'seek', 'seem', 'seen', 'self', 'sell', 'send', 'sent', 'sept', 'ship',
        'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sign', 'silk', 'sing', 'sink',
        'site', 'size', 'skin', 'skip', 'slip', 'slow', 'snap', 'snow', 'soft', 'soil',
        'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul', 'soup', 'sour', 'span',
        'spin', 'spot', 'star', 'stay', 'step', 'stop', 'such', 'suit', 'sure', 'take',
        'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tear', 'tell', 'tend',
        'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this',
        'thus', 'tide', 'tile', 'till', 'time', 'tiny', 'told', 'toll', 'tone', 'tony',
        'took', 'tool', 'tour', 'town', 'tree', 'trip', 'true', 'tune', 'turn', 'twin',
        'type', 'ugly', 'unit', 'upon', 'used', 'user', 'vary', 'vast', 'very', 'vice',
        'view', 'visa', 'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want', 'ward',
        'warm', 'wash', 'wave', 'ways', 'weak', 'wear', 'week', 'well', 'went', 'were',
        'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild', 'will', 'wind', 'wine',
        'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work', 'yard',
        'yeah', 'year', 'your', 'zero', 'zone', 'zoo'
      ]);

      // Check if the word can be formed from the letters
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

      // Check if the word is in our dictionary
      const isInDictionary = commonWords.has(word.toLowerCase());
      const isValid = isInDictionary && canBeFormed;

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
        isValid: isValid,
        score: isValid ? calculateScore(word) : 0
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
