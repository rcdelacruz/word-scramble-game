const dictionaryCheck = require('./dictionaryCheck');

// Letter frequencies (English language)
const letterFrequencies = {
  easy: {
    vowels: 'aeioua', // Duplicate common vowels
    consonants: 'rstlnbcdfghjkmpqvwxyz' // Common consonants first
  },
  medium: {
    vowels: 'aeiou',
    consonants: 'bcdfghjklmnpqrstvwxyz'
  },
  hard: {
    vowels: 'aeiou',
    consonants: 'jkqvwxzbcdfghlmnprst' // Less common consonants first
  }
};

// Generate a set of letters based on difficulty
exports.generateLetterSet = (difficulty = 'medium') => {
  const { vowels, consonants } = letterFrequencies[difficulty] || letterFrequencies.medium;
  const letters = [];
  
  // Ensure at least 2-3 vowels
  const vowelCount = difficulty === 'hard' ? 2 : 3;
  for (let i = 0; i < vowelCount; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }
  
  // Fill the rest with consonants
  const totalLetters = 8; // 8 letters total
  for (let i = 0; i < totalLetters - vowelCount; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }
  
  // Shuffle the array
  return letters.sort(() => Math.random() - 0.5);
};

// Check if a word can be formed from the given letters
exports.canFormWord = (word, letters) => {
  if (!word || !letters) return false;
  
  const letterCount = {};
  
  // Count available letters
  letters.forEach(letter => {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  });
  
  // Check if word can be formed
  for (const char of word.toLowerCase()) {
    if (!letterCount[char] || letterCount[char] === 0) {
      return false;
    }
    letterCount[char]--;
  }
  
  return true;
};

// Calculate score for a word
exports.calculateWordScore = (word) => {
  if (!word) return 0;
  
  const length = word.length;
  
  // Base score: 1 point per letter
  let score = length;
  
  // Bonus points for longer words
  if (length >= 4) score += (length - 3) * 2;
  if (length >= 6) score += 5; // Extra bonus for 6+ letter words
  if (length >= 8) score += 10; // Extra bonus for 8+ letter words
  
  return score;
};

// Find all possible words that can be formed with the given letters
exports.findPossibleWords = (letters) => {
  return dictionaryCheck.getPossibleWords(letters);
};
