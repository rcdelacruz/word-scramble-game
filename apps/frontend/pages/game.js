import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { gameService } from '../services/api';

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
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [username, setUsername] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Use hardcoded API URL - directly from environment variable
  useEffect(() => {
    // Use the environment variable from .env file
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    console.log('Using API URL from environment:', url);
    setApiUrl(url);

    // Log debug information
    if (typeof window !== 'undefined') {
      console.log('Current frontend URL:', window.location.href);
    }
  }, []);

  // Generate random letters locally based on difficulty
  const generateLetters = (difficultyLevel = 'medium') => {
    // Different letter distributions based on difficulty
    const letterSets = {
      easy: {
        vowels: 'aeioua', // Duplicate common vowels
        consonants: 'rstlnbcdfghjkmpqvwxyz', // Common consonants first
        vowelCount: 3,
        vowelBias: 0.4 // Higher chance of vowels
      },
      medium: {
        vowels: 'aeiou',
        consonants: 'bcdfghjklmnpqrstvwxyz',
        vowelCount: 2,
        vowelBias: 0.3
      },
      hard: {
        vowels: 'aeiou',
        consonants: 'jkqvwxzbcdfghlmnprst', // Less common consonants first
        vowelCount: 2,
        vowelBias: 0.2 // Lower chance of vowels
      }
    };

    const { vowels, consonants, vowelCount, vowelBias } = letterSets[difficultyLevel] || letterSets.medium;
    const newLetters = [];

    // Ensure we have minimum number of vowels based on difficulty
    for (let i = 0; i < vowelCount; i++) {
      newLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    // Fill the rest with a mix, with bias based on difficulty
    for (let i = 0; i < (8 - vowelCount); i++) {
      const letterSet = Math.random() < vowelBias ? vowels : consonants;
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

  // Function to check if a word is valid by calling the API
  const validateWordWithAPI = async (word, letters) => {
    try {
      if (!apiUrl) {
        throw new Error('API URL not set');
      }

      console.log('Validating word with API:', word);
      console.log('API URL:', apiUrl);
      console.log('Letters:', letters);

      setLoading(true);
      // Try to validate using the API
      const response = await axios.post(`${apiUrl}/game/validate`, {
        word,
        letters
      });

      setLoading(false);
      console.log('API Response:', response.data);

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
      const isValid = fallbackDictionary.has(word.toLowerCase());
      console.log('Local dictionary result:', isValid ? 'Valid' : 'Invalid');
      return {
        isValid: isValid,
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
      setLoading(true);
      let newLetters;

      // Try to get letters from the API
      if (apiUrl) {
        try {
          console.log('Fetching letters from API:', `${apiUrl}/game/letters?difficulty=${difficulty}`);
          const response = await axios.get(`${apiUrl}/game/letters?difficulty=${difficulty}`);
          if (response.data && response.data.success && response.data.letters) {
            newLetters = response.data.letters;
          } else {
            newLetters = generateLetters(difficulty);
          }
        } catch (error) {
          console.log('Error getting letters from API:', error);
          newLetters = generateLetters(difficulty);
        }
      } else {
        newLetters = generateLetters(difficulty);
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
      const newLetters = generateLetters(difficulty);
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

  // Use local dictionary only mode
  const useLocalMode = () => {
    setApiUrl('');
    setMessage('Using local dictionary mode - no server connection needed');
  };

  // Submit score to the leaderboard
  const submitScore = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username to submit your score');
      return;
    }

    try {
      setLoading(true);
      const scoreData = {
        username: username.trim(),
        score,
        wordsFound: usedWords,
        gameMode: 'classic'
      };

      if (apiUrl) {
        const response = await gameService.submitScore(scoreData);
        if (response && response.success) {
          setScoreSubmitted(true);
          setMessage('Score submitted successfully!');
        } else {
          setMessage('Failed to submit score. Please try again.');
        }
      } else {
        // Mock submission for offline mode
        setTimeout(() => {
          setScoreSubmitted(true);
          setMessage('Score submitted successfully!');
        }, 500);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setMessage('Error submitting score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset game state for a new game
  const resetGame = () => {
    setScoreSubmitted(false);
    setUsername('');
    startGame();
  };

  // Handle keyboard input for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActive) return;

      // Submit word with Enter key
      if (e.key === 'Enter') {
        submitWord();
        return;
      }

      // Clear selection with Escape key
      if (e.key === 'Escape') {
        clearSelection();
        return;
      }

      // Find the letter in the available letters
      const key = e.key.toLowerCase();
      const letterIndex = letters.findIndex((letter, index) =>
        letter.toLowerCase() === key && !isLetterSelected(index)
      );

      if (letterIndex !== -1) {
        selectLetter(letters[letterIndex], letterIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive, letters, selectedLetters]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100 min-h-screen">
      <Head>
        <title>Play Word Scramble</title>
        <meta name="description" content="Play the Word Scramble game" />
      </Head>

      <h1 className="text-4xl font-bold mb-6 text-indigo-800">Word Scramble</h1>

      {!gameActive && timer !== 60 && (
        <div className="mb-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-6 mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">Game Over!</h2>
            <div className="flex justify-center space-x-8 my-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">SCORE</p>
                <p className="text-3xl font-bold text-indigo-800">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">WORDS</p>
                <p className="text-3xl font-bold text-indigo-800">{usedWords.length}</p>
              </div>
            </div>

            {usedWords.length > 0 && (
              <div className="mt-4 mb-6">
                <p className="text-gray-600 mb-2">Your best word:</p>
                <p className="text-xl font-bold text-indigo-700">
                  {usedWords.reduce((best, word) =>
                    (calculateLocalScore(word) > calculateLocalScore(best) ? word : best), usedWords[0])}
                </p>
              </div>
            )}

            {/* Score submission section */}
            {!scoreSubmitted ? (
              <div className="mt-6">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Enter your name for the leaderboard:
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your name"
                    maxLength={20}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={submitScore}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    disabled={loading || !username.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {loading ? 'Submitting...' : 'Submit Score'}
                  </button>

                  <button
                    onClick={resetGame}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Play Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">Score submitted successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Check the leaderboard to see your ranking.</p>
                </div>

                <div className="flex space-x-3">
                  <Link href="/leaderboard" className="flex-1 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    View Leaderboard
                  </Link>

                  <button
                    onClick={resetGame}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!gameActive && timer === 60 && (
        <div className="text-center">
          {/* Game instructions */}
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6 text-left">
            <h2 className="text-xl font-bold text-indigo-700 mb-3">How to Play:</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>You'll get 8 random letters</li>
              <li>Form words using these letters</li>
              <li>Words must be at least 3 letters long</li>
              <li>Longer words earn more points!</li>
              <li>You have 60 seconds - find as many words as you can</li>
            </ol>
          </div>

          {/* Difficulty selector */}
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Select Difficulty:</p>
            <div className="flex justify-center space-x-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${difficulty === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors mb-4 animate-pulse"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Game'}
          </button>

          <div className="mb-4 flex flex-col space-y-2">
            <button
              onClick={useLocalMode}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg"
            >
              Play Offline (Local Dictionary)
            </button>

            <Link href="/leaderboard" className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              View Leaderboard
            </Link>
          </div>
        </div>
      )}

      {gameActive && (
        <>
          <div className="flex justify-between w-full max-w-md mb-4 bg-indigo-800 text-white p-3 rounded-lg shadow-md">
            <div className="text-lg font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{timer}s</span>
            </div>
            <div className="text-lg font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>{score}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6">
            {/* Display the selected letters */}
            <div className="bg-indigo-50 p-4 rounded-lg min-h-16 flex items-center justify-center mb-6 border-2 border-indigo-100">
              {selectedLetters.length > 0 ? (
                <p className="text-3xl font-bold tracking-wider text-indigo-800">
                  {selectedLetters.map(item => item.letter.toUpperCase()).join('')}
                </p>
              ) : (
                <p className="text-gray-500">Select letters to form a word</p>
              )}
            </div>

            {/* Display the letters user can choose from */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {letters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => selectLetter(letter, index)}
                  disabled={isLetterSelected(index) || loading}
                  className={`w-16 h-16 text-2xl font-bold rounded-lg transform transition-all duration-150 ${
                    isLetterSelected(index)
                      ? 'bg-gray-300 text-gray-500 scale-90'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 shadow-md'
                  }`}
                >
                  {letter.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={clearSelection}
                disabled={loading || selectedLetters.length === 0}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  selectedLetters.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Clear
              </button>
              <button
                onClick={submitWord}
                disabled={loading || selectedLetters.length < 3}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  selectedLetters.length < 3
                    ? 'bg-green-300 text-green-100 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {loading ? 'Checking...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Message area - with animation */}
          <div className="h-12 mb-4">
            {message && (
              <div className="text-center py-2 px-4 rounded-lg shadow-md bg-white text-indigo-800 mb-6 transform transition-all duration-300 animate-bounce">
                {message}
              </div>
            )}
          </div>

          {/* List of found words */}
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-indigo-700">Words Found: {usedWords.length}</h3>
              {usedWords.length > 0 && (
                <div className="text-sm text-gray-500">
                  Best word: {usedWords.reduce((best, word) =>
                    (calculateLocalScore(word) > calculateLocalScore(best) ? word : best), usedWords[0])}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
              {usedWords.length > 0 ? (
                usedWords.map((word, index) => {
                  const wordScore = calculateLocalScore(word);
                  let scoreClass = 'bg-indigo-100 text-indigo-800';
                  if (wordScore >= 10) scoreClass = 'bg-purple-200 text-purple-800';
                  if (wordScore >= 15) scoreClass = 'bg-pink-200 text-pink-800';

                  return (
                    <span key={index}
                      className={`${scoreClass} px-2 py-1 rounded-lg flex items-center`}
                      title={`${wordScore} points`}
                    >
                      {word}
                      <span className="ml-1 text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center">
                        {wordScore}
                      </span>
                    </span>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center w-full py-4">No words found yet.</p>
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
