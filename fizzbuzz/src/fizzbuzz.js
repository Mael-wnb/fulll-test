function fizzBuzzValue(n) {
    if (n % 15 === 0) {
      return 'FizzBuzz';
    }
  
    if (n % 3 === 0) {
      return 'Fizz';
    }
  
    if (n % 5 === 0) {
      return 'Buzz';
    }
  
    return n;
  }
  
  function fizzBuzzSequence(n) {
    const sequence = [];
  
    for (let i = 1; i <= n; i += 1) {
      sequence.push(fizzBuzzValue(i));
    }
  
    return sequence;
  }
  
  module.exports = {
    fizzBuzzValue,
    fizzBuzzSequence,
  };