const express = require('express');
const router = express.Router();

// This is a placeholder file - we'll implement the controller later
// const gameController = require('../controllers/gameController');

// Game routes
router.get('/letters', (req, res) => {
  // Simple mock implementation
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  res.json({
    success: true,
    letters,
    possibleWords: 10
  });
});

router.post('/validate', (req, res) => {
  const { word } = req.body;
  
  // Simple mock implementation
  const validWords = ['cat', 'bat', 'hat', 'rat', 'sat', 'dog', 'log', 'fog'];
  const isValid = validWords.includes(word);
  
  res.json({
    success: true,
    word,
    isValid,
    score: isValid ? word.length : 0
  });
});

router.post('/score', (req, res) => {
  // Simple mock implementation
  res.json({
    success: true,
    scoreId: 'mock-score-id',
    message: 'Score submitted successfully'
  });
});

router.get('/leaderboard', (req, res) => {
  // Simple mock implementation
  const mockLeaderboard = [
    { id: 1, username: 'player1', score: 120 },
    { id: 2, username: 'player2', score: 100 },
    { id: 3, username: 'player3', score: 90 }
  ];
  
  res.json({
    success: true,
    scores: mockLeaderboard
  });
});

module.exports = router;