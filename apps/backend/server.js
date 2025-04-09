const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// More comprehensive .env file detection
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),                    // Root of where the command is run
  path.resolve(__dirname, '.env'),                        // Backend directory
  path.resolve(__dirname, '..', '..', '.env'),            // Project root in monorepo
  path.resolve(__dirname, '..', '.env'),                  // Apps directory
  path.resolve(process.cwd(), 'apps/backend/.env'),       // In case running from workspace root
  path.resolve(process.cwd(), '../../../.env')            // In case running from nested workspace
];

// Try to find and load a .env file
let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Found and loading .env file from: ${envPath}`);
    require('dotenv').config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('No .env file found in any expected location. Using default environment variables.');
  require('dotenv').config();
}

// Print all possible env paths that were checked (for debugging)
console.log('Checked the following paths for .env files:');
possibleEnvPaths.forEach(p => console.log(`- ${p} (${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'})`));

// Import routes
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow all origins in development mode
// In production, you would want to restrict this
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // List of allowed origins - Add Codespaces domains and localhost
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      /\.app\.github\.dev$/,  // This will match any Codespaces domain
      /\.preview\.app\.github\.dev$/  // Also match preview environments
    ];
    
    // Check if the origin is allowed
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.log(`CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware with our custom options
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());

// Log all environment variables (for debugging) - redacted for security
console.log('Environment variables loaded:');
console.log(`- PORT: ${process.env.PORT || '(not set, using default 5000)'}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '(set)' : '(not set, will use default)'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '(set)' : '(not set)'}`);

// Database connection
const connectDB = async () => {
  try {
    // Log the connection string (with password redacted for security)
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/word-scramble';
    const redactedUri = connectionString.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3');
    console.log(`Connecting to MongoDB with URI: ${redactedUri}`);
    
    await mongoose.connect(connectionString);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Word Scramble Game API is running');
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working properly!',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString()
  });
});

// Debug route to check environment variables
app.get('/debug/env', (req, res) => {
  res.json({
    port: process.env.PORT || 'Not set',
    mongoDbUri: process.env.MONGODB_URI ? 'Set (value hidden)' : 'Not set',
    nodeEnv: process.env.NODE_ENV || 'Not set',
    currentDirectory: process.cwd(),
    envFiles: possibleEnvPaths.reduce((acc, path) => {
      acc[path] = fs.existsSync(path);
      return acc;
    }, {})
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});