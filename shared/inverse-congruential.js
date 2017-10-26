const math = require('mathjs');

module.exports = function*(min, max, p, n) {
  const c = math.randomInt(0, p - 1);
  const a = math.randomInt(0, c - 1);

  let x = math.randomInt(0, p - 1);

  for (let i = 0; i < n; i++) {
    yield x;

    x = (a * inverseX(x, p) + c) % p;
  }
};

function inverseX(x, mod) {
  if (x === 0) {
    return Infinity;
  }

  if (!Number.isFinite(x)) {
    return 0;
  }

  if (x === 1) {
    return 1;
  }

  for (let i = 2; i < mod; i++) {
    if ((x * i) % mod === 1) {
      return i;
    }
  }

  throw new Error(`${x} is not invertible!`);
}
