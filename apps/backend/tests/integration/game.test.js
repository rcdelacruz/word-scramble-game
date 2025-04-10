/**
 * Integration tests for the game API
 */

const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../../server');
const Score = require('../../models/Score');

describe('Game API', () => {
  before(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/word-scramble-test');
    }
  });

  after(async () => {
    // Clean up test database
    if (process.env.NODE_ENV === 'test') {
      await Score.deleteMany({});
    }
  });

  describe('GET /api/game/letters', () => {
    it('should return a set of letters', async () => {
      const res = await request(app)
        .get('/api/game/letters')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('letters');
      expect(res.body.letters).to.be.an('array');
      expect(res.body.letters).to.have.lengthOf(10); // Default size
    });

    it('should respect the size parameter', async () => {
      const res = await request(app)
        .get('/api/game/letters?size=15')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('letters');
      expect(res.body.letters).to.be.an('array');
      expect(res.body.letters).to.have.lengthOf(15);
    });

    it('should validate the size parameter', async () => {
      const res = await request(app)
        .get('/api/game/letters?size=999') // Invalid size
        .expect(200); // Should still return 200 but with default size

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('letters');
      expect(res.body.letters).to.be.an('array');
      expect(res.body.letters).to.have.lengthOf(10); // Should default to 10
    });
  });

  describe('POST /api/game/validate', () => {
    it('should validate a valid word', async () => {
      const res = await request(app)
        .post('/api/game/validate')
        .send({
          word: 'test',
          letters: ['t', 'e', 's', 't', 'a', 'b', 'c', 'd', 'e', 'f']
        })
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('isValid', true);
      expect(res.body).to.have.property('score').that.is.a('number');
    });

    it('should reject a word that cannot be formed from the letters', async () => {
      const res = await request(app)
        .post('/api/game/validate')
        .send({
          word: 'impossible',
          letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        })
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('isValid', false);
    });

    it('should reject invalid input', async () => {
      const res = await request(app)
        .post('/api/game/validate')
        .send({
          // Missing 'word' field
          letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        })
        .expect(400);

      expect(res.body).to.have.property('success', false);
    });
  });

  describe('POST /api/game/score', () => {
    it('should submit a score', async () => {
      const scoreData = {
        username: 'testuser',
        score: 100,
        boardSize: 10,
        words: ['test', 'word']
      };

      const res = await request(app)
        .post('/api/game/score')
        .send(scoreData)
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('score');
      expect(res.body.score).to.have.property('username', 'testuser');
      expect(res.body.score).to.have.property('score', 100);
    });

    it('should handle anonymous submissions', async () => {
      const scoreData = {
        score: 50,
        boardSize: 10
      };

      const res = await request(app)
        .post('/api/game/score')
        .send(scoreData)
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('score');
      expect(res.body.score).to.have.property('username', 'Anonymous');
      expect(res.body.score).to.have.property('score', 50);
    });
  });

  describe('GET /api/game/leaderboard', () => {
    before(async () => {
      // Add some test scores
      await Score.deleteMany({});
      await Score.create([
        { username: 'user1', score: 100, boardSize: 10, date: new Date() },
        { username: 'user2', score: 200, boardSize: 15, date: new Date() },
        { username: 'user3', score: 150, boardSize: 10, date: new Date() }
      ]);
    });

    it('should return the leaderboard', async () => {
      const res = await request(app)
        .get('/api/game/leaderboard')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('scores');
      expect(res.body.scores).to.be.an('array');
      expect(res.body.scores).to.have.lengthOf(3);
      
      // Should be sorted by score (descending)
      expect(res.body.scores[0].score).to.equal(200);
      expect(res.body.scores[1].score).to.equal(150);
      expect(res.body.scores[2].score).to.equal(100);
    });

    it('should respect the limit parameter', async () => {
      const res = await request(app)
        .get('/api/game/leaderboard?limit=2')
        .expect(200);

      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('scores');
      expect(res.body.scores).to.be.an('array');
      expect(res.body.scores).to.have.lengthOf(2);
      
      // Should only return the top 2 scores
      expect(res.body.scores[0].score).to.equal(200);
      expect(res.body.scores[1].score).to.equal(150);
    });
  });
});
