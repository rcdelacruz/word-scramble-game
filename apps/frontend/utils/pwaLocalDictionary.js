/**
 * PWA Local Dictionary Utility
 *
 * This module provides efficient local dictionary storage and validation
 * for the Word Scramble Game PWA. It uses IndexedDB for persistent storage
 * and implements a compact data structure for fast word lookups.
 */

// IndexedDB setup
const DB_NAME = 'word-scramble-dictionary';
const DB_VERSION = 1;
const STORE_NAME = 'dictionary-store';
const DICTIONARY_KEY = 'words';
const TIMESTAMP_KEY = 'last-updated';

// Dictionary state
let dictionary = new Set();
let dictionaryLoaded = false;
let isLoadingDictionary = false;
let loadingPromise = null;

// Open IndexedDB connection
const openDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(new Error('Error opening IndexedDB'));
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

// Save dictionary to IndexedDB
const saveDictionaryToCache = async (words, timestamp = Date.now()) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Save the words
    await new Promise((resolve, reject) => {
      const request = store.put(Array.from(words), DICTIONARY_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Save the timestamp
    await new Promise((resolve, reject) => {
      const request = store.put(timestamp, TIMESTAMP_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log(`Dictionary saved to cache: ${words.size} words`);
    return true;
  } catch (error) {
    console.error('Error saving dictionary to cache:', error);
    return false;
  }
};

// Load dictionary from IndexedDB
const loadDictionaryFromCache = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    // Get the words
    const words = await new Promise((resolve, reject) => {
      const request = store.get(DICTIONARY_KEY);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    // Get the timestamp
    const timestamp = await new Promise((resolve, reject) => {
      const request = store.get(TIMESTAMP_KEY);
      request.onsuccess = () => resolve(request.result || 0);
      request.onerror = () => reject(request.error);
    });

    if (words && words.length > 0) {
      console.log(`Dictionary loaded from cache: ${words.length} words, last updated: ${new Date(timestamp).toLocaleString()}`);
      return { words: new Set(words), timestamp };
    }

    console.log('No dictionary found in cache');
    return { words: new Set(), timestamp: 0 };
  } catch (error) {
    console.error('Error loading dictionary from cache:', error);
    return { words: new Set(), timestamp: 0 };
  }
};

// Fetch dictionary from the server
const fetchDictionaryFromServer = async () => {
  try {
    console.log('Fetching dictionary...');

    // Try to fetch the dictionary file directly first (faster and works offline)
    try {
      const response = await fetch('/dictionary.txt');

      if (response.ok) {
        const text = await response.text();
        const words = text
          .toLowerCase()
          .split(/\r?\n/)
          .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

        console.log(`Dictionary fetched directly: ${words.length} words`);
        return {
          words: new Set(words),
          timestamp: Date.now(),
          source: 'direct'
        };
      }
    } catch (directError) {
      console.warn('Could not fetch dictionary directly, trying API:', directError);
    }

    // Fallback to API if direct fetch fails
    const response = await fetch('/api/game/dictionary/download');

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success || !data.words || !Array.isArray(data.words)) {
      throw new Error('Invalid dictionary data received from server');
    }

    console.log(`Dictionary fetched from API: ${data.words.length} words`);
    return {
      words: new Set(data.words),
      timestamp: data.timestamp || Date.now(),
      source: 'api'
    };
  } catch (error) {
    console.error('Error fetching dictionary:', error);
    throw error;
  }
};

// Load the dictionary (from cache or server)
export const loadDictionary = async (forceRefresh = false) => {
  // If already loaded and not forcing refresh, return immediately
  if (dictionaryLoaded && !forceRefresh) {
    return dictionary;
  }

  // If already loading, return the existing promise
  if (isLoadingDictionary && loadingPromise) {
    return loadingPromise;
  }

  // Set loading state
  isLoadingDictionary = true;

  // Create a new loading promise
  loadingPromise = (async () => {
    try {
      // Try to load from cache first
      const cachedData = await loadDictionaryFromCache();

      // If cache is empty or forcing refresh, fetch from server
      if (cachedData.words.size === 0 || forceRefresh) {
        try {
          const serverData = await fetchDictionaryFromServer();
          dictionary = serverData.words;

          // Save to cache
          await saveDictionaryToCache(dictionary, serverData.timestamp);
        } catch (fetchError) {
          console.error('Error fetching from server, using cached data:', fetchError);
          dictionary = cachedData.words;

      // If we have no words at all, show an error
      if (dictionary.size === 0) {
        console.error('No dictionary available - please check your internet connection and reload');
      }
        }
      } else {
        // Use cached data
        dictionary = cachedData.words;
      }

      dictionaryLoaded = true;
      console.log(`Dictionary ready with ${dictionary.size} words`);
      return dictionary;
    } catch (error) {
      console.error('Error loading dictionary:', error);

      // Show error if dictionary couldn't be loaded
      console.error('Dictionary could not be loaded - please check your internet connection and reload');
      dictionary = new Set();
      return dictionary;
    } finally {
      isLoadingDictionary = false;
    }
  })();

  return loadingPromise;
};

// Display a message about dictionary loading
const showDictionaryStatus = (message) => {
  if (typeof window !== 'undefined') {
    console.log(message);

    // If we have a toast notification system, use it
    if (window.addToast) {
      window.addToast(message, 'info');
    }
  }
};

// Check if a word is valid
export const isValidWord = (word) => {
  if (!word || typeof word !== 'string') return false;

  // If dictionary isn't loaded yet, be permissive
  if (!dictionaryLoaded) {
    // Start loading the dictionary in the background
    loadDictionary().catch(console.error);
    // Allow any word that's at least 3 letters while dictionary is loading
    return word.length >= 3;
  }

  return dictionary.has(word.toLowerCase());
};

// Check if a word can be formed from given letters
export const canFormWord = (word, letters) => {
  if (!word || !letters || !Array.isArray(letters)) return false;

  const letterCounts = {};
  letters.forEach(letter => {
    const lowerLetter = letter.toLowerCase();
    letterCounts[lowerLetter] = (letterCounts[lowerLetter] || 0) + 1;
  });

  const wordLetters = word.toLowerCase().split('');
  return wordLetters.every(letter => {
    if (!letterCounts[letter] || letterCounts[letter] <= 0) return false;
    letterCounts[letter]--;
    return true;
  });
};

// Validate a word (both in dictionary and can be formed)
export const validateWord = (word, letters) => {
  // Check if word is at least 3 letters
  if (!word || word.length < 3) {
    return {
      isValid: false,
      reason: 'Word is too short (minimum 3 letters)'
    };
  }

  // Check if word can be formed from letters
  if (!canFormWord(word, letters)) {
    return {
      isValid: false,
      reason: 'Word cannot be formed from the available letters'
    };
  }

  // Check if word is in dictionary
  if (!isValidWord(word)) {
    return {
      isValid: false,
      reason: 'Word is not in the dictionary'
    };
  }

  // Word is valid
  return {
    isValid: true,
    reason: 'Valid word',
    score: calculateWordScore(word)
  };
};

// Calculate score for a word
export const calculateWordScore = (word) => {
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

// Get all possible words that can be formed from a set of letters
export const getPossibleWords = (letters) => {
  if (!letters || !Array.isArray(letters)) return [];

  // Ensure dictionary is loaded
  if (!dictionaryLoaded) {
    loadDictionary().catch(console.error);
    return []; // Return empty array if dictionary isn't loaded yet
  }

  const possibleWords = [];
  const letterCounts = {};

  // Count available letters
  letters.forEach(letter => {
    const lowerLetter = letter.toLowerCase();
    letterCounts[lowerLetter] = (letterCounts[lowerLetter] || 0) + 1;
  });

  // Check each word in the dictionary
  dictionary.forEach(word => {
    if (word.length < 3) return; // Skip very short words

    // Make a copy of letter counts for each word check
    const letterCountsCopy = { ...letterCounts };
    let canForm = true;

    // Check if word can be formed
    for (const char of word) {
      if (!letterCountsCopy[char] || letterCountsCopy[char] <= 0) {
        canForm = false;
        break;
      }
      letterCountsCopy[char]--;
    }

    if (canForm) {
      possibleWords.push(word);
    }
  });

  return possibleWords;
};

// Export the module
export default {
  loadDictionary,
  isValidWord,
  canFormWord,
  validateWord,
  calculateWordScore,
  getPossibleWords
};
