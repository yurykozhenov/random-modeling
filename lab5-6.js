const async = require('asyncawait/async');
const await = require('asyncawait/await');
const _ = require('lodash');

const question = require('./question');

function systemWithRecall(m, c, mu, nu, lambda) {
  const r = [];

  for (let i = 0; i < m + 1; i++) {
    r.push([]);
  }

  r[m] = [1, 1];

  for (let i = 2; i < c + 1; i++) {
    const rm = ((lambda + (i - 1) * nu + m * mu) * r[m][i - 1] - lambda * r[m][i - 2])
      / (i * nu);

    r[m].push(rm);
  }

  for (let j = m - 1; j >= 0; j--) {
    const b = [0];
    const d = [0];

    const rj = [];

    for (let i = 0; i < c + 1; i++) {
      rj.push(0);
    }

    r[j] = r[j].concat(rj);

    for (let i = 1; i < c + 1; i++) {
      const bi = i * nu * (j * mu + b[i - 1])
        / (lambda + j * mu + b[i - 1]);

      b.push(bi);

      const di = (j + 1) * mu * r[j + 1][i - 1] + (lambda * d[i - 1])
        / (lambda + j * mu + b[i - 1]);

      d.push(di);
    }

    const rjc = (j + 1) * mu * _.sum(r[j + 1].slice(0, c))
      / lambda;

    r[j][c] = rjc;

    for (let i = c - 1; i >= 0; i--) {
      const rji = (d[i] + (i + 1) * nu * r[j][i + 1])
        / (lambda + j * mu + b[i]);

      r[j][i] = rji;
    }
  }

  const pi0m = 1 / _.sum(r.map(rj => _.sum(rj)));
  const pi = [];

  for (let rj of r) {
    const pij = [];

    for (let ri of rj) {
      pij.push(ri * pi0m);
    }

    pi.push(pij);
  }

  pi[m][0] = pi0m;

  const temp1 = [];

  for (let i = 1; i < c + 1; i++) {
    temp1.push(i * _.sum(pi.map(pij => pij[i])));
  }

  const avgBusyDevices = _.sum(temp1);

  const temp2 = [];

  for (let j = 1; j < m + 1; j++) {
    temp2.push(j * _.sum(pi[j]));
  }

  const avgRecallSources = _.sum(temp2);

  const avgTimeFromCallToService = avgRecallSources / lambda;
  const lossCallProb = _.sum(pi.map(pij => pij[c]));

  return {
    avgBusyDevices,
    avgRecallSources,
    avgTimeFromCallToService,
    lossCallProb,
  };
}

const main = async(function() {
  const defaultExperiments = 10;
  const defaultC = 100;
  const defaultM = 110;
  const defaultLambda = 105;

  const experiments = Number(await(question(`Введіть кількість експериментів (${defaultExperiments}): `)))
    || defaultExperiments;
  const c = Number(await(question(`Введіть кількість приладів (${defaultC}): `)))
    || defaultC;
  const m = Number(await(question(`Введіть кількість джерел повторних викликів (${defaultM}): `)))
    || defaultM;
  const lambda = Number(await(question(`Введіть інтенсивнісмть (${defaultLambda}): `)))
    || defaultLambda;

  for (let experiment = 0; experiment < experiments; experiment++) {
    const nu = Math.random();
    const mu = Math.random();

    console.log(`\nВипробування #${experiment + 1}`);
    console.log('Час обслуговування:', (nu * 60).toFixed(2));
    console.log('Час повторного виклику', (mu * 60).toFixed(2));

    const {
      avgBusyDevices,
      avgRecallSources,
      avgTimeFromCallToService,
      lossCallProb,
    } = systemWithRecall(m, c, mu, nu, lambda);

    console.log('Середня кількість зайнятих приладів:', avgBusyDevices.toFixed(2));
    console.log('Середня кількість джерел повторних викликів:', avgRecallSources.toFixed(2));
    console.log('Середній час очікування первинного виклику до обслуговування:', (avgTimeFromCallToService * 60).toFixed(2));
    console.log('Ймовірність втрати первниниих викликів:', lossCallProb.toFixed(2));
  }

  process.exit(0);
});

main();
