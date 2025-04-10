// API route for submitting scores locally

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const scoreData = req.body;

    // Validate required fields
    if (!scoreData.username || !scoreData.score) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (username, score)'
      });
    }

    // Create a mock score submission response
    const submittedScore = {
      ...scoreData,
      id: `local-${Date.now()}`,
      date: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Score submitted successfully (local mode)',
      score: submittedScore
    });
  } catch (error) {
    console.error('Error submitting score:', error);

    return res.status(500).json({
      success: false,
      error: 'Error submitting score',
      message: error.message,
    });
  }
}
