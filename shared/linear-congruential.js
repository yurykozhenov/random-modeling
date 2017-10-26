const math = require('mathjs');

const utils = require('./utils');

module.exports = function*(min, max, m, n) {
  const c = utils.randomPrime(0, m);
  const a = randomMultiplier(c, m);

  let x = math.randomInt(0, max);

  for (let i = 0; i < n; i++) {
    yield x;

    x = (a * x + c) % m;
  }
}

function randomMultiplier(c, m) {
  let divisors = utils.findPrimeDivisors(m);

  if (m % 4 === 0) {
    divisors = divisors.filter(div => div % 4 === 0);
  }

  let a;

  do {
    a = math.randomInt(0, m);
  } while (!divisors.every(div => a - 1 % div === 0));

  return a;
}
