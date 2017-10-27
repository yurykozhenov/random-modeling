const _ = require('lodash');

const utils = require('./shared/utils');
const linearCongruential = require('./shared/linear-congruential');

const min = 5;
const max = 30;

function emulateSystem(tau, t, time) {
  const m1 = utils.randomPrime(min, max);
  const generator1 = linearCongruential(min, max, m1, Infinity);

  const m2 = utils.randomPrime(min, max);
  const generator2 = linearCongruential(min, max, m2, Infinity);

  let requestsCount = 0;
  let successCount = 0;
  let errorsCount = 0;
  let workTime = 0;
  let gapTime = 0;

  while (gapTime < time) {
    const num1 = generator1.next().value / m1;
    const genGapTime = num1 > 0 && Number.isFinite(num1)
      ? Math.abs((-1 / tau) * Math.log(num1))
      : 0.1;

    const num2 = generator2.next().value / m2;
    const genWorkTime = num2 > 0 && Number.isFinite(num2)
      ? Math.abs((-1 / t) * Math.log(num2))
      : 0.1;

    gapTime += genGapTime;
    requestsCount++;

    if (workTime > gapTime) {
      errorsCount++;
    } else {
      successCount++;
      workTime += genWorkTime;
    }
  }

  return { requestsCount, errorsCount, successCount, workTime };
}

function main() {
  const tau = 0.4;
  const t = 1.6;
  const time = 30 + (5 % 4);
  const experimentsCount = 6;

  const results = _.times(experimentsCount, () => emulateSystem(tau, t, time));

  const {
    totalRequestsCount,
    totalSuccessCount,
    totalErrorsCount,
    totalWorkTime,
  } = results.reduce((acc, result) => ({
    totalRequestsCount: acc.totalRequestsCount + result.requestsCount,
    totalSuccessCount: acc.totalSuccessCount + result.successCount,
    totalErrorsCount: acc.totalErrorsCount + result.errorsCount,
    totalWorkTime: acc.totalWorkTime + result.workTime,
  }), {
    totalRequestsCount: 0,
    totalSuccessCount: 0,
    totalErrorsCount: 0,
    totalWorkTime: 0,
  });

  console.log('Середнє число вимог, що отримали обслуговування:', Math.round(totalSuccessCount / experimentsCount));
  console.log('Середній час обслуговування однієї вимоги:', (totalWorkTime / totalSuccessCount).toFixed(2));
  console.log('Ймовірність обслуговування:', (totalSuccessCount / totalRequestsCount).toFixed(2));
  console.log('Ймовірність відмови:', (totalErrorsCount / totalRequestsCount).toFixed(2));

  process.exit(0);
}

main();
