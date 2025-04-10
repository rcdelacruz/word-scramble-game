# Word Scramble Game Backend

This is the backend API for the Word Scramble Game, built with Node.js, Express, and MongoDB.

## Features

- RESTful API for game functionality
- MongoDB database for storing scores and user data
- JWT authentication for user management
- Comprehensive error handling and logging
- API documentation with Swagger
- Unit and integration tests
- Security features (rate limiting, CORS, XSS protection, etc.)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Update the `.env` file with your configuration
6. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running in development mode.

You can also view the Swagger YAML file directly at `/api-docs.yaml`.

## API Endpoints

### Game Endpoints

- `GET /api/game/letters` - Get a set of letters for a new game
- `POST /api/game/validate` - Validate a word
- `POST /api/game/score` - Submit a score
- `GET /api/game/leaderboard` - Get the leaderboard
- `DELETE /api/game/leaderboard` - Clear the leaderboard (admin only)

### User Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (requires authentication)

## Testing

Run tests with:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Deployment

The API is designed to be deployed to any Node.js hosting platform, such as Vercel, Heroku, or AWS.

### Environment Variables

The following environment variables are required for production:

- `NODE_ENV` - Set to `production`
- `PORT` - Port to run the server on
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., `1d` for one day)

## License

This project is licensed under the MIT License.
