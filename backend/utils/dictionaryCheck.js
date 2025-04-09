const fs = require('fs');
const path = require('path');

let dictionary = {};

// Load dictionary from file
try {
  // We'll use a path relative to this file
  const dictionaryPath = path.join(__dirname, '../data/dictionary.txt');
  
  // Check if the dictionary file exists
  if (fs.existsSync(dictionaryPath)) {
    // Read dictionary file and convert to Set for O(1) lookups
    const words = fs.readFileSync(dictionaryPath, 'utf8')
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));
    
    // Convert array to dictionary object for fast lookups
    words.forEach(word => {
      dictionary[word] = true;
    });
    
    console.log(`Dictionary loaded: ${Object.keys(dictionary).length} words`);
  } else {
    console.warn('Dictionary file not found, using fallback mini dictionary');
    // Fallback mini dictionary if file doesn't exist
    dictionary = {
      'cat': true, 'bat': true, 'rat': true, 'hat': true, 'mat': true, 
      'sat': true, 'pat': true, 'chat': true, 'that': true, 'flat': true, 
      'brat': true, 'spat': true, 'stat': true, 'scat': true, 'splat': true, 
      'combat': true, 'dog': true, 'log': true, 'fog': true, 'bog': true, 
      'cog': true, 'jog': true, 'frog': true, 'smog': true, 'blog': true,
      'word': true, 'game': true, 'play': true, 'time': true, 'fun': true, 
      'high': true, 'score': true, 'level': true, 'win': true, 'lose': true
    };
  }
} catch (error) {
  console.error('Error loading dictionary:', error);
  // Fallback mini dictionary
  dictionary = {
    'cat': true, 'bat': true, 'rat': true, 'hat': true, 'mat': true, 
    'sat': true, 'pat': true, 'chat': true, 'that': true, 'flat': true, 
    'brat': true, 'spat': true, 'stat': true, 'scat': true, 'splat': true, 
    'combat': true, 'dog': true, 'log': true, 'fog': true, 'bog': true, 
    'cog': true, 'jog': true, 'frog': true, 'smog': true, 'blog': true,
    'word': true, 'game': true, 'play': true, 'time': true, 'fun': true, 
    'high': true, 'score': true, 'level': true, 'win': true, 'lose': true
  };
}

// Check if a word exists in our dictionary
exports.isValidWord = (word) => {
  if (!word || typeof word !== 'string') return false;
  return dictionary[word.toLowerCase()] === true;
};

// Get a hint (partial definition or related word)
exports.getWordHint = (word) => {
  // In a real app, this would connect to a dictionary API
  // For now, return a simple message
  return `This is a ${word.length}-letter word that starts with "${word[0]}"`;
};

// Get possible words that can be formed from a set of letters
exports.getPossibleWords = (letters) => {
  if (!letters || !Array.isArray(letters)) return [];
  
  const possibleWords = [];
  
  // Get a string of all letters joined
  const availableLetters = letters.map(l => l.toLowerCase());
  
  // In a real implementation, we'd use a more efficient algorithm
  // For now, we'll check each word in our dictionary
  Object.keys(dictionary).forEach(word => {
    if (word.length < 3) return; // Skip very short words
    
    let canForm = true;
    const letterCounts = {};
    
    // Count available letters
    availableLetters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    
    // Check if word can be formed
    for (const char of word) {
      if (!letterCounts[char] || letterCounts[char] === 0) {
        canForm = false;
        break;
      }
      letterCounts[char]--;
    }
    
    if (canForm) {
      possibleWords.push(word);
    }
  });
  
  return possibleWords;
};