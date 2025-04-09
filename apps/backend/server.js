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

// Middleware
app.use(cors());
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