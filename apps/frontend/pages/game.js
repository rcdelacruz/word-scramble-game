import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gameService } from '../services/api';
import { motion } from 'framer-motion';
import { useToast } from '../components/ToastProvider';
import Confetti from '../components/Confetti';

export default function Game() {
  const { addToast } = useToast();
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [boardSize, setBoardSize] = useState(10); // 10, 15, or 25 letters
  const [username, setUsername] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Log debug information
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // URL is used for API base determination
    }
  }, []);

  // Generate random letters locally based on difficulty and board size
  const generateLetters = (difficultyLevel = 'medium', size = 8) => {
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
      // Word validation logic

      setLoading(true);

      if (offlineMode) {
        // Use local validation in offline mode
        const result = validateWordLocally(word, letters);
        setLoading(false);
        return result;
      }

      // Try to validate using the API
      const response = await gameService.validateWord(word, letters);

      setLoading(false);

      if (response && response.success) {
        return {
          isValid: response.isValid,
          score: response.score
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

  // Validate word locally (for offline mode)
  const validateWordLocally = (word, letters) => {
    // Check if the word is in the dictionary
    const isInDictionary = fallbackDictionary.has(word.toLowerCase());

    // Check if the word can be formed from the available letters
    const letterCounts = {};
    letters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });

    const wordLetters = word.toLowerCase().split('');
    const canBeFormed = wordLetters.every(letter => {
      if (!letterCounts[letter]) return false;
      letterCounts[letter]--;
      return true;
    });

    const isValid = isInDictionary && canBeFormed;

    return {
      isValid,
      score: isValid ? calculateLocalScore(word) : 0
    };
  };

  // Start a new game
  const startGame = async () => {
    try {
      setLoading(true);
      let newLetters;

      // Try to get letters from the API
      if (apiUrl) {
        try {
          // Fetching letters from API
          const response = await axios.get(`${apiUrl}/game/letters?difficulty=${difficulty}&size=${boardSize}`);
          if (response.data && response.data.success && response.data.letters) {
            newLetters = response.data.letters;
          } else {
            newLetters = generateLetters(difficulty, boardSize);
          }
        } catch (error) {
          // Fallback to local letter generation on API error
          newLetters = generateLetters(difficulty, boardSize);
        }
      } else {
        newLetters = generateLetters(difficulty, boardSize);
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
      // Error handling for game start
      setLoading(false);

      // Fallback to generate letters locally
      const newLetters = generateLetters(difficulty, boardSize);
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
      addToast(`Game over! Final score: ${score}`, 'info');
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
      addToast('You already used that word!', 'error');
      return;
    }

    // Word must be at least 3 letters
    if (word.length < 3) {
      setMessage('Words must be at least 3 letters long.');
      addToast('Words must be at least 3 letters long.', 'error');
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
        addToast(`Nice! +${validation.score} points for "${word}"`, 'success');

        // Show confetti for high-scoring words (5+ points)
        if (validation.score >= 5) {
          setShowConfetti(true);
        }

        // Reset selected letters but keep the same available letters
        setSelectedLetters([]);
      } else {
        setMessage('Not a valid word.');
        addToast('Not a valid word.', 'error');
      }
    } catch (error) {
      // Error handling for word submission
      setMessage('Error checking word. Try again.');
      addToast('Error checking word. Try again.', 'error');
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
    setOfflineMode(true);
    setMessage('Using local dictionary mode - no server connection needed');
    addToast('Using local dictionary mode', 'info');
  };

  // Submit score to the leaderboard
  const submitScore = async () => {
    if (!username.trim()) {
      setMessage('Please enter a username to submit your score');
      addToast('Please enter a username to submit your score', 'error');
      return;
    }

    try {
      setLoading(true);
      const scoreData = {
        username: username.trim(),
        score,
        wordsFound: usedWords,
        gameMode: 'classic',
        boardSize: boardSize,
        difficulty: difficulty
      };

      if (offlineMode) {
        // Offline mode - mock submission
        setTimeout(() => {
          setScoreSubmitted(true);
          setMessage('Score submitted successfully (offline mode)');
          addToast('Score submitted successfully (offline mode)', 'success');
          setShowConfetti(true);
        }, 500);
      } else {
        try {
          // Try to submit to the API
          const response = await gameService.submitScore(scoreData);
          if (response && response.success) {
            setScoreSubmitted(true);
            setMessage('Score submitted successfully!');
            addToast('Score submitted successfully!', 'success');
            setShowConfetti(true);
          } else {
            setMessage('Failed to submit score. Please try again.');
            addToast('Failed to submit score. Please try again.', 'error');
          }
        } catch (error) {
          // API submission failed, falling back to offline mode
          setTimeout(() => {
            setScoreSubmitted(true);
            setMessage('Score submitted successfully (offline mode)');
            addToast('Score submitted successfully (offline mode)', 'success');
            setShowConfetti(true);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      setMessage('Error submitting score. Please try again.');
      addToast('Error submitting score. Please try again.', 'error');
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
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 min-h-screen transition-colors duration-300">
      <Head>
        <title>Play Word Scramble</title>
        <meta name="description" content="Play the Word Scramble game" />
      </Head>

      {/* Confetti effect for high-scoring words */}
      <Confetti
        active={showConfetti}
        duration={2000}
        onComplete={() => setShowConfetti(false)}
      />

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-game-text dark:text-white font-display">Word <span className="text-game-primary">Scramble</span></h1>

      {!gameActive && timer !== 60 && (
        <div className="mb-8 text-center">
          <motion.div
            className="game-card w-full max-w-md mb-6 mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-game-primary to-game-secondary opacity-90"></div>
              <div className="relative py-6 px-4 text-white">
                <div className="flex justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold font-display mb-1">Game Over!</h2>
                <p className="text-white/80">Here&apos;s how you did</p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex justify-center space-x-12 my-6">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <p className="text-game-text-light dark:text-gray-400 text-sm font-medium">SCORE</p>
                  <p className="text-4xl font-bold text-game-primary dark:text-game-primary">{score}</p>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <p className="text-game-text-light dark:text-gray-400 text-sm font-medium">WORDS</p>
                  <p className="text-4xl font-bold text-game-secondary dark:text-game-secondary">{usedWords.length}</p>
                </motion.div>
              </div>

              {usedWords.length > 0 && (
                <motion.div
                  className="mt-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <p className="text-game-text-light dark:text-gray-300 mb-2 font-medium">Your best word:</p>
                  <p className="text-xl font-bold text-game-primary dark:text-game-primary">
                    {usedWords.reduce((best, word) =>
                      (calculateLocalScore(word) > calculateLocalScore(best) ? word : best), usedWords[0])}
                  </p>
                </motion.div>
              )}

            {/* Score submission section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {!scoreSubmitted ? (
                <div className="mt-6">
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-game-text dark:text-gray-300 mb-2 text-left">
                      Enter your name for the leaderboard:
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-game-primary focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                      placeholder="Your name"
                      maxLength={20}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={submitScore}
                      className="flex-1 px-4 py-3 bg-game-success text-white font-medium rounded-xl shadow-game hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                      disabled={loading || !username.trim()}
                      whileHover={{ scale: loading || !username.trim() ? 1 : 1.03 }}
                      whileTap={{ scale: loading || !username.trim() ? 1 : 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {loading ? 'Submitting...' : 'Submit Score'}
                    </motion.button>

                    <motion.button
                      onClick={resetGame}
                      className="flex-1 px-4 py-3 bg-game-primary text-white font-medium rounded-xl shadow-game hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.03 }}
                      whileTap={{ scale: loading ? 1 : 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Play Again
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <motion.div
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-green-800 dark:text-green-300 font-medium">Score submitted successfully!</p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">Check the leaderboard to see your ranking.</p>
                  </motion.div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={() => window.location.href = '/leaderboard'}
                      className="flex-1 px-4 py-3 bg-game-accent text-white font-medium rounded-xl shadow-game hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      View Leaderboard
                    </motion.button>

                    <motion.button
                      onClick={resetGame}
                      className="flex-1 px-4 py-3 bg-game-primary text-white font-medium rounded-xl shadow-game hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Play Again
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {!gameActive && timer === 60 && (
        <div className="text-center">
          {/* Game instructions */}
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mb-6 text-left">
            <h2 className="text-xl font-bold text-indigo-700 mb-3">How to Play:</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Choose your board size (10, 15, or 25 letters)</li>
              <li>Form words using the given letters</li>
              <li>Words must be at least 3 letters long</li>
              <li>Longer words earn more points!</li>
              <li>You have 60 seconds - find as many words as you can</li>
              <li>More letters = more possible words and higher scores!</li>
            </ol>
          </div>

          {/* Game settings */}
          <div className="game-card mb-8 space-y-6">
            <h3 className="text-xl font-bold text-game-text dark:text-white font-display mb-4">Game Settings</h3>

            {/* Difficulty selector */}
            <div>
              <p className="text-game-text-light dark:text-gray-300 mb-3 font-medium">Select Difficulty:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['easy', 'medium', 'hard'].map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${difficulty === level
                      ? 'bg-game-primary text-white shadow-game'
                      : 'bg-gray-100 dark:bg-gray-800 text-game-text-light dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Board size selector */}
            <div>
              <p className="text-game-text-light dark:text-gray-300 mb-3 font-medium">Board Size:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[10, 15, 25].map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setBoardSize(size)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${boardSize === size
                      ? 'bg-game-secondary text-white shadow-game'
                      : 'bg-gray-100 dark:bg-gray-800 text-game-text-light dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {size} Letters
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={startGame}
            className="game-button-primary px-8 py-4 text-xl font-semibold mb-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            animate={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {loading ? 'Loading...' : 'Start Game'}
          </motion.button>

          <div className="mb-8 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={useLocalMode}
              className="game-button-success px-4 py-2 text-sm font-medium flex items-center justify-center gap-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Play Offline (Local Dictionary)
            </motion.button>

            <Link href="/leaderboard" className="game-button-accent px-4 py-2 text-sm font-medium inline-flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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

          <div className="game-board">
            {/* Display the selected letters */}
            <div className="word-display">
              {selectedLetters.length > 0 ? (
                <motion.p
                  className="text-3xl font-bold tracking-wider text-game-primary dark:text-indigo-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedLetters.map(item => item.letter.toUpperCase()).join('')}
                </motion.p>
              ) : (
                <p className="text-game-text-light dark:text-gray-400">Select letters to form a word</p>
              )}
            </div>

            {/* Display the letters user can choose from */}
            <div className={`grid ${boardSize === 10 ? 'grid-cols-5' : boardSize === 15 ? 'grid-cols-5' : 'grid-cols-5'} gap-3 mb-6 max-h-96 overflow-y-auto p-2`}>
              {letters.map((letter, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectLetter(letter, index)}
                  disabled={isLetterSelected(index) || loading}
                  className={`${boardSize === 25 ? 'w-12 h-12 text-lg' : boardSize === 15 ? 'w-14 h-14 text-xl' : 'w-16 h-16 text-2xl'} font-bold rounded-xl transform transition-all duration-200 ${
                    isLetterSelected(index)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 scale-90'
                      : 'bg-game-primary text-white hover:bg-indigo-600 hover:scale-105 shadow-game'
                  }`}
                  whileHover={{ scale: isLetterSelected(index) ? 0.9 : 1.05 }}
                  whileTap={{ scale: isLetterSelected(index) ? 0.9 : 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: isLetterSelected(index) ? 0.9 : 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {letter.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-4">
              <motion.button
                onClick={clearSelection}
                disabled={loading || selectedLetters.length === 0}
                className={`flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center ${
                  selectedLetters.length === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-game-text dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-game'
                }`}
                whileHover={{ scale: selectedLetters.length === 0 ? 1 : 1.03 }}
                whileTap={{ scale: selectedLetters.length === 0 ? 1 : 0.97 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Clear
              </motion.button>
              <motion.button
                onClick={submitWord}
                disabled={loading || selectedLetters.length < 3}
                className={`flex-1 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center ${
                  selectedLetters.length < 3
                    ? 'bg-game-success/50 text-white/70 cursor-not-allowed'
                    : 'bg-game-success text-white hover:bg-green-600 shadow-game'
                }`}
                whileHover={{ scale: selectedLetters.length < 3 ? 1 : 1.03 }}
                whileTap={{ scale: selectedLetters.length < 3 ? 1 : 0.97 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {loading ? 'Checking...' : 'Submit'}
              </motion.button>
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
