# Contributing to Word Scramble Game

Thank you for your interest in contributing to the Word Scramble Game! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork to your local machine
3. Set up the development environment by following the instructions in the README.md
4. Create a new branch for your feature or bug fix

## Development Workflow

1. Make sure you're working on the latest version:
   ```bash
   git checkout master
   git pull upstream master
   ```

2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of the feature"
   ```

4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a pull request from your branch to the main repository

## Pull Request Process

1. Ensure your code follows the coding standards
2. Update the README.md with details of changes if applicable
3. Add tests for your changes and ensure all tests pass
4. Update the documentation if necessary
5. The pull request will be merged once it has been reviewed and approved by a maintainer

## Coding Standards

### General

- Use meaningful variable and function names
- Keep functions small and focused on a single task
- Comment your code when necessary, especially for complex logic
- Follow the DRY (Don't Repeat Yourself) principle

### JavaScript/TypeScript

- Use ES6+ features when appropriate
- Use async/await for asynchronous code
- Use destructuring when it makes the code clearer
- Prefer const over let, and avoid var
- Use JSDoc comments for functions and classes

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow the React component naming convention (PascalCase)
- Use CSS modules or styled-components for styling

### Backend

- Follow RESTful API design principles
- Use proper error handling
- Validate all input data
- Use environment variables for configuration
- Document all API endpoints

## Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Aim for high test coverage
- Test edge cases and error conditions

### Frontend Testing

```bash
cd apps/frontend
npm test
```

### Backend Testing

```bash
cd apps/backend
npm test
```

## Documentation

- Update the README.md with details of changes if applicable
- Document all API endpoints
- Add JSDoc comments to functions and classes
- Update the user documentation if necessary

Thank you for contributing to the Word Scramble Game!
