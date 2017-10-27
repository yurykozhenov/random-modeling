const async = require('asyncawait/async');
const await = require('asyncawait/await');

const question = require('./question');

const utils = require('./shared/utils');

const linearCongruential = require('./shared/linear-congruential');
const quadraticCongruential = require('./shared/quadratic-congruential');
const fibonacci = require('./shared/fibonacci');
const inverseCongruential = require('./shared/inverse-congruential');
const union = require('./shared/union');

const generators = [
  linearCongruential,
  quadraticCongruential,
  fibonacci,
  inverseCongruential,
  union
];

const min = 100;
const max = 110;

const main = async(function() {
  console.log('Методи генерування рівномірно розподілених чисел');
  console.log('1 - Лінійний конгруентний метод');
  console.log('2 - Квадратичний конгруентний метод');
  console.log('3 - Числа Фібоначчі');
  console.log('4 - Обернена конгруентна послідовність');
  console.log('5 - Метод об\'єднання');

  const choice = await(question('Ваш вибір: '));

  const generatorIndex = Number(choice) - 1;
  const generator = generators[generatorIndex];

  const quantity = await(question('Введіть кількість псевдо-випадкових чисел: '));

  const m = utils.randomPrime(min, max);
  const n = Number(quantity);

  let generatedNumbers;

  if (generatorIndex === 4) {
    const choice1 = await(question('Виберіть перший генератор для методу об\'єднання: '));
    const generator1 = generators[Number(choice1) - 1];

    const choice2 = await(question('Виберіть другий генератор для методу об\'єднання: '));
    const generator2 = generators[Number(choice2) - 1];

    generatedNumbers = Array.from(generator(min, max, m, n, generator1, generator2));
  } else {
    generatedNumbers = Array.from(generator(min, max, m, n));
  }

  for (let num of generatedNumbers) {
    console.log(`${num} | ${(num / m).toFixed(2)}`);
  }

  process.exit(0);
});

main();
