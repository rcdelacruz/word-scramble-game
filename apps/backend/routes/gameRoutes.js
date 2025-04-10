const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { validate } = require('../middleware/validationMiddleware');
const gameValidation = require('../validations/gameValidation');

// Game routes with validation
router.get('/letters', validate(gameValidation.getLetterSet), gameController.getLetterSet);
router.post('/validate', validate(gameValidation.validateWord), gameController.validateWord);
router.post('/score', validate(gameValidation.submitScore), gameController.submitScore);
router.get('/leaderboard', validate(gameValidation.getLeaderboard), gameController.getLeaderboard);

// Admin routes - should be protected in production
router.delete('/leaderboard', gameController.clearLeaderboard);

module.exports = router;
