/**
 * Dictionary Update Script
 *
 * This script updates the frontend dictionary when the backend dictionary changes.
 * It can be run manually or as part of the build process.
 *
 * Usage:
 * - Manual: node apps/frontend/scripts/update-dictionary.js
 * - NPM script: Add to package.json: "update-dictionary": "node apps/frontend/scripts/update-dictionary.js"
 * - Build hook: Add to build script: "prebuild": "node scripts/update-dictionary.js"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths
const backendDictionaryPath = path.join(__dirname, '../../backend/data/dictionary.txt');
const frontendDictionaryPath = path.join(__dirname, '../public/dictionary.txt');
const hashFilePath = path.join(__dirname, '../public/dictionary.hash');

// Function to calculate file hash
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error calculating hash for ${filePath}:`, error);
    return null;
  }
}

// Function to save hash to file
function saveHash(hash) {
  try {
    fs.writeFileSync(hashFilePath, hash);
    console.log(`Hash saved to ${hashFilePath}`);
  } catch (error) {
    console.error(`Error saving hash to ${hashFilePath}:`, error);
  }
}

// Function to read hash from file
function readHash() {
  try {
    if (fs.existsSync(hashFilePath)) {
      return fs.readFileSync(hashFilePath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error(`Error reading hash from ${hashFilePath}:`, error);
    return null;
  }
}

// Function to copy and process dictionary
function copyDictionary() {
  try {
    // Check if backend dictionary exists
    if (!fs.existsSync(backendDictionaryPath)) {
      console.error(`Backend dictionary not found at ${backendDictionaryPath}`);
      console.error('Please run the fetchDictionary.js script in the backend first.');
      process.exit(1);
    }

    // Read the dictionary file
    const content = fs.readFileSync(backendDictionaryPath, 'utf8');

    // Process the dictionary (filter out invalid words)
    const words = content
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

    // Write the processed dictionary to the frontend
    fs.writeFileSync(frontendDictionaryPath, words.join('\n'), 'utf8');

    console.log(`Dictionary updated at ${frontendDictionaryPath} with ${words.length} words`);

    // Calculate and save new hash
    const newHash = calculateFileHash(backendDictionaryPath);
    if (newHash) {
      saveHash(newHash);
    }

    return true;
  } catch (error) {
    console.error('Error copying dictionary:', error);
    return false;
  }
}

// Main function
function main() {
  console.log('Checking if dictionary needs to be updated...');

  // Calculate current backend dictionary hash
  const currentHash = calculateFileHash(backendDictionaryPath);
  if (!currentHash) {
    console.error('Could not calculate hash for backend dictionary');
    process.exit(1);
  }

  // Read saved hash
  const savedHash = readHash();

  // Check if frontend dictionary exists
  const frontendDictionaryExists = fs.existsSync(frontendDictionaryPath);

  if (!frontendDictionaryExists || !savedHash || savedHash !== currentHash) {
    console.log('Dictionary needs to be updated');
    copyDictionary();
  } else {
    console.log('Dictionary is up to date');
  }
}

// Run the script
main();
