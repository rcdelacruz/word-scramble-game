const fs = require('fs');
const path = require('path');

// In a real implementation, we would load a full dictionary file
// For now, we'll create a mini dictionary for demonstration
const dictionary = {
  'cat': true, 'bat': true, 'rat': true, 'hat': true, 'mat': true, 
  'sat': true, 'pat': true, 'chat': true, 'that': true, 'flat': true, 
  'brat': true, 'spat': true, 'stat': true, 'scat': true, 'splat': true, 
  'combat': true, 'dog': true, 'log': true, 'fog': true, 'bog': true, 
  'cog': true, 'jog': true, 'frog': true, 'smog': true, 'blog': true,
  'word': true, 'game': true, 'play': true, 'time': true, 'fun': true, 
  'high': true, 'score': true, 'level': true, 'win': true, 'lose': true
};

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
  const letterStr = letters.join('');
  
  // In a real implementation, we'd use a more efficient algorithm
  // For now, we'll just check each word in our mini dictionary
  Object.keys(dictionary).forEach(word => {
    let canForm = true;
    const letterCounts = {};
    
    // Count available letters
    letters.forEach(letter => {
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