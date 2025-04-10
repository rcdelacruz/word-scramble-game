module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-undef': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  },
  globals: {
    'Set': 'readonly',
    'axios': 'readonly',
    'apiUrl': 'readonly'
  }
};
