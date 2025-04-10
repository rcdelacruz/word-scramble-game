// API route for getting the leaderboard using local data

// Sample leaderboard data
const sampleLeaderboardData = [
  { id: 1, username: 'WordMaster', score: 120, boardSize: 10, date: new Date().toISOString() },
  { id: 2, username: 'LetterNinja', score: 105, boardSize: 10, date: new Date().toISOString() },
  { id: 3, username: 'VocabHero', score: 98, boardSize: 15, date: new Date().toISOString() },
  { id: 4, username: 'SpellingBee', score: 87, boardSize: 10, date: new Date().toISOString() },
  { id: 5, username: 'WordWizard', score: 82, boardSize: 15, date: new Date().toISOString() },
  { id: 6, username: 'Scrabbler', score: 75, boardSize: 10, date: new Date().toISOString() },
  { id: 7, username: 'Wordsmith', score: 68, boardSize: 25, date: new Date().toISOString() },
  { id: 8, username: 'Lexicon', score: 62, boardSize: 15, date: new Date().toISOString() },
  { id: 9, username: 'Speller', score: 55, boardSize: 10, date: new Date().toISOString() },
  { id: 10, username: 'Linguist', score: 50, boardSize: 25, date: new Date().toISOString() }
];

export default async function handler(req, res) {
  try {
    const { limit = 10, boardSize } = req.query;

    // Filter by board size if specified
    let filteredScores = [...sampleLeaderboardData];
    if (boardSize) {
      const size = parseInt(boardSize, 10);
      filteredScores = filteredScores.filter(score => score.boardSize === size);
    }

    // Sort by score (highest first)
    filteredScores.sort((a, b) => b.score - a.score);

    // Limit the number of results
    const limitNum = parseInt(limit, 10) || 10;
    filteredScores = filteredScores.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      message: 'Sample leaderboard data (local mode)',
      scores: filteredScores
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);

    return res.status(500).json({
      success: false,
      error: 'Error getting leaderboard',
      message: error.message,
    });
  }
}
