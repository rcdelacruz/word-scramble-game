// Local dictionary utility for word validation
// This is a simplified version that doesn't require API calls

// Create a Set with common English words for fast lookups
const dictionary = new Set([
  // Common 3-letter words
  'act', 'add', 'age', 'ago', 'aid', 'aim', 'air', 'all', 'and', 'any', 'arm', 'art', 'ask',
  'bad', 'bag', 'ban', 'bar', 'bat', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bit', 'bob',
  'box', 'boy', 'bug', 'bun', 'bus', 'but', 'buy', 'cab', 'can', 'cap', 'car', 'cat', 'cob',
  'cod', 'cog', 'con', 'cop', 'cow', 'cry', 'cub', 'cup', 'cut', 'dad', 'dam', 'day', 'den',
  'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'dot', 'dry', 'dub', 'due', 'dug', 'dye',
  'ear', 'eat', 'egg', 'ego', 'elf', 'elk', 'elm', 'end', 'era', 'eye', 'fan', 'far', 'fat',
  'fax', 'fee', 'few', 'fig', 'fin', 'fir', 'fit', 'fix', 'fly', 'foe', 'fog', 'for', 'fox',
  'fry', 'fun', 'fur', 'gag', 'gap', 'gas', 'gel', 'gem', 'get', 'gig', 'gin', 'god', 'got',
  'gum', 'gun', 'gut', 'guy', 'gym', 'had', 'hag', 'ham', 'has', 'hat', 'hay', 'hem', 'hen',
  'her', 'hey', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hop', 'hot', 'how', 'hub', 'hue',
  'hug', 'huh', 'hum', 'hut', 'ice', 'icy', 'ill', 'ink', 'inn', 'ion', 'its', 'ivy', 'jab',
  'jam', 'jar', 'jaw', 'jay', 'jet', 'jew', 'job', 'jog', 'jot', 'joy', 'jug', 'jut', 'keg',
  'key', 'kid', 'kin', 'kit', 'lab', 'lad', 'lag', 'lam', 'lap', 'law', 'lay', 'led', 'leg',
  'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low', 'lug', 'lye', 'mad', 'mag', 'man',
  'map', 'mar', 'mat', 'may', 'men', 'met', 'mid', 'mix', 'mob', 'mod', 'mom', 'mop', 'mow',
  'mud', 'mug', 'mum', 'nag', 'nap', 'nay', 'net', 'new', 'nib', 'nil', 'nip', 'nit', 'nod',
  'nor', 'not', 'now', 'nun', 'nut', 'oak', 'odd', 'off', 'oft', 'oil', 'old', 'one', 'orb',
  'ore', 'our', 'out', 'owe', 'owl', 'own', 'pad', 'pal', 'pan', 'pap', 'par', 'pat', 'paw',
  'pay', 'pea', 'peg', 'pen', 'pep', 'per', 'pet', 'pew', 'pie', 'pig', 'pin', 'pip', 'pit',
  'ply', 'pod', 'pop', 'pot', 'pow', 'pry', 'pub', 'pug', 'pun', 'pup', 'put', 'rad', 'rag',
  'raj', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'rib', 'rid', 'rig', 'rim', 'rip',
  'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rut', 'rye', 'sad', 'sag', 'sal',
  'sap', 'sat', 'saw', 'say', 'sea', 'see', 'set', 'sew', 'she', 'shy', 'sic', 'sip', 'sir',
  'sis', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'sod', 'son', 'sow', 'spa', 'spy', 'stb',
  'sub', 'sue', 'sum', 'sun', 'sup', 'tab', 'tad', 'tag', 'tam', 'tan', 'tap', 'tar', 'tat',
  'tax', 'tea', 'tee', 'ten', 'the', 'thy', 'tic', 'tie', 'til', 'tin', 'tip', 'toe', 'tog',
  'tom', 'ton', 'too', 'top', 'tow', 'toy', 'try', 'tub', 'tug', 'tut', 'two', 'ugh', 'uke',
  'ump', 'urn', 'use', 'van', 'vat', 'vee', 'vet', 'vex', 'via', 'vie', 'vow', 'wad', 'wag',
  'wan', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wee', 'wet', 'who', 'why', 'wig', 'win',
  'wit', 'woe', 'wok', 'won', 'woo', 'wow', 'wry', 'yak', 'yam', 'yap', 'yaw', 'yay', 'yea',
  'yen', 'yes', 'yet', 'yew', 'yip', 'yod', 'yog', 'yok', 'yon', 'you', 'yow', 'yuk', 'yum',
  'yup', 'zag', 'zap', 'zen', 'zig', 'zip', 'zit', 'zoo',
  
  // Common 4-letter words
  'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'back', 'ball', 'band',
  'bank', 'base', 'bath', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'best', 'bill',
  'bird', 'blow', 'blue', 'boat', 'body', 'bomb', 'bond', 'bone', 'book', 'boom', 'born',
  'boss', 'both', 'bowl', 'bulk', 'burn', 'bush', 'busy', 'call', 'calm', 'came', 'camp',
  'card', 'care', 'case', 'cash', 'cast', 'cell', 'chat', 'chip', 'city', 'club', 'coal',
  'coat', 'code', 'cold', 'come', 'cook', 'cool', 'cope', 'copy', 'core', 'cost', 'crew',
  'crop', 'dark', 'data', 'date', 'dawn', 'days', 'dead', 'deal', 'dean', 'dear', 'debt',
  'deep', 'deny', 'desk', 'dial', 'diet', 'dirt', 'disc', 'disk', 'does', 'done', 'door',
  'dose', 'down', 'draw', 'drew', 'drop', 'drug', 'dual', 'duke', 'dust', 'duty', 'each',
  'earn', 'ease', 'east', 'easy', 'edge', 'else', 'even', 'ever', 'evil', 'exit', 'face',
  'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet',
  'fell', 'felt', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five',
  'flat', 'flow', 'food', 'foot', 'ford', 'form', 'fort', 'four', 'free', 'from', 'fuel',
  'full', 'fund', 'gain', 'game', 'gate', 'gave', 'gear', 'gene', 'gift', 'girl', 'give',
  'glad', 'goal', 'goes', 'gold', 'golf', 'gone', 'good', 'gray', 'grew', 'grey', 'grow',
  'gulf', 'hair', 'half', 'hall', 'hand', 'hang', 'hard', 'harm', 'hate', 'have', 'head',
  'hear', 'heat', 'held', 'hell', 'help', 'here', 'hero', 'high', 'hill', 'hire', 'hold',
  'hole', 'holy', 'home', 'hope', 'host', 'hour', 'huge', 'hung', 'hunt', 'hurt', 'idea',
  'inch', 'into', 'iron', 'item', 'jack', 'jane', 'jean', 'john', 'join', 'jump', 'jury',
  'just', 'keen', 'keep', 'kent', 'kept', 'kick', 'kill', 'kind', 'king', 'knee', 'knew',
  'know', 'lack', 'lady', 'laid', 'lake', 'land', 'lane', 'last', 'late', 'lead', 'left',
  'less', 'life', 'lift', 'like', 'line', 'link', 'list', 'live', 'load', 'loan', 'lock',
  'logo', 'long', 'look', 'lord', 'lose', 'loss', 'lost', 'love', 'luck', 'made', 'mail',
  'main', 'make', 'male', 'many', 'mark', 'mass', 'matt', 'meal', 'mean', 'meat', 'meet',
  'menu', 'mere', 'mike', 'mile', 'milk', 'mill', 'mind', 'mine', 'miss', 'mode', 'mood',
  'moon', 'more', 'most', 'move', 'much', 'must', 'name', 'navy', 'near', 'neck', 'need',
  'news', 'next', 'nice', 'nick', 'nine', 'none', 'nose', 'note', 'okay', 'once', 'only',
  'onto', 'open', 'oral', 'over', 'pace', 'pack', 'page', 'paid', 'pain', 'pair', 'palm',
  'park', 'part', 'pass', 'past', 'path', 'peak', 'pick', 'pink', 'pipe', 'plan', 'play',
  'plot', 'plug', 'plus', 'poll', 'pool', 'poor', 'port', 'post', 'pull', 'pure', 'push',
  'race', 'rail', 'rain', 'rank', 'rare', 'rate', 'read', 'real', 'rear', 'rely', 'rent',
  'rest', 'rice', 'rich', 'ride', 'ring', 'rise', 'risk', 'road', 'rock', 'role', 'roll',
  'roof', 'room', 'root', 'rose', 'rule', 'rush', 'ruth', 'safe', 'said', 'sake', 'sale',
  'salt', 'same', 'sand', 'save', 'seat', 'seed', 'seek', 'seem', 'seen', 'self', 'sell',
  'send', 'sent', 'sept', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side', 'sign',
  'site', 'size', 'skin', 'slip', 'slow', 'snow', 'soft', 'soil', 'sold', 'sole', 'some',
  'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay', 'step', 'stop', 'such', 'suit',
  'sure', 'take', 'tale', 'talk', 'tall', 'tank', 'tape', 'task', 'team', 'tech', 'tell',
  'tend', 'term', 'test', 'text', 'than', 'that', 'them', 'then', 'they', 'thin', 'this',
  'thus', 'till', 'time', 'tiny', 'told', 'toll', 'tone', 'tony', 'took', 'tool', 'tour',
  'town', 'tree', 'trip', 'true', 'tune', 'turn', 'twin', 'type', 'ugly', 'unit', 'upon',
  'used', 'user', 'vary', 'vast', 'very', 'vice', 'view', 'vote', 'wage', 'wait', 'wake',
  'walk', 'wall', 'want', 'ward', 'warm', 'wash', 'wave', 'ways', 'weak', 'wear', 'week',
  'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild', 'will',
  'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word', 'wore', 'work',
  'yard', 'yeah', 'year', 'your', 'zero', 'zone',
  
  // Common 5-letter words
  'about', 'above', 'abuse', 'actor', 'adapt', 'added', 'admit', 'adopt', 'after', 'again',
  'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone', 'along',
  'alter', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena', 'argue',
  'arise', 'array', 'aside', 'asset', 'avoid', 'award', 'aware', 'awful', 'badly', 'basic',
  'basis', 'beach', 'began', 'begin', 'begun', 'being', 'below', 'bench', 'billy', 'birth',
  'black', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind', 'block', 'blood', 'board',
  'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brief', 'bring',
  'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch',
  'cause', 'chain', 'chair', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child',
  'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear', 'click', 'clock', 'close',
  'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft', 'crash', 'cream', 'crime',
  'cross', 'crowd', 'crown', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death',
  'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drawn', 'dream',
  'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager', 'early', 'earth', 'eight',
  'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every',
  'exact', 'exist', 'extra', 'faith', 'false', 'fault', 'fiber', 'field', 'fifth', 'fifty',
  'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force',
  'forth', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit',
  'fully', 'funny', 'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand',
  'grant', 'grass', 'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest',
  'guide', 'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house',
  'human', 'ideal', 'image', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint',
  'jones', 'judge', 'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn',
  'lease', 'least', 'leave', 'legal', 'level', 'lewis', 'light', 'limit', 'links', 'lives',
  'local', 'logic', 'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker',
  'march', 'maria', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor',
  'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth',
  'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel',
  'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought', 'paint', 'panel',
  'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo', 'piece', 'pilot', 'pitch',
  'place', 'plain', 'plane', 'plant', 'plate', 'point', 'pound', 'power', 'press', 'price',
  'pride', 'prime', 'print', 'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick',
  'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'refer',
  'right', 'rival', 'river', 'robin', 'roger', 'roman', 'rough', 'round', 'route', 'royal',
  'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape',
  'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shirt', 'shock', 'shoot', 'short',
  'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide', 'small',
  'smart', 'smile', 'smith', 'smoke', 'solid', 'solve', 'sorry', 'sound', 'south', 'space',
  'spare', 'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage',
  'stake', 'stand', 'start', 'state', 'steam', 'steel', 'stick', 'still', 'stock', 'stone',
  'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar',
  'suite', 'super', 'sweet', 'table', 'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry',
  'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think',
  'third', 'those', 'three', 'threw', 'throw', 'tight', 'times', 'tired', 'title', 'today',
  'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train', 'treat', 'trend',
  'trial', 'tried', 'tries', 'truck', 'truly', 'trust', 'truth', 'twice', 'under', 'undue',
  'union', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value',
  'video', 'virus', 'visit', 'vital', 'voice', 'waste', 'watch', 'water', 'wheel', 'where',
  'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worry', 'worse',
  'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'youth'
]);

// Function to check if a word is valid
export const isValidWord = (word) => {
  if (!word || typeof word !== 'string') return false;
  return dictionary.has(word.toLowerCase());
};

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
  const wordLower = word.toLowerCase();
  
  // Check if word is at least 3 letters
  if (wordLower.length < 3) {
    return {
      isValid: false,
      reason: 'Word is too short (minimum 3 letters)'
    };
  }
  
  // Check if word can be formed from letters
  if (!canFormWord(wordLower, letters)) {
    return {
      isValid: false,
      reason: 'Word cannot be formed from the available letters'
    };
  }
  
  // Check if word is in dictionary
  if (!isValidWord(wordLower)) {
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
  dictionary
};
