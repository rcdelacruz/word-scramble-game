/**
 * Game validation schemas
 * Defines validation schemas for game-related API endpoints
 */

const Joi = require('joi');

// Get letter set validation
const getLetterSet = {
  query: Joi.object().keys({
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
    size: Joi.number().valid(10, 15, 25).default(10),
  }),
};

// Validate word validation
const validateWord = {
  body: Joi.object().keys({
    word: Joi.string().required().min(2).max(25),
    letters: Joi.array().items(Joi.string().length(1)).required().min(1),
  }),
};

// Submit score validation
const submitScore = {
  body: Joi.object().keys({
    username: Joi.string().allow('').max(20).default('Anonymous'),
    score: Joi.number().required().min(0),
    boardSize: Joi.number().valid(10, 15, 25).default(10),
    wordsFound: Joi.array().items(Joi.string()).default([]),
    words: Joi.array().items(Joi.string()), // Added for backward compatibility with tests
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
    gameMode: Joi.string().valid('classic', 'timed', 'daily').default('classic'),
  }),
};

// Get leaderboard validation
const getLeaderboard = {
  query: Joi.object().keys({
    timeFrame: Joi.string().valid('all', 'daily', 'weekly', 'monthly').default('all'),
    limit: Joi.number().min(1).max(100).default(10),
    gameMode: Joi.string().valid('classic', 'timed', 'daily'),
    boardSize: Joi.number().valid(10, 15, 25),
  }),
};

module.exports = {
  getLetterSet,
  validateWord,
  submitScore,
  getLeaderboard,
};
