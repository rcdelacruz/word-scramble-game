// Dictionary utility for the frontend
import fs from 'fs';
import path from 'path';

// This will be populated with words from the dictionary
let dictionaryWords = new Set();
let dictionaryLoaded = false;

// Function to load the dictionary
export const loadDictionary = async () => {
  if (dictionaryLoaded) return dictionaryWords;

  try {
    // In Next.js, we need to use the server-side file system
    // This will only work in API routes or getServerSideProps
    const dictionaryPath = path.join(process.cwd(), '..', 'backend', 'data', 'dictionary.txt');

    if (fs.existsSync(dictionaryPath)) {
      const content = fs.readFileSync(dictionaryPath, 'utf8');
      const words = content
        .toLowerCase()
        .split(/\r?\n/)
        .filter(word => word.length >= 3 && /^[a-z]+$/.test(word));

      dictionaryWords = new Set(words);
      dictionaryLoaded = true;

      console.log(`Dictionary loaded: ${dictionaryWords.size} words`);
    } else {
      console.warn('Dictionary file not found, using fallback dictionary');
      // We'll use a smaller fallback dictionary
      useFallbackDictionary();
    }
  } catch (error) {
    console.error('Error loading dictionary:', error);
    useFallbackDictionary();
  }

  return dictionaryWords;
};

// Function to check if a word is valid
export const isValidWord = (word) => {
  if (!word || typeof word !== 'string') return false;

  // If dictionary isn't loaded yet, use a more permissive check
  if (!dictionaryLoaded) {
    return word.length >= 3;
  }

  return dictionaryWords.has(word.toLowerCase());
};

