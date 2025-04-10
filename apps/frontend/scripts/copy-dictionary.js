/**
 * Script to copy the dictionary file from the backend to the frontend public directory
 * This makes it directly accessible to the PWA without having to go through the API
 */

const fs = require('fs');
const path = require('path');

// Possible source paths for the dictionary file
const possibleSourcePaths = [
  // Path from frontend scripts directory
  path.join(__dirname, '..', '..', 'backend', 'data', 'dictionary.txt'),
  // Absolute path from project root
  path.join(__dirname, '..', '..', '..', 'backend', 'data', 'dictionary.txt'),
  // Direct path from project root
  path.join(__dirname, '..', '..', 'apps', 'backend', 'data', 'dictionary.txt'),
  // Path from monorepo structure
  path.join(__dirname, '..', '..', '..', 'apps', 'backend', 'data', 'dictionary.txt')
];

// Destination path in the frontend public directory
const destPath = path.join(__dirname, '..', 'public', 'dictionary.txt');

// Try each path until we find the dictionary file
let sourcePath = null;
for (const testPath of possibleSourcePaths) {
  console.log('Trying path:', testPath);
  if (fs.existsSync(testPath)) {
    sourcePath = testPath;
    console.log('Dictionary found at:', sourcePath);
    break;
  }
}

if (!sourcePath) {
  console.error('Dictionary file not found. Please run the fetchDictionary.js script in the backend to generate it.');
  process.exit(1);
}

// Copy the dictionary file to the frontend public directory
try {
  // Read the dictionary file
  const content = fs.readFileSync(sourcePath, 'utf8');

  // Process the dictionary (filter out invalid words)
  const words = content
    .toLowerCase()
    .split(/\r?\n/)
    .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

  // Write the processed dictionary to the destination
  fs.writeFileSync(destPath, words.join('\n'), 'utf8');

  console.log(`Dictionary copied to ${destPath} with ${words.length} words`);
} catch (error) {
  console.error('Error copying dictionary:', error);
  process.exit(1);
}
