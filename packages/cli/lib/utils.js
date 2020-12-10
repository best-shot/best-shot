const { red } = require('chalk');

async function errorHandle(callback) {
  try {
    await callback();
  } catch (error) {
    console.log(red(`${error.name}:`), error.message);
    if (error.detail) {
      console.log(error.detail);
    }
    process.exitCode = 1;
  }
}

const commands = {
  dev: 'development',
  serve: 'development',
  watch: 'development',
  prod: 'production',
  analyze: 'production',
};

function commandMode(command) {
  return commands[command] || 'development';
}

module.exports = {
  commands,
  commandMode,
  errorHandle,
};
