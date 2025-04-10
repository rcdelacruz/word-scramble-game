// Test script to verify dictionary loading
const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());

// Try to load the dictionary
try {
  const dictionaryPath = path.join(__dirname, 'data', 'dictionary.txt');
  console.log('Looking for dictionary at:', dictionaryPath);
  
  if (fs.existsSync(dictionaryPath)) {
    // Read the first 10 words
    const content = fs.readFileSync(dictionaryPath, 'utf8');
    const words = content
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word))
      .slice(0, 10);
    
    console.log('First 10 words in dictionary:', words);
    console.log('Total words:', content.split(/\r?\n/).length);
  } else {
    console.warn('Dictionary file not found!');
  }
} catch (error) {
  console.error('Error loading dictionary:', error);
}
