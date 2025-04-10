const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const compression = require('compression');

// Import custom middleware
const { errorConverter, errorHandler, notFound } = require('./middleware/errorMiddleware');
const { applySecurityMiddleware } = require('./middleware/securityMiddleware');
const { applySwaggerMiddleware } = require('./middleware/swaggerMiddleware');
const logger = require('./utils/logger');

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
    logger.info(`Found and loading .env file from: ${envPath}`);
    require('dotenv').config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  logger.warn('No .env file found in any expected location. Using default environment variables.');
  require('dotenv').config();
}

// Print all possible env paths that were checked (for debugging)
logger.debug('Checked the following paths for .env files:');
possibleEnvPaths.forEach(p => logger.debug(`- ${p} (${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'})`));

// Import routes
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply security middleware (includes CORS, helmet, rate limiting, etc.)
applySecurityMiddleware(app);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream: logger.stream,
  skip: (req) => req.url === '/health' || req.url === '/api/health',
}));

// Apply Swagger middleware for API documentation
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_DOCS === 'true') {
  applySwaggerMiddleware(app);
  logger.info('API documentation available at /api-docs');
}

// Log all environment variables (for debugging) - redacted for security
console.log('Environment variables loaded:');
console.log(`- PORT: ${process.env.PORT || '(not set, using default 5000)'}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? '(set)' : '(not set, will use default)'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '(set)' : '(not set)'}`);

// Database connection with improved options
const connectDB = async () => {
  try {
    // Log the connection string (with password redacted for security)
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/word-scramble';
    const redactedUri = connectionString.replace(/(mongodb:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3');
    logger.info(`Connecting to MongoDB with URI: ${redactedUri}`);

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      // Auto index creation in development, disabled in production
      autoIndex: process.env.NODE_ENV !== 'production',
      // Connection pool size
      maxPoolSize: 10,
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// API routes
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Basic root endpoint
app.get('/', (req, res) => {
  res.send('Word Scramble Game API is running');
});

// Debug routes (only available in development)
if (process.env.NODE_ENV === 'development') {
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
}

// Handle 404 errors
app.use(notFound);

// Convert errors to ApiError if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

// Create HTTP server and start listening
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (e.g., Heroku shutdown)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app; // Export for testing
