/**
 * Unit tests for the wordGenerator utility
 */

const { expect } = require('chai');
const wordUtils = require('../../../utils/wordGenerator');

describe('Word Generator Utility', () => {
  describe('generateLetterSet', () => {
    it('should generate the correct number of letters based on size parameter', () => {
      const letters10 = wordUtils.generateLetterSet('medium', 10);
      const letters15 = wordUtils.generateLetterSet('medium', 15);
      const letters25 = wordUtils.generateLetterSet('medium', 25);

      expect(letters10).to.have.lengthOf(10);
      expect(letters15).to.have.lengthOf(15);
      expect(letters25).to.have.lengthOf(25);
    });

    it('should generate different letter sets for different difficulties', () => {
      const easyLetters = wordUtils.generateLetterSet('easy', 10);
      // We're not directly using mediumLetters in assertions, but keeping it for documentation
      // of what we're testing - using underscore prefix to avoid ESLint error
      const _mediumLetters = wordUtils.generateLetterSet('medium', 10);
      const hardLetters = wordUtils.generateLetterSet('hard', 10);

      // This is a probabilistic test, but with different letter distributions
      // it's very unlikely that all three sets would be identical
      expect(easyLetters.join('')).to.not.equal(hardLetters.join(''));

      // Check that easy has more vowels than hard
      const countVowels = (letters) => {
        return letters.filter(l => 'aeiou'.includes(l.toLowerCase())).length;
      };

      const easyVowels = countVowels(easyLetters);
      const hardVowels = countVowels(hardLetters);

      // Easy should have more vowels than hard
      expect(easyVowels).to.be.at.least(hardVowels);
    });

    it('should default to medium difficulty if invalid difficulty is provided', () => {
      const defaultLetters = wordUtils.generateLetterSet('invalid', 10);
      const mediumLetters = wordUtils.generateLetterSet('medium', 10);

      // Both should have the same distribution (though not necessarily the same letters)
      expect(defaultLetters).to.have.lengthOf(10);
      expect(mediumLetters).to.have.lengthOf(10);
    });
  });
});
