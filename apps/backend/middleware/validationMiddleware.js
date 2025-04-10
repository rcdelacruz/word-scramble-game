/**
 * Validation middleware
 * Provides request validation using Joi
 */

const Joi = require('joi');
const { ApiError } = require('./errorMiddleware');

/**
 * Validates request data against a Joi schema
 * @param {Object} schema - Joi schema object with body, query, params
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    return next(new ApiError(400, errorMessage));
  }
  
  // Replace request data with validated data
  Object.assign(req, value);
  return next();
};

/**
 * Creates an object with only the specified keys
 * @param {Object} object - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with only the specified keys
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = {
  validate,
  pick,
};
