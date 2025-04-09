import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

export default function Game() {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  // Detect and set appropriate API URL for the environment
  useEffect(() => {
    const detectApiUrl = () => {
      // Default API URL
      let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      // Check if we're in a GitHub Codespace
      if (typeof window !== 'undefined' && window.location.hostname.includes('.app.github.dev')) {
        // Extract the codespace name and create a URL with the proper port for the backend
        const hostname = window.location.hostname;
        const codespacePrefix = hostname.split('.')[0];
        url = `https://${codespacePrefix}-5000.app.github.dev/api`;
      }
      
      console.log('API URL set to:', url);
      setApiUrl(url);
    };
    
    detectApiUrl();
  }, []);

  // Generate random letters locally
  const generateLetters = () => {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const newLetters = [];
    
    // Ensure we have at least 2 vowels
    for (let i = 0; i < 2; i++) {
      newLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    
    // Fill the rest with a mix, but bias toward consonants
    for (let i = 0; i < 6; i++) {
      const letterSet = Math.random() < 0.7 ? consonants : vowels;
      newLetters.push(letterSet[Math.floor(Math.random() * letterSet.length)]);
    }
    
    // Shuffle the array
    return newLetters.sort(() => Math.random() - 0.5);
  };

  // Fallback dictionary for offline play
  const fallbackDictionary = new Set([
    'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'chat', 'that', 
    'flat', 'brat', 'spat', 'stat', 'scat', 'splat', 'combat',
    'dog', 'log', 'fog', 'bog', 'cog', 'jog', 'frog', 'smog', 'blog',
    'word', 'game', 'play', 'time', 'fun', 'high', 'score', 'level',
    'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'any',
    'arm', 'art', 'ask', 'bad', 'bag', 'ban', 'bar', 'bed', 'bet', 'bid',
    'big', 'bit', 'box', 'boy', 'bug', 'bus', 'but', 'buy', 'can', 'cap',
    'car', 'cat', 'cop', 'cow', 'cry', 'cup', 'cut', 'dad', 'day', 'die',
    'dig', 'dim', 'dip', 'dirt', 'dish', 'dock', 'does', 'dog', 'door',
    'down', 'drag', 'draw', 'drop', 'dry', 'due', 'dull', 'dust', 'duty',
    'each', 'earn', 'ease', 'east', 'easy', 'eat', 'edge', 'else', 'even',
    'ever', 'evil', 'exit', 'face', 'fact', 'fail', 'fair', 'fall', 'farm',
    'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell', 'felt', 'file',
    'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five', 'flat',
    'flow', 'food', 'foot', 'form', 'four', 'free', 'from', 'fuel', 'full',
    'fund', 'gain', 'game', 'gate', 'gave', 'gear', 'gene', 'gift', 'girl',
    'give', 'glad', 'goal', 'goes', 'gold', 'golf', 'gone', 'good', 'grew',
    'grow', 'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'harm', 'hate',
    'have', 'head', 'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero',
    'hide', 'high', 'hill', 'hire', 'hold', 'hole', 'holy', 'home', 'hope',
    'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea', 'inch', 'into',
    'iron', 'item', 'join', 'joke', 'jump', 'jury', 'just', 'keen', 'keep',
    'kick', 'kill', 'kind', 'king', 'knew', 'know', 'lack', 'lady', 'laid',
    'lake', 'land', 'lane', 'last', 'late', 'lead', 'left', 'less', 'life',
    'lift', 'like', 'line', 'link', 'list', 'live', 'load', 'loan', 'lock',
    'long', 'look', 'lord', 'lose', 'loss', 'lost', 'love', 'luck'
  ]);

  // Test CORS setup
  const testApiConnection = async () => {
    try {
      if (!apiUrl) {
        console.log('API URL not set yet');
        return;
      }
      
      console.log('Testing API connection to:', apiUrl);
      const response = await axios.get(`${apiUrl.replace('/api', '')}/cors-test`);
      console.log('CORS test successful:', response.data);
      return true;
    } catch (error) {
      console.error('CORS test failed:', error);
      return false;
    }
  };

  // Function to check if a word is valid by calling the API
  const validateWordWithAPI = async (word, letters) => {
    try {
      if (!apiUrl) {
        throw new Error('API URL not set');
      }
      
      setLoading(true);
      // Try to validate using the API
      const response = await axios.post(`${apiUrl}/game/validate`, { 
        word, 
        letters 
      });
      
      setLoading(false);
      
      if (response.data && response.data.success) {
        return {
          isValid: response.data.isValid,
          score: response.data.score
        };
      }
      throw new Error('API validation failed');
    } catch (error) {
      console.log('Error validating word with API:', error);
      setLoading(false);
      
      // Fallback to local dictionary
      console.log('Falling back to local dictionary');
      return {
        isValid: fallbackDictionary.has(word.toLowerCase()),
        score: calculateLocalScore(word)
      };
    }
  };
  
  // Calculate score locally (fallback)
  const calculateLocalScore = (word) => {
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

  // Start a new game
  const startGame = async () => {
    try {
      // Test API connection before starting game
      await testApiConnection();
      
      setLoading(true);
      let newLetters;
      
      // Try to get letters from the API
      if (apiUrl) {
        try {
          const response = await axios.get(`${apiUrl}/game/letters`);
          if (response.data && response.data.success && response.data.letters) {
            newLetters = response.data.letters;
          } else {
            newLetters = generateLetters();
          }
        } catch (error) {
          console.log('Error getting letters from API:', error);
          newLetters = generateLetters();
        }
      } else {
        newLetters = generateLetters();
      }
      
      setLetters(newLetters);
      setSelectedLetters([]);
      setScore(0);
      setMessage('');
      setUsedWords([]);
      setTimer(60);
      setGameActive(true);
      setLoading(false);
    } catch (error) {
      console.log('Error starting game:', error);
      setLoading(false);
      
      // Fallback to generate letters locally
      const newLetters = generateLetters();
      setLetters(newLetters);
      setSelectedLetters([]);
      setScore(0);
      setMessage('');
      setUsedWords([]);
      setTimer(60);
      setGameActive(true);
    }
  };

  // Handle timer
  useEffect(() => {
    let interval = null;
    
    if (gameActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameActive(false);
      setMessage('Game over!');
    }
    
    return () => clearInterval(interval);
  }, [gameActive, timer]);

  // Handle letter selection
  const selectLetter = (letter, index) => {
    if (!gameActive) return;
    
    const newSelectedLetters = [...selectedLetters, { letter, originalIndex: index }];
    setSelectedLetters(newSelectedLetters);
  };

  // Submit word
  const submitWord = async () => {
    if (!gameActive || selectedLetters.length === 0) return;
    
    const word = selectedLetters.map(item => item.letter).join('');
    
    // Check if word has already been used
    if (usedWords.includes(word)) {
      setMessage('You already used that word!');
      return;
    }
    
    // Word must be at least 3 letters
    if (word.length < 3) {
      setMessage('Words must be at least 3 letters long.');
      return;
    }
    
    try {
      // Validate word with API (or fallback)
      const validation = await validateWordWithAPI(word, letters);
      
      if (validation.isValid) {
        // Valid word - add score and display message
        setScore(score + validation.score);
        setUsedWords([...usedWords, word]);
        setMessage(`Nice! +${validation.score} points.`);
        
        // Reset selected letters but keep the same available letters
        setSelectedLetters([]);
      } else {
        setMessage('Not a valid word.');
      }
    } catch (error) {
      console.log('Error submitting word:', error);
      setMessage('Error checking word. Try again.');
    }
  };

  // Clear current selection
  const clearSelection = () => {
    setSelectedLetters([]);
  };

  // Check if a letter is already selected
  const isLetterSelected = (index) => {
    return selectedLetters.some(item => item.originalIndex === index);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen">
      <Head>
        <title>Play Word Scramble</title>
        <meta name="description" content="Play the Word Scramble game" />
      </Head>
      
      <h1 className="text-4xl font-bold mb-6 text-indigo-800">Word Scramble</h1>
      
      {!gameActive && timer !== 60 && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-indigo-700">Game Over!</h2>
          <p className="text-xl mt-2">Your score: {score}</p>
          <p className="mt-1">Words found: {usedWords.length}</p>
          <button 
            onClick={startGame}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Play Again'}
          </button>
        </div>
      )}
      
      {!gameActive && timer === 60 && (
        <div className="text-center">
          <button 
            onClick={startGame}
            className="px-8 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Game'}
          </button>
          
          {/* Display API connection status */}
          <p className="mt-2 text-sm text-gray-600">
            {apiUrl ? `API: ${apiUrl}` : 'API not configured yet'}
          </p>
        </div>
      )}
      
      {gameActive && (
        <>
          <div className="flex justify-between w-full max-w-md mb-6">
            <div className="text-lg font-bold">Score: {score}</div>
            <div className="text-lg font-bold">Time: {timer}s</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6">
            {/* Display the letters user can choose from */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {letters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => selectLetter(letter, index)}
                  disabled={isLetterSelected(index) || loading}
                  className={`w-16 h-16 text-2xl font-bold rounded-lg ${
                    isLetterSelected(index)
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  } transition-colors shadow-sm`}
                >
                  {letter.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Display the selected letters */}
            <div className="bg-gray-100 p-4 rounded-lg min-h-16 flex items-center justify-center mb-4">
              {selectedLetters.length > 0 ? (
                <p className="text-2xl font-bold tracking-wider">
                  {selectedLetters.map(item => item.letter.toUpperCase()).join('')}
                </p>
              ) : (
                <p className="text-gray-500">Select letters to form a word</p>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={clearSelection}
                disabled={loading}
                className="flex-1 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={submitWord}
                disabled={loading}
                className="flex-1 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors"
              >
                {loading ? 'Checking...' : 'Submit'}
              </button>
            </div>
          </div>
          
          {/* Message area */}
          {message && (
            <div className="text-center py-2 px-4 rounded bg-indigo-100 text-indigo-800 mb-6">
              {message}
            </div>
          )}
          
          {/* List of found words */}
          <div className="bg-white p-4 rounded-lg shadow w-full max-w-md">
            <h3 className="font-bold mb-2 text-indigo-700">Words Found:</h3>
            <div className="flex flex-wrap gap-2">
              {usedWords.length > 0 ? (
                usedWords.map((word, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    {word}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No words found yet.</p>
              )}
            </div>
          </div>
        </>
      )}

      <Link href="/" className="mt-8 text-indigo-600 hover:text-indigo-800">
        Back to Home
      </Link>
    </div>
  );
}