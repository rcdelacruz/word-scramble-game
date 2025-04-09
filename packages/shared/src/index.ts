// Types for both frontend and backend

// Game related types
export interface Score {
  _id?: string;
  userId?: string;
  username: string;
  score: number;
  wordsFound: string[];
  gameMode: 'classic' | 'timed' | 'daily';
  createdAt?: Date;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  highScore?: number;
  gamesPlayed?: number;
  achievements?: string[];
  createdAt?: Date;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  gameMode: 'classic' | 'timed' | 'daily';
}

export interface GameState {
  letters: string[];
  selectedLetters: Array<{letter: string, originalIndex: number}>;
  score: number;
  usedWords: string[];
  timer: number;
  gameActive: boolean;
  message?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LetterSetResponse {
  letters: string[];
  possibleWords: number;
}

export interface WordValidationResponse {
  word: string;
  isValid: boolean;
  score: number;
}

export interface SubmitScoreResponse {
  scoreId: string;
}

export interface LeaderboardResponse {
  scores: Score[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Constants
export const GAME_CONSTANTS = {
  DEFAULT_TIMER: 60,
  MIN_WORD_LENGTH: 3,
  LETTER_COUNT: 8,
  VOWEL_COUNT: {
    easy: 3,
    medium: 3,
    hard: 2
  },
  SCORE_MULTIPLIERS: {
    4: 2, // 4-letter words get 2x bonus per letter beyond 3
    6: 5, // 6+ letter words get additional 5 points
    8: 10 // 8+ letter words get additional 10 points
  }
};
