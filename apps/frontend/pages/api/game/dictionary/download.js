/**
 * API endpoint to download the full dictionary
 * This endpoint reads the dictionary file from the backend and serves it to the client
 */

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    // Try different paths to find the dictionary file
    const possiblePaths = [
      // Path from Next.js API route
      path.join(process.cwd(), '..', 'backend', 'data', 'dictionary.txt'),
      // Absolute path from project root
      path.join(process.cwd(), '..', '..', 'backend', 'data', 'dictionary.txt'),
      // Direct path from project root
      path.join(process.cwd(), 'apps', 'backend', 'data', 'dictionary.txt'),
      // Path from monorepo structure
      path.join(process.cwd(), '..', '..', 'apps', 'backend', 'data', 'dictionary.txt')
    ];

    // Try each path until we find the dictionary file
    let dictionaryPath = null;
    for (const testPath of possiblePaths) {
      console.log('Trying path:', testPath);
      if (fs.existsSync(testPath)) {
        dictionaryPath = testPath;
        console.log('Dictionary found at:', dictionaryPath);
        break;
      }
    }

    if (!dictionaryPath) {
      // If we still can't find the dictionary, try a more direct approach
      const rootPath = path.resolve(process.cwd(), '..', '..');
      console.log('Project root path:', rootPath);

      // Search for the dictionary file in the project
      return res.status(404).json({
        success: false,
        error: 'Dictionary file not found. Please run the fetchDictionary.js script in the backend to generate it.',
        triedPaths: possiblePaths
      });
    }

    // Read the dictionary file
    const content = fs.readFileSync(dictionaryPath, 'utf8');
    const words = content
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

    console.log(`Dictionary loaded with ${words.length} words`);

    // Return the dictionary as JSON
    return res.status(200).json({
      success: true,
      words,
      timestamp: Date.now(),
      count: words.length,
      path: dictionaryPath
    });
  } catch (error) {
    console.error('Error serving dictionary:', error);

    return res.status(500).json({
      success: false,
      error: 'Error serving dictionary',
      message: error.message,
    });
  }
}
