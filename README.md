# Word Scramble Game

A fun word game built with Next.js and Node.js, organized as a Turborepo monorepo.

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

- **Monorepo**: Turborepo for efficient builds and dependency management
- **TypeScript**: Full type safety across the entire codebase
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Shared Code**: Common types and utilities shared between frontend and backend

## Project Structure

```
word-scramble-game/
├── apps/
│   ├── backend/         # Express API server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── scripts/   # Dictionary downloader
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── frontend/        # Next.js web application
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── package.json
│
├── packages/
│   └── shared/          # Shared types, constants, and utilities
│       ├── src/
│       └── package.json
│
├── package.json         # Root package.json for the monorepo
└── turbo.json           # Turborepo configuration
```

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

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example env file to backend
cp .env.example apps/backend/.env
# Copy example env file to frontend
cp .env.example apps/frontend/.env
# Edit the .env files with your configuration
```

### Dictionary

The game uses a comprehensive English dictionary to validate words. During installation:

- The setup script will automatically download an English dictionary from GitHub repositories.
- It filters out non-alphabetic words and those shorter than 3 letters.
- If the download fails, a fallback mini-dictionary is created with common words.
- You can manually trigger a dictionary update by running `npm run fetch-dictionary` in the backend app folder.

### Running the Application

```bash
# Run both frontend and backend simultaneously
npm run dev

# Run only the frontend
npm run dev --filter=frontend

# Run only the backend
npm run dev --filter=backend
```

### Building for Production

```bash
# Build all packages and apps
npm run build
```

## Game Rules

1. You'll receive 8 random letters
2. Create as many valid words as possible within 60 seconds
3. Each letter is worth 1 point
4. Longer words (4+ letters) earn bonus points
5. Each word can only be used once
6. All words must be legitimate English words

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Dictionary data sourced from [english-words](https://github.com/dwyl/english-words) and [google-10000-english](https://github.com/first20hours/google-10000-english)
- Inspiration from games like Scrabble and Word Cookies