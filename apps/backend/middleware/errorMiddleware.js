/**
 * Error handling middleware
 * Provides centralized error handling for the API
 */

const logger = require('../utils/logger');

// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error converter - converts regular errors to ApiErrors
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// Error handler - sends error response
const errorHandler = (err, req, res, _next) => {
  const { statusCode, message, isOperational, stack } = err;

  // Set locals, only providing error in development
  res.locals.message = message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // Log error
  logger.error('API Error:', {
    message,
    statusCode,
    isOperational,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack }),
  });
};

// 404 error handler
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  ApiError,
  errorConverter,
  errorHandler,
  notFound,
};
