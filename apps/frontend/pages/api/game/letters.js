// API route for generating letter sets locally

export default async function handler(req, res) {
  try {
    const { difficulty = 'medium', size = 10 } = req.query;
    const boardSize = parseInt(size, 10) || 10;

    // Generate random letters locally based on difficulty and board size
    const generateLetters = (difficultyLevel = 'medium', size = 10) => {
      // Different letter distributions based on difficulty
      const letterSets = {
        easy: {
          vowels: 'aeioua', // Duplicate common vowels
          consonants: 'rstlnbcdfghjkmpqvwxyz', // Common consonants first
          vowelBias: 0.4 // Higher chance of vowels
        },
        medium: {
          vowels: 'aeiou',
          consonants: 'bcdfghjklmnpqrstvwxyz',
          vowelBias: 0.3
        },
        hard: {
          vowels: 'aeiou',
          consonants: 'jkqvwxzbcdfghlmnprst', // Less common consonants first
          vowelBias: 0.2 // Lower chance of vowels
        }
      };

      const { vowels, consonants, vowelBias } = letterSets[difficultyLevel] || letterSets.medium;
      const newLetters = [];

      // Calculate vowel count based on board size
      const vowelCount = Math.max(2, Math.floor(size * (difficultyLevel === 'easy' ? 0.4 : 0.3)));

      // Ensure we have minimum number of vowels based on difficulty and board size
      for (let i = 0; i < vowelCount; i++) {
        newLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
      }

      // Fill the rest with a mix, with bias based on difficulty
      for (let i = 0; i < (size - vowelCount); i++) {
        const letterSet = Math.random() < vowelBias ? vowels : consonants;
        newLetters.push(letterSet[Math.floor(Math.random() * letterSet.length)]);
      }

      // Shuffle the array
      return newLetters.sort(() => Math.random() - 0.5);
    };

    const letters = generateLetters(difficulty, boardSize);

    return res.status(200).json({
      success: true,
      letters,
      difficulty,
      size: boardSize
    });
  } catch (error) {
    console.error('Error generating letters:', error);

    // Return a fallback response if there's an error
    return res.status(500).json({
      success: false,
      error: 'Error generating letters',
      message: error.message,
    });
  }
}
