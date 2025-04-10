# Word Scramble Game Frontend

This is the frontend for the Word Scramble Game, built with Next.js, React, and Tailwind CSS.

## Features

- Modern, responsive UI with dark mode support
- Animations and transitions for enhanced user experience
- Offline mode with fallback mechanisms
- Toast notifications for game events
- Confetti celebrations for high-scoring words
- Leaderboard for tracking high scores
- Multiple board sizes (10, 15, 25 letters)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd apps/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
5. Update the `.env.local` file with your configuration
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `NEXT_PUBLIC_API_URL` - URL of the backend API
- `NEXT_PUBLIC_USE_API_ROUTES` - Set to `true` to use Next.js API routes instead of direct backend calls

## Project Structure

```
frontend/
├── components/       # Reusable UI components
│   ├── Layout.js     # Main layout with dark mode support
│   ├── Confetti.js   # Celebration effects
│   ├── Toast.js      # Individual toast notification
│   └── ToastProvider.js # Toast notification system
├── hooks/            # Custom React hooks
│   └── useWindowSize.js # Window dimensions hook
├── pages/            # Next.js pages
│   ├── _app.js       # App wrapper with providers
│   ├── _document.js  # Custom document with dark mode init
│   ├── index.js      # Home page
│   ├── game.js       # Game page
│   └── leaderboard.js # Leaderboard page
├── services/         # API services
│   └── api.js        # API client with fallbacks
├── styles/           # Global styles and Tailwind config
└── public/           # Static assets
```

## Game Rules

1. You'll receive a set of random letters (10, 15, or 25)
2. Create as many valid words as possible within 60 seconds
3. Each letter is worth 1 point
4. Longer words earn bonus points:
   - 4+ letters: (length - 3) × 2 bonus points
   - 6+ letters: additional 5 bonus points
   - 8+ letters: additional 10 bonus points
5. Each word can only be used once
6. All words must be legitimate English words
7. High-scoring words trigger confetti celebrations
8. Submit your score to the leaderboard when the game ends

## Special Features

### Dark Mode

The game uses dark mode by default for a more comfortable gaming experience, especially in low-light environments. A toggle in the header allows switching between dark and light modes. The preference is saved in localStorage for future visits.

### Offline Support

The game includes fallback mechanisms to work even when the backend API is not available:

- Local word validation when the API is unreachable
- Sample leaderboard data when online leaderboard cannot be fetched
- Offline score submission that provides feedback even without a server connection

## Deployment

The frontend is designed to be deployed to any static site hosting platform, such as Vercel, Netlify, or GitHub Pages.

## License

This project is licensed under the MIT License.
