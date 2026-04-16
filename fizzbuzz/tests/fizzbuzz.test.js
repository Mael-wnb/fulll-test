const { fizzBuzzValue, fizzBuzzSequence } = require('../src/fizzbuzz');

describe('fizzBuzzValue', () => {
  test('returns the number when it is not divisible by 3 or 5', () => {
    expect(fizzBuzzValue(1)).toBe(1);
  });

  test('returns Fizz when the number is divisible by 3', () => {
    expect(fizzBuzzValue(3)).toBe('Fizz');
  });

  test('returns Buzz when the number is divisible by 5', () => {
    expect(fizzBuzzValue(5)).toBe('Buzz');
  });

  test('returns FizzBuzz when the number is divisible by 3 and 5', () => {
    expect(fizzBuzzValue(15)).toBe('FizzBuzz');
  });
});

describe('fizzBuzzSequence', () => {
  test('returns the sequence from 1 to N', () => {
    expect(fizzBuzzSequence(5)).toEqual([1, 2, 'Fizz', 4, 'Buzz']);
  });
});