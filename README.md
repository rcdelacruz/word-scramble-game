# Word Scramble Game

A modern, engaging word game built with Next.js and Node.js, organized as a Turborepo monorepo.

This project features a beautifully designed word game where players create words from a set of random letters. With its sleek dark mode interface, smooth animations, and responsive design, the game provides an immersive experience across all devices. It's accessible to everyone while offering enough challenge to keep it interesting, with features like confetti celebrations for high-scoring words and a competitive leaderboard system.

## Features

- Single-player word formation gameplay
- Timed challenges (60 seconds per round)
- Points system that rewards longer words
- Comprehensive English word dictionary
- Leaderboard to track high scores
- User accounts to save progress
- Modern, intuitive interface with animations
- Dark mode by default (with light mode toggle)
- Responsive design for all devices
- Local dictionary for fast word validation
- Confetti celebrations for high-scoring words
- Toast notifications for game events
- Progressive Web App (PWA) support for offline play
- Installable on mobile and desktop devices

## Technologies Used

- **Monorepo**: Turborepo for efficient builds and dependency management
- **TypeScript**: Full type safety across the entire codebase
- **Frontend**:
  - Next.js and React for the UI framework
  - Tailwind CSS for styling with dark mode support
  - Framer Motion for smooth animations and transitions
  - React Confetti for celebration effects
  - Custom toast notification system
  - Progressive Web App (PWA) capabilities with service worker
  - IndexedDB for client-side dictionary caching
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Shared Code**: Common types and utilities shared between frontend and backend
- **Deployment**: Vercel-ready configuration with API fallbacks

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
│       ├── components/  # Reusable UI components
│       │   ├── Layout.js       # Main layout with dark mode support
│       │   ├── Confetti.js     # Celebration effects
│       │   ├── Toast.js        # Individual toast notification
│       │   └── ToastProvider.js # Toast notification system
│       ├── hooks/      # Custom React hooks
│       │   └── useWindowSize.js # Window dimensions hook
│       ├── pages/      # Next.js pages
│       │   ├── _app.js         # App wrapper with providers
│       │   ├── _document.js    # Custom document with dark mode init
│       │   ├── index.js        # Home page
│       │   ├── game.js         # Game page
│       │   └── leaderboard.js  # Leaderboard page
│       ├── services/   # API services
│       │   └── api.js          # API client with fallbacks
│       ├── styles/     # Global styles and Tailwind config
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

1. You'll receive a set of random letters (configurable: 10, 15, or 25 letters)
2. Create as many valid words as possible within 60 seconds
3. Each letter is worth 1 point
4. Longer words earn bonus points:
   - 4+ letters: (length - 3) × 2 bonus points
   - 6+ letters: additional 5 bonus points
   - 8+ letters: additional 10 bonus points
5. Each word can only be used once
6. All words must be legitimate English words
7. High-scoring words (5+ points) trigger confetti celebrations
8. Submit your score to the leaderboard when the game ends

## Special Features

### Dark Mode

The game uses dark mode by default for a more comfortable gaming experience, especially in low-light environments. A toggle in the header allows switching between dark and light modes. The preference is saved in localStorage for future visits.

### Local Dictionary

The game uses a local dictionary for word validation, making it fast and reliable:

- Efficient word validation using an in-memory dictionary
- Quick response times for word checking
- No dependency on external APIs for core gameplay
- Client-side caching with IndexedDB for offline use
- Automatic dictionary updates during build process

This ensures players can enjoy a smooth and responsive gaming experience, even offline.

### Progressive Web App (PWA)

The game is implemented as a Progressive Web App, providing several benefits:

- **Offline Play**: Play the game without an internet connection
- **Installable**: Add to home screen on mobile or desktop
- **Fast Loading**: Cached assets for quick startup
- **Local Dictionary**: No need for API calls to validate words
- **Automatic Updates**: Service worker manages updates seamlessly

To install the PWA:
1. Visit the game in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the "Add to Home Screen" or "Install" option in the browser menu
3. Follow the prompts to install the app

### Updating the Dictionary

The dictionary can be updated in several ways:

1. **Automatic Updates**: The dictionary is automatically updated during the build process
   ```bash
   npm run build
   ```

2. **Manual Updates**: You can manually update the dictionary
   ```bash
   # In the frontend directory
   npm run update-dictionary

   # Or from the project root
   npm run update-dictionary --filter=frontend
   ```

3. **Force Copy**: You can force copy the dictionary from backend to frontend
   ```bash
   # In the frontend directory
   npm run copy-dictionary

   # Or from the project root
   npm run copy-dictionary --filter=frontend
   ```

When the backend dictionary is updated (e.g., by running the fetchDictionary.js script), you should update the frontend dictionary to keep them in sync.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Dictionary data sourced from [english-words](https://github.com/dwyl/english-words) and [google-10000-english](https://github.com/first20hours/google-10000-english)
- Inspiration from games like Scrabble and Word Cookies
