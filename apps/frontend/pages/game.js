import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Game() {
  const [letters, setLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [gameActive, setGameActive] = useState(false);

  // Simple dictionary for word validation (in a real app we'd use the API)
  const dictionary = new Set([
    'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'chat', 'that', 
    'flat', 'brat', 'spat', 'stat', 'scat', 'splat', 'combat',
    'dog', 'log', 'fog', 'bog', 'cog', 'jog', 'frog', 'smog', 'blog',
    'word', 'game', 'play', 'time', 'fun', 'high', 'score', 'level'
  ]);

  // Generate random letters
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

  // Start a new game
  const startGame = () => {
    setLetters(generateLetters());
    setSelectedLetters([]);
    setScore(0);
    setMessage('');
    setUsedWords([]);
    setTimer(60);
    setGameActive(true);
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
  const submitWord = () => {
    if (!gameActive || selectedLetters.length === 0) return;
    
    const word = selectedLetters.map(item => item.letter).join('');
    
    // Check if word exists and hasn't been used yet
    if (dictionary.has(word) && !usedWords.includes(word)) {
      // Calculate score - 1 point per letter, bonus for longer words
      let wordScore = word.length;
      if (word.length > 3) wordScore += (word.length - 3) * 2;
      
      setScore(score + wordScore);
      setUsedWords([...usedWords, word]);
      setMessage(`Nice! +${wordScore} points.`);
      
      // Reset selected letters but keep the same available letters
      setSelectedLetters([]);
    } else if (usedWords.includes(word)) {
      setMessage('You already used that word!');
    } else {
      setMessage('Not a valid word.');
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
          >
            Play Again
          </button>
        </div>
      )}
      
      {!gameActive && timer === 60 && (
        <button 
          onClick={startGame}
          className="px-8 py-3 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Start Game
        </button>
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
                  disabled={isLetterSelected(index)}
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
                className="flex-1 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={submitWord}
                className="flex-1 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors"
              >
                Submit
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