// Use a fallback dictionary with common words
const useFallbackDictionary = () => {
  // Common English words
  const commonWords = [
    // Common 3-letter words
    'cat', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'chat', 'that',
    'flat', 'brat', 'spat', 'stat', 'scat', 'splat', 'combat',
    'dog', 'log', 'fog', 'bog', 'cog', 'jog', 'frog', 'smog', 'blog',
    'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'any',
    'arm', 'art', 'ask', 'bad', 'bag', 'ban', 'bar', 'bed', 'bet', 'bid',
    'big', 'bit', 'box', 'boy', 'bug', 'bus', 'but', 'buy', 'can', 'cap',
    'car', 'cop', 'cow', 'cry', 'cup', 'cut', 'dad', 'day', 'die', 'dig',
    'dim', 'dip', 'ear', 'eat', 'egg', 'end', 'eye', 'fan', 'far', 'fat',
    'fee', 'few', 'fit', 'fix', 'fly', 'for', 'fun', 'gap', 'gas', 'get',
    'god', 'gun', 'guy', 'had', 'ham', 'has', 'hat', 'her', 'hey', 'him',
    'hip', 'his', 'hit', 'hot', 'how', 'ice', 'ill', 'ink', 'its', 'job',
    'joy', 'key', 'kid', 'lab', 'lap', 'law', 'lay', 'leg', 'let', 'lie',
    'lip', 'lot', 'low', 'mad', 'man', 'map', 'may', 'men', 'met', 'mix',
    'mom', 'mud', 'net', 'new', 'nod', 'nor', 'not', 'now', 'nut', 'odd',
    'off', 'oil', 'old', 'one', 'our', 'out', 'own', 'pad', 'pan', 'pay',
    'pen', 'pet', 'pie', 'pig', 'pin', 'pit', 'pop', 'pot', 'put', 'ran',
    'rap', 'rat', 'raw', 'red', 'rid', 'rim', 'rip', 'rob', 'rod', 'row',
    'rub', 'run', 'sad', 'say', 'sea', 'see', 'set', 'she', 'shy', 'sin',
    'sir', 'sit', 'six', 'ski', 'sky', 'son', 'spy', 'sum', 'sun', 'tab',
    'tag', 'tan', 'tap', 'tax', 'tea', 'ten', 'the', 'tie', 'tin', 'tip',
    'toe', 'too', 'top', 'toy', 'try', 'two', 'use', 'van', 'war', 'was',
    'wax', 'way', 'web', 'wet', 'who', 'why', 'win', 'won', 'yes', 'yet',
    'you', 'zip', 'zoo',

    // Common 4-letter words
    'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back',
    'ball', 'band', 'bank', 'base', 'bath', 'bear', 'beat', 'been', 'beer',
    'bell', 'belt', 'best', 'bill', 'bird', 'blow', 'blue', 'boat', 'body',
    'bomb', 'bond', 'bone', 'book', 'boom', 'born', 'boss', 'both', 'bowl',
    'bulk', 'burn', 'bush', 'busy', 'call', 'calm', 'came', 'camp', 'card',
    'care', 'case', 'cash', 'cast', 'cell', 'chip', 'city', 'club', 'coal',
    'coat', 'code', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'core',
    'cost', 'crew', 'crop', 'dark', 'data', 'date', 'dawn', 'days', 'dead',
    'deal', 'dear', 'debt', 'deep', 'deny', 'desk', 'dial', 'diet', 'dirt',
    'disc', 'disk', 'does', 'done', 'door', 'dose', 'down', 'draw', 'drew',
    'drop', 'drug', 'dust', 'duty', 'each', 'earn', 'ease', 'east', 'easy',
    'edge', 'else', 'even', 'ever', 'evil', 'exit', 'face', 'fact', 'fail',
    'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet',
    'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm',
    'fish', 'five', 'flat', 'flow', 'food', 'foot', 'form', 'four', 'free',
    'from', 'fuel', 'full', 'fund', 'gain', 'game', 'gate', 'gave', 'gear',
    'gene', 'gift', 'girl', 'give', 'glad', 'goal', 'goes', 'gold', 'golf',
    'gone', 'good', 'grew', 'grow', 'hair', 'half', 'hall', 'hand', 'hang',
    'hard', 'harm', 'hate', 'have', 'head', 'hear', 'heat', 'held', 'hell',
    'help', 'here', 'hero', 'high', 'hill', 'hire', 'hold', 'hole', 'holy',
    'home', 'hope', 'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea',
    'inch', 'into', 'iron', 'item', 'join', 'jump', 'jury', 'just', 'keen',
    'keep', 'kick', 'kill', 'kind', 'king', 'knee', 'knew', 'know', 'lack',
    'lady', 'laid', 'lake', 'land', 'lane', 'last', 'late', 'lead', 'left',
    'less', 'life', 'lift', 'like', 'line', 'link', 'list', 'live', 'load',
    'loan', 'lock', 'long', 'look', 'lord', 'lose', 'loss', 'lost', 'love',
    'luck', 'made', 'mail', 'main', 'make', 'male', 'many', 'mark', 'mass',
    'meal', 'mean', 'meat', 'meet', 'menu', 'mere', 'mile', 'milk', 'mill',
    'mind', 'mine', 'miss', 'mode', 'mood', 'moon', 'more', 'most', 'move',
    'much', 'must', 'name', 'navy', 'near', 'neck', 'need', 'news', 'next',
    'nice', 'nine', 'none', 'nose', 'note', 'okay', 'once', 'only', 'onto',
    'open', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'palm',
    'park', 'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'pipe',
    'plan', 'play', 'plot', 'plug', 'plus', 'poll', 'pool', 'poor', 'port',
    'post', 'pull', 'pure', 'push', 'race', 'rail', 'rain', 'rank', 'rare',
    'rate', 'read', 'real', 'rear', 'rely', 'rent', 'rest', 'rice', 'rich',
    'ride', 'ring', 'rise', 'risk', 'road', 'rock', 'role', 'roll', 'roof',
    'room', 'root', 'rose', 'rule', 'rush', 'safe', 'said', 'sake', 'sale',
    'salt', 'same', 'sand', 'save', 'seat', 'seed', 'seek', 'seem', 'seen',
    'self', 'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut',
    'sick', 'side', 'sign', 'site', 'size', 'skin', 'slip', 'slow', 'snow',
    'soft', 'soil', 'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul',
    'spot', 'star', 'stay', 'step', 'stop', 'such', 'suit', 'sure', 'take',
    'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tell', 'tend',
    'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin',
    'this', 'thus', 'till', 'time', 'tiny', 'told', 'toll', 'tone', 'took',
    'tool', 'tour', 'town', 'tree', 'trip', 'true', 'tune', 'turn', 'twin',
    'type', 'ugly', 'unit', 'upon', 'used', 'user', 'vary', 'vast', 'very',
    'vice', 'view', 'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want',
    'ward', 'warm', 'wash', 'wave', 'ways', 'weak', 'wear', 'week', 'well',
    'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild',
    'will', 'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood',
    'word', 'wore', 'work', 'yard', 'yeah', 'year', 'your', 'zero', 'zone',

    // Common 5+ letter words
    'about', 'above', 'abuse', 'actor', 'adapt', 'added', 'admit', 'adopt',
    'after', 'again', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike',
    'alive', 'allow', 'alone', 'along', 'alter', 'among', 'anger', 'angle',
    'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array',
    'aside', 'asset', 'avoid', 'award', 'aware', 'awful', 'badly', 'basic',
    'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench',
    'birth', 'black', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind',
    'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand',
    'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke', 'brown',
    'build', 'built', 'buyer', 'cable', 'carry', 'catch', 'cause', 'chain',
    'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child',
    'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock',
    'close', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft',
    'crash', 'cream', 'crime', 'cross', 'crowd', 'crown', 'curve', 'cycle',
    'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth',
    'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream', 'dress',
    'drill', 'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth',
    'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal',
    'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false',
    'fault', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first',
    'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force', 'forth',
    'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front',
    'fruit', 'fully', 'funny', 'giant', 'given', 'glass', 'globe', 'going',
    'grace', 'grade', 'grand', 'grant', 'grass', 'great', 'green', 'gross',
    'group', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'heart',
    'heavy', 'hence', 'horse', 'hotel', 'house', 'human', 'ideal', 'image',
    'index', 'inner', 'input', 'issue', 'joint', 'judge', 'known', 'label',
    'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least',
    'leave', 'legal', 'level', 'light', 'limit', 'links', 'lives', 'local',
    'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major',
    'maker', 'march', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal',
    'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral',
    'motor', 'mount', 'mouse', 'mouth', 'movie', 'music', 'needs', 'never',
    'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur',
    'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel',
    'paper', 'party', 'peace', 'phase', 'phone', 'photo', 'piece', 'pilot',
    'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound',
    'power', 'press', 'price', 'pride', 'prime', 'print', 'prior', 'prize',
    'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio',
    'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer', 'right',
    'rival', 'river', 'rough', 'round', 'route', 'royal', 'rural', 'scale',
    'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape',
    'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock',
    'shoot', 'short', 'shown', 'sight', 'since', 'sixth', 'sixty', 'sized',
    'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smoke', 'solid',
    'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak', 'speed',
    'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake',
    'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock',
    'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study',
    'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'taken',
    'taste', 'taxes', 'teach', 'teeth', 'thank', 'theft', 'their', 'theme',
    'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three',
    'threw', 'throw', 'tight', 'times', 'tired', 'title', 'today', 'topic',
    'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat',
    'trend', 'trial', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth',
    'twice', 'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset',
    'urban', 'usage', 'usual', 'valid', 'value', 'video', 'virus', 'visit',
    'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where', 'which',
    'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry',
    'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote',
    'yield', 'young', 'youth'
  ];

  dictionaryWords = new Set(commonWords);
  dictionaryLoaded = true;

  console.log(`Fallback dictionary loaded: ${dictionaryWords.size} words`);
};

// Initialize the dictionary
if (typeof window === 'undefined') {
  // Only try to load on the server side
  loadDictionary().catch(err => {
    console.error('Failed to load dictionary:', err);
  });
}

// Function to check if a word can be formed from given letters
export const canFormWord = (word, letters) => {
  if (!word || !letters || !Array.isArray(letters)) return false;

  const letterCounts = {};
  letters.forEach(letter => {
    letterCounts[letter.toLowerCase()] = (letterCounts[letter.toLowerCase()] || 0) + 1;
  });

  const wordLetters = word.toLowerCase().split('');
  return wordLetters.every(letter => {
    if (!letterCounts[letter]) return false;
    letterCounts[letter]--;
    return true;
  });
};

// Function to validate a word (both in dictionary and can be formed)
export const validateWord = (word, letters) => {
  // Check if word is at least 3 letters
  if (!word || word.length < 3) {
    return {
      isValid: false,
      reason: 'Word is too short (minimum 3 letters)'
    };
  }

  // Check if word can be formed from letters
  if (!canFormWord(word, letters)) {
    return {
      isValid: false,
      reason: 'Word cannot be formed from the available letters'
    };
  }

  // Check if word is in dictionary
  if (!isValidWord(word)) {
    return {
      isValid: false,
      reason: 'Word is not in the dictionary'
    };
  }

  // Word is valid
  return {
    isValid: true,
    reason: 'Valid word'
  };
};

export default {
  isValidWord,
  canFormWord,
  validateWord,
  loadDictionary
};
