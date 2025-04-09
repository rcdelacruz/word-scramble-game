const Score = require('../models/Score');
const wordUtils = require('../utils/wordGenerator');
const dictionaryCheck = require('../utils/dictionaryCheck');

// Generate a new set of letters for a game
exports.getLetterSet = (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'medium';
    const letters = wordUtils.generateLetterSet(difficulty);
    
    res.json({
      success: true,
      letters,
      possibleWords: wordUtils.findPossibleWords(letters).length
    });
  } catch (error) {
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
    const { word, letters } = req.body;
    
    if (!word || !letters || !Array.isArray(letters)) {
      return res.status(400).json({
        success: false,
        message: 'Word and letters array are required'
      });
    }
    
    // Check if word can be formed from the letters
    const canBeFormed = wordUtils.canFormWord(word, letters);
    
    // Check if word exists in dictionary
    const isValidWord = canBeFormed && dictionaryCheck.isValidWord(word);
    
    res.json({
      success: true,
      word,
      isValid: isValidWord,
      score: isValidWord ? wordUtils.calculateWordScore(word) : 0
    });
  } catch (error) {
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
    
    const newScore = new Score({
      userId: userId || null, // Allow anonymous scores
      username: username || 'Anonymous',
      score,
      wordsFound: wordsFound || [],
      gameMode: gameMode || 'classic'
    });
    
    await newScore.save();
    
    res.json({
      success: true,
      scoreId: newScore._id,
      message: 'Score submitted successfully'
    });
  } catch (error) {
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
    const { gameMode, timeFrame, limit } = req.query;
    
    const query = {};
    if (gameMode) query.gameMode = gameMode;
    
    // Add time frame filter
    if (timeFrame === 'daily') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query.createdAt = { $gte: yesterday };
    } else if (timeFrame === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      query.createdAt = { $gte: lastWeek };
    }
    
    const scores = await Score.find(query)
      .sort({ score: -1 })
      .limit(parseInt(limit) || 10);
      
    res.json({
      success: true,
      scores
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};