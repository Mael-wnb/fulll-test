const { fizzBuzzSequence } = require('./fizzbuzz');

const input = process.argv[2];
const n = Number(input);

if (!Number.isInteger(n) || n < 1) {
  console.error('Please provide a positive integer.');
  process.exit(1);
}

const result = fizzBuzzSequence(n);

for (const value of result) {
  console.log(value);
}