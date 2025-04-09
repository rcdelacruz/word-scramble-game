# Word Scramble Game

A fun word game built with Next.js and Node.js.

This project features a simple but engaging word game where players create words from a set of random letters. The game is accessible to everyone but offers enough challenge to keep it interesting.

## Features

- Single-player word formation gameplay
- Timed challenges (60 seconds per round)
- Points system that rewards longer words
- Comprehensive English word dictionary
- Leaderboard to track high scores
- User accounts to save progress
- Simple, intuitive interface

## Technologies Used

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Comprehensive English dictionary (~370,000 words)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/word-scramble-game.git
cd word-scramble-game
```

2. Set up environment variables:
```bash
# Copy example env file
cp .env.example .env
# Edit the .env file with your configuration
```

3. Install backend dependencies:
```bash
cd backend
npm install
```
> Note: This will automatically download and process the English dictionary file.

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Dictionary

The game uses a comprehensive English dictionary to validate words. During installation:

- The setup script will automatically download an English dictionary from GitHub repositories.
- It filters out non-alphabetic words and those shorter than 3 letters.
- If the download fails, a fallback mini-dictionary is created with common words.
- You can manually trigger a dictionary update by running `npm run fetch-dictionary` in the backend folder.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a separate terminal, start the frontend:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Game Rules

1. You'll receive 8 random letters
2. Create as many valid words as possible within 60 seconds
3. Each letter is worth 1 point
4. Longer words (4+ letters) earn bonus points
5. Each word can only be used once
6. All words must be legitimate English words

## Project Structure

- `/frontend` - Next.js client application
- `/backend` - Node.js/Express API server
  - `/backend/data` - Contains the dictionary file
  - `/backend/scripts` - Utility scripts including dictionary downloader

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dictionary data sourced from [english-words](https://github.com/dwyl/english-words) and [google-10000-english](https://github.com/first20hours/google-10000-english)
- Inspiration from games like Scrabble and Word Cookies