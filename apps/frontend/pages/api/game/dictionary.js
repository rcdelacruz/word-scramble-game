// API route for checking if a word is in the dictionary
import fs from 'fs';
import path from 'path';

// Load the dictionary from the backend file
let dictionary = new Set();
let dictionaryLoaded = false;

// Function to load the dictionary
const loadDictionary = () => {
  if (dictionaryLoaded) return;
  
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
      dictionaryLoaded = true;
      console.log(`Dictionary loaded with ${dictionary.size} words`);
    } else {
      console.warn('Dictionary file not found, using permissive validation');
    }
  } catch (error) {
    console.error('Error loading dictionary:', error);
  }
};

// Load the dictionary on first request
loadDictionary();

export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { word } = req.query;

    if (!word) {
      return res.status(400).json({
        success: false,
        error: 'Missing word parameter'
      });
    }

    // Make sure dictionary is loaded
    if (!dictionaryLoaded) {
      loadDictionary();
    }

    // Check if the word is in our dictionary
    const isInDictionary = dictionary.size > 0 
      ? dictionary.has(word.toLowerCase()) 
      : word.length >= 3;

    return res.status(200).json({
      success: true,
      word,
      isValid: isInDictionary
    });
  } catch (error) {
    console.error('Error checking dictionary:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Error checking dictionary',
      message: error.message,
    });
  }
}
