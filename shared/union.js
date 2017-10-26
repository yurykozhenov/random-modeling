module.exports = function*(min, max, m, n, generator1, generator2) {
  const gen1 = generator1(min, max, m, n);
  const gen2 = generator2(min, max, m, n);

  for (let i = 0; i < n; i++) {
    const x = gen1.next().value;
    const y = gen2.next().value;

    yield (x - y) % m;
  }
};
