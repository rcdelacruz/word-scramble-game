const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  username: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  score: {
    type: Number,
    required: true
  },
  wordsFound: {
    type: [String],
    default: []
  },
  gameMode: {
    type: String,
    enum: ['classic', 'timed', 'daily'],
    default: 'classic'
  },
  boardSize: {
    type: Number,
    enum: [10, 15, 25],
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Score', ScoreSchema);
