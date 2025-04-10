// API route for validating words using the backend dictionary
import fs from 'fs';
import path from 'path';

// Load the dictionary from the backend file
let dictionary = new Set();

try {
  // Path to the dictionary file
  const dictionaryPath = path.join(process.cwd(), '..', '..', 'backend', 'data', 'dictionary.txt');
  console.log('Looking for dictionary at:', dictionaryPath);

  if (fs.existsSync(dictionaryPath)) {
    // Read the dictionary file
    const content = fs.readFileSync(dictionaryPath, 'utf8');
    const words = content
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

    dictionary = new Set(words);
    console.log(`Dictionary loaded with ${dictionary.size} words`);
  } else {
    console.warn('Dictionary file not found, using permissive validation');
  }
} catch (error) {
  console.error('Error loading dictionary:', error);
}

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { word, letters } = req.body;

    if (!word || !letters) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Check if the word can be formed from the letters
    const letterCounts = {};
    letters.forEach(letter => {
      letterCounts[letter.toLowerCase()] = (letterCounts[letter.toLowerCase()] || 0) + 1;
    });

    const wordLetters = word.toLowerCase().split('');
    const canBeFormed = wordLetters.every(letter => {
      if (!letterCounts[letter]) return false;
      letterCounts[letter]--;
      return true;
    });

    // Check if the word is in our dictionary
    const isInDictionary = dictionary.size > 0 ? dictionary.has(word.toLowerCase()) : word.length >= 3;

    // Word is valid if it can be formed from the letters AND it's in our dictionary
    const isValid = canBeFormed && isInDictionary;

    // Calculate a score based on word length
    const calculateScore = (word) => {
      const length = word.length;
      let score = length;
      if (length >= 5) score += 3;
      if (length >= 7) score += 5;
      if (length >= 9) score += 7;
      return score;
    };

    return res.status(200).json({
      success: true,
      word,
      isValid,
      score: isValid ? calculateScore(word) : 0
    });
  } catch (error) {
    console.error('Error validating word:', error);

    return res.status(500).json({
      success: false,
      error: 'Error validating word',
      message: error.message,
    });
  }
}
