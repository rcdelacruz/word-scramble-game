/**
 * Game Controller
 * Handles all game-related API endpoints
 * @module controllers/gameController
 */

const wordUtils = require('../utils/wordGenerator');
const dictionaryCheck = require('../utils/dictionaryCheck');
const Score = require('../models/Score');
const { ApiError } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');

/**
 * Generate a new set of letters for a game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} [req.query.difficulty='medium'] - Difficulty level (easy, medium, hard)
 * @param {number} [req.query.size=10] - Number of letters to generate (10, 15, 25)
 * @returns {Object} JSON response with letters and metadata
 */
exports.getLetterSet = (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'medium';
    const size = parseInt(req.query.size) || 10;

    // Validate board size
    const validSize = [10, 15, 25].includes(size) ? size : 10;

    const letters = wordUtils.generateLetterSet(difficulty, validSize);

    // Find possible words that can be formed with these letters
    const possibleWords = dictionaryCheck.getPossibleWords(letters);

    logger.info(`Generated letter set: difficulty=${difficulty}, size=${validSize}, possibleWords=${possibleWords.length}`);

    res.json({
      success: true,
      letters,
      possibleWords: possibleWords.length,
      boardSize: validSize
    });
  } catch (error) {
    logger.error('Error generating letter set:', error);
    throw new ApiError(500, 'Error generating letter set');
  }
};

/**
 * Validate a word
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body - Request body
 * @param {string} req.body.word - Word to validate
 * @param {string[]} req.body.letters - Available letters
 * @returns {Object} JSON response with validation results
 */
exports.validateWord = (req, res) => {
  try {
    logger.debug('Validate word request received:', req.body);
    const { word, letters } = req.body;

    if (!word || !letters || !Array.isArray(letters)) {
      logger.warn('Invalid request: missing word or letters');
      throw new ApiError(400, 'Word and letters array are required');
    }

    // Check if word can be formed from the letters
    const canBeFormed = wordUtils.canFormWord(word, letters);
    logger.debug('Can word be formed from letters?', canBeFormed);

    // Check if word exists in dictionary
    const isValidWord = canBeFormed && dictionaryCheck.isValidWord(word);
    logger.debug('Is word in dictionary?', dictionaryCheck.isValidWord(word));
    logger.debug('Final validation result:', isValidWord);

    // Calculate score if valid
    const score = isValidWord ? wordUtils.calculateWordScore(word) : 0;

    const response = {
      success: true,
      word,
      isValid: isValidWord,
      score
    };

    logger.debug('Sending response:', response);
    res.json(response);
  } catch (error) {
    logger.error('Error validating word:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error validating word');
  }
};

/**
 * Submit a score
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body - Request body
 * @param {string} [req.body.userId] - User ID if authenticated
 * @param {string} req.body.username - Player username
 * @param {number} req.body.score - Player score
 * @param {string[]} [req.body.wordsFound=[]] - Words found during the game
 * @param {string} [req.body.gameMode='classic'] - Game mode used
 * @param {number} [req.body.boardSize=10] - Board size used
 * @param {string} [req.body.difficulty='medium'] - Difficulty level
 * @returns {Object} JSON response with the saved score
 */
exports.submitScore = async (req, res) => {
  try {
    const { userId, username, score, wordsFound, gameMode } = req.body;

    if (!score || score < 0) {
      throw new ApiError(400, 'Valid score is required');
    }

    if (!username || !username.trim()) {
      throw new ApiError(400, 'Username is required');
    }

    // Create a new score document
    const newScore = new Score({
      userId: userId || null,
      username: username.trim(),
      score: score,
      wordsFound: wordsFound || [],
      gameMode: gameMode || 'classic',
      boardSize: req.body.boardSize || 10,
      difficulty: req.body.difficulty || 'medium'
    });

    // Save to MongoDB
    await newScore.save();

    logger.info(`Score submitted for ${username}: ${score} points`);

    res.json({
      success: true,
      scoreId: newScore._id,
      message: 'Score submitted successfully'
    });
  } catch (error) {
    logger.error('Error submitting score:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error submitting score');
  }
};

/**
 * Clear all leaderboard data (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message
 */
exports.clearLeaderboard = async (req, res) => {
  try {
    // Delete all scores from the database
    await Score.deleteMany({});

    logger.info('Leaderboard data cleared successfully');

    res.json({
      success: true,
      message: 'Leaderboard data cleared successfully'
    });
  } catch (error) {
    logger.error('Error clearing leaderboard:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error clearing leaderboard');
  }
};

/**
 * Get leaderboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} [req.query.gameMode] - Game mode to filter by
 * @param {string} [req.query.timeFrame='all'] - Time frame to filter by (all, daily, weekly, monthly)
 * @param {number} [req.query.limit=10] - Maximum number of scores to return
 * @returns {Object} JSON response with leaderboard data
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameMode, timeFrame, limit = 10, boardSize } = req.query;

    // Build MongoDB query
    const query = {};

    // Filter by game mode if specified
    if (gameMode) {
      query.gameMode = gameMode;
    }

    // Filter by board size if specified
    if (boardSize) {
      query.boardSize = parseInt(boardSize);
    }

    // Filter by time frame if specified
    if (timeFrame && timeFrame !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      if (timeFrame === 'daily') {
        cutoffDate.setDate(now.getDate() - 1);
      } else if (timeFrame === 'weekly') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeFrame === 'monthly') {
        cutoffDate.setMonth(now.getMonth() - 1);
      }

      query.createdAt = { $gte: cutoffDate };
    }

    // Query MongoDB for scores
    const scores = await Score.find(query)
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(parseInt(limit))
      .lean(); // Convert to plain JavaScript objects

    logger.info(`Returning ${scores.length} scores for leaderboard`);

    res.json({
      success: true,
      scores: scores
    });
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error fetching leaderboard');
  }
};
