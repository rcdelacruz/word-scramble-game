/**
 * Swagger middleware
 * Provides API documentation using Swagger UI
 */

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Apply Swagger middleware to app
const applySwaggerMiddleware = (app) => {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Word Scramble Game API Documentation',
  }));
  
  // Serve Swagger YAML
  app.get('/api-docs.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/yaml');
    res.sendFile(path.join(__dirname, '../swagger.yaml'));
  });
  
  return app;
};

module.exports = {
  applySwaggerMiddleware,
};
