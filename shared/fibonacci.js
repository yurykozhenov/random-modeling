const math = require('mathjs');

module.exports = function*(min, max, m, n) {
  let x1 = 0;
  let x2 = 1;
  let x3;

  yield x1;
  yield x2;

  n -= 2;

  for (let i = 0; i < n; i++) {
    x3 = (x1 + x2) % m;
    x1 = x2;
    x2 = x3;

    yield x3;
  }
}
