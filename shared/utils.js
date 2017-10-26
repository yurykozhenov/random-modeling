const math = require('mathjs');

function randomPrime(min, max) {
  const num = math.randomInt(min, max);

  return math.isPrime(num) ? num : randomPrime(min, max);
}

function findDivisors(num) {
  return math.range(1, num + 1)._data.filter(x => num % x === 0);
}

function findPrimeDivisors(num) {
  return findDivisors(num).filter(x => math.isPrime(x));
}

function findPrimeOddDivisors(num) {
  return findPrimeDivisors(num).filter(x => x !== 2);
}

module.exports = {
  randomPrime,
  findDivisors,
  findPrimeDivisors,
  findPrimeOddDivisors,
};
