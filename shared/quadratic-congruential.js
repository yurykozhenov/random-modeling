const math = require('mathjs');

const utils = require('./utils');

module.exports = function*(min, max, m, n = 1) {
  m = m != null ? m : utils.randomPrime(min, max);

  const c = utils.randomPrime(0, m);
  const { a, d } = findCoefficients(c, m);

  let x = math.randomInt(0, max);

  for (let i = 0; i < n; i++) {
    yield x;

    x = (d * Math.pow(x, 2) + a * x + c) % m;
  }
};

function findCoefficients(c, m) {
  let divisors = utils.findPrimeOddDivisors(m);

  // Find a

  let a;

  do {
    a = math.randomInt(0, m);
  } while (!divisors.every(div => a - 1 % div === 0));

  // Find d

  let d;

  if (m % 4 === 0) {
    d = (a - 1) % 4;
  } else if (m % 2 === 0) {
    d = (a - 1) % 2;
  } else if (m % 3 === 0) {
    const excluded = 3 * c % 9;
    divisors = divisors.filter(div => div != excluded);
  }

  do {
    d = math.randomInt(0, m);
  } while (!divisors.every(div => d % div === 0));

  return { a, d };
}
