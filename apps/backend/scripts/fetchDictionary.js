const fs = require('fs');
const path = require('path');
const https = require('https');

// Create the data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dictionaryPath = path.join(dataDir, 'dictionary.txt');

// Sources for English word lists (we'll try them in order)
const wordListSources = [
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
  'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt'
];

console.log('Fetching dictionary file...');

// Function to download from URL
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete file on error
      reject(err);
    });
  });
}

// Process the downloaded dictionary to keep only valid words
function processDictionary(filePath) {
  console.log('Processing dictionary...');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const words = content
      .toLowerCase()
      .split(/\r?\n/)
      .filter(word => word.length >= 3 && /^[a-z]+$/.test(word))
      .sort();
    
    // Save processed dictionary back to file
    fs.writeFileSync(filePath, words.join('\n'), 'utf8');
    
    console.log(`Dictionary processed: ${words.length} valid words saved.`);
    return true;
  } catch (error) {
    console.error('Error processing dictionary:', error);
    return false;
  }
}

// Try to download from each source until one succeeds
async function fetchDictionary() {
  let success = false;
  
  for (const source of wordListSources) {
    if (success) break;
    
    try {
      console.log(`Trying to download from: ${source}`);
      await downloadFile(source, dictionaryPath);
      success = true;
      console.log('Download successful!');
    } catch (error) {
      console.error(`Error downloading from ${source}:`, error.message);
    }
  }
  
  if (success) {
    processDictionary(dictionaryPath);
  } else {
    console.error('Failed to download dictionary from any source.');
    
    // Create a minimal dictionary file if download fails
    console.log('Creating a minimal dictionary file...');
    const minimalWords = [
      'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'chat', 'that', 'flat',
      'brat', 'spat', 'stat', 'scat', 'splat', 'combat', 'dog', 'log', 'fog', 'bog',
      'cog', 'jog', 'frog', 'smog', 'blog', 'word', 'game', 'play', 'time', 'fun',
      'high', 'score', 'level', 'win', 'lose', 'ace', 'air', 'arm', 'art', 'bad',
      'bag', 'ban', 'bar', 'bed', 'bee', 'big', 'bit', 'box', 'boy', 'bug', 'bus',
      'can', 'car', 'cup', 'cut', 'day', 'ear', 'eat', 'egg', 'end', 'eye', 'far',
      'fee', 'few', 'fly', 'fox', 'get', 'god', 'guy', 'hit', 'hot', 'ice', 'job',
      'key', 'kid', 'lab', 'law', 'lay', 'let', 'lie', 'lip', 'lot', 'low', 'man',
      'map', 'mix', 'mom', 'mud', 'net', 'new', 'now', 'nut', 'odd', 'oil', 'old',
      'one', 'out', 'own', 'pay', 'pen', 'pet', 'pie', 'pig', 'pin', 'pot', 'put',
      'raw', 'red', 'rid', 'row', 'run', 'sad', 'say', 'sea', 'see', 'set', 'sex',
      'she', 'shy', 'sin', 'sit', 'six', 'sky', 'son', 'sue', 'sun', 'tax', 'tea',
      'ten', 'tie', 'tip', 'toe', 'top', 'try', 'two', 'use', 'van', 'war', 'wax',
      'way', 'web', 'wet', 'who', 'why', 'win', 'yes', 'yet', 'you', 'zoo'
    ];
    
    fs.writeFileSync(dictionaryPath, minimalWords.join('\n'), 'utf8');
    console.log(`Created minimal dictionary with ${minimalWords.length} words.`);
  }
}

// Run the script
fetchDictionary()
  .then(() => {
    console.log('Dictionary setup complete!');
  })
  .catch((error) => {
    console.error('Error setting up dictionary:', error);
  });