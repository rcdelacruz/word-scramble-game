const wordUtils = require('../src/utils/wordGenerator');
const dictionaryCheck = require('../src/utils/dictionaryCheck');
const Score = require('../models/Score');

// Generate a new set of letters for a game
exports.getLetterSet = (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'medium';
    const letters = wordUtils.generateLetterSet(difficulty);

    // Find possible words that can be formed with these letters
    const possibleWords = dictionaryCheck.getPossibleWords(letters);

    res.json({
      success: true,
      letters,
      possibleWords: possibleWords.length
    });
  } catch (error) {
    console.error('Error generating letter set:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating letter set',
      error: error.message
    });
  }
};

// Validate a word
exports.validateWord = (req, res) => {
  try {
    console.log('Validate word request received:', req.body);
    const { word, letters } = req.body;

    if (!word || !letters || !Array.isArray(letters)) {
      console.log('Invalid request: missing word or letters');
      return res.status(400).json({
        success: false,
        message: 'Word and letters array are required'
      });
    }

    // Check if word can be formed from the letters
    const canBeFormed = wordUtils.canFormWord(word, letters);
    console.log('Can word be formed from letters?', canBeFormed);

    // Check if word exists in dictionary
    const isValidWord = canBeFormed && dictionaryCheck.isValidWord(word);
    console.log('Is word in dictionary?', dictionaryCheck.isValidWord(word));
    console.log('Final validation result:', isValidWord);

    // Calculate score if valid
    const score = isValidWord ? wordUtils.calculateWordScore(word) : 0;

    const response = {
      success: true,
      word,
      isValid: isValidWord,
      score
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error validating word:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating word',
      error: error.message
    });
  }
};

// Submit a score
exports.submitScore = async (req, res) => {
  try {
    const { userId, username, score, wordsFound, gameMode } = req.body;

    if (!score || score < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid score is required'
      });
    }

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Create a new score document
    const newScore = new Score({
      userId: userId || null,
      username: username.trim(),
      score: score,
      wordsFound: wordsFound || [],
      gameMode: gameMode || 'classic'
    });

    // Save to MongoDB
    await newScore.save();

    console.log(`Score submitted for ${username}: ${score} points`);

    res.json({
      success: true,
      scoreId: newScore._id,
      message: 'Score submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting score',
      error: error.message
    });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameMode, timeFrame, limit = 10 } = req.query;

    // Build MongoDB query
    const query = {};

    // Filter by game mode if specified
    if (gameMode) {
      query.gameMode = gameMode;
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

    console.log(`Returning ${scores.length} scores for leaderboard`);

    res.json({
      success: true,
      scores: scores
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};
