const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Game routes
router.get('/letters', gameController.getLetterSet);
router.post('/validate', gameController.validateWord);
router.post('/score', gameController.submitScore);
router.get('/leaderboard', gameController.getLeaderboard);
router.delete('/leaderboard', gameController.clearLeaderboard);

module.exports = router;
