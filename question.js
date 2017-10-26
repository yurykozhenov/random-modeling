const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = function question(message) {
  return new Promise((resolve) => {
    rl.question(message, answer => {
      resolve(answer);
    });
  });
};
