const readline = require('readline');

const utils = require('./shared/utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const linearCongruential = require('./shared/linear-congruential');
const quadraticCongruential = require('./shared/quadratic-congruential');
const fibonacci = require('./shared/fibonacci');
const inverseCongruential = require('./shared/inverse-congruential');
const union = require('./shared/union');

const generators = [linearCongruential, quadraticCongruential, fibonacci, inverseCongruential, union];

console.log('Методи генерування рівномірно розподілених чисел');
console.log('1 - Лінійний конгруентний метод');
console.log('2 - Квадратичний конгруентний метод');
console.log('3 - Числа Фібоначчі');
console.log('4 - Обернена конгруентна послідовність');
console.log('5 - Метод об\'єднання');

rl.question('Ваш вибір: ', (choice) => {
  const generator = generators[Number(choice) - 1];

  rl.question('Введіть кількість псевдо-випадкових чисел: ', (quantity) => {
    const min = 100;
    const max = 110;
    const m = utils.randomPrime(min, max);
    const n = Number(quantity);

    if (Number(choice) === 5) {
      rl.question('Виберіть перший генератор для методу об\'єднання: ', (choice1) => {
        const generator1 = generators[Number(choice1) - 1];

        rl.question('Виберіть другий генератор для методу об\'єднання: ', (choice2) => {
          const generator2 = generators[Number(choice2) - 1];

          const generatedNumbers = Array.from(generator(min, max, m, n, generator1, generator2));

          for (let num of generatedNumbers) {
            console.log(`${num} - ${(num / m).toFixed(2)}`);
          }

          process.exit(0);
        });
      });
    } else {
      const generatedNumbers = Array.from(generator(min, max, m, n));

      for (let num of generatedNumbers) {
        console.log(`${num} - ${(num / m).toFixed(2)}`);
      }

      process.exit(0);
    }
  });
});
