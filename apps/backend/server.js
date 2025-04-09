const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables with priority for custom .env file
const envPath = path.resolve(process.cwd(), '.env');
const defaultEnvPath = path.resolve(__dirname, '.env');

// Try to load from current working directory first (for monorepo setup),
// then from the backend directory directly
if (fs.existsSync(envPath)) {
  console.log(`Loading .env file from: ${envPath}`);
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(defaultEnvPath)) {
  console.log(`Loading .env file from: ${defaultEnvPath}`);
  require('dotenv').config({ path: defaultEnvPath });
} else {
  console.log('No .env file found, using default environment variables');
  require('dotenv').config();
}

// Import routes
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    envFiles: {
      rootEnvExists: fs.existsSync(envPath),
      backendEnvExists: fs.existsSync(defaultEnvPath)
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});