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

    let generatedNumbers;

    if (Number(choice) === 5) {
      rl.question('Виберіть перший генератор для метода об\'єднання: ', (choice1) => {
        const generator1 = generators[Number(choice1) - 1];

        rl.question('Виберіть другий генератор для метода об\'єднання: ', (choice2) => {
          const generator2 = generators[Number(choice2) - 1];

          generatedNumbers = Array.from(generator(min, max, m, n, generator1, generator2));
          console.log('Цілі псевдо-випадкові числа (X):', generatedNumbers)
          console.log('Дійсні псевдо-випадкові числа (U):', generatedNumbers.map(num => num / m));

          process.exit(0);
        });
      });
    } else {
      generatedNumbers = Array.from(generator(min, max, m, n));
      console.log('Цілі псевдо-випадкові числа (X):', generatedNumbers)
      console.log('Дійсні псевдо-випадкові числа (U):', generatedNumbers.map(num => num / m));

      process.exit(0);
    }
  });
});

function showResult(generateNumbers) {

}
