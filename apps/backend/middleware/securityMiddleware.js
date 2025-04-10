/**
 * Security middleware
 * Provides security-related middleware for the API
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Game-specific rate limiter (more permissive)
const gameLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute (1 per second)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many game requests from this IP, please try again after a minute',
});

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://word-scramble-game.vercel.app',
      'https://scramble.rcdc.me',
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply security middleware to app
const applySecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Enable CORS
  app.use(cors(corsOptions));

  // Sanitize data
  app.use(xss());
  app.use(mongoSanitize());

  // Apply rate limiting to all requests
  app.use('/api/', limiter);

  // Apply game-specific rate limiting
  app.use('/api/game/validate', gameLimiter);

  return app;
};

module.exports = {
  applySecurityMiddleware,
  limiter,
  gameLimiter,
};
