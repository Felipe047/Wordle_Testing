const {
  isLetter,
  getNumOfOccurrencesInWord,
  getPositionOfOccurrence,
} = require('./utils');

describe('Utility Functions', () => {
  test('isLetter returns true for alphabetic characters', () => {
    expect(isLetter('Z')).toBe(true);
    expect(isLetter('!')).toBe(false);
    expect(isLetter('1')).toBe(false);
  });

  test('getNumOfOccurrencesInWord counts correctly', () => {
    expect(getNumOfOccurrencesInWord('banana', 'a')).toBe(3);
    expect(getNumOfOccurrencesInWord('hello', 'z')).toBe(0);
  });

  test('getPositionOfOccurrence returns correct count up to a position', () => {
    expect(getPositionOfOccurrence('banana', 'a', 3)).toBe(2);
    expect(getPositionOfOccurrence('hello', 'l', 3)).toBe(2);
  });
});
