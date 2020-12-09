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

function commandMode(command) {
  return (
    {
      dev: 'development',
      serve: 'development',
      watch: 'development',
      prod: 'production',
      analyze: 'production',
    }[command] || 'development'
  );
}

module.exports = {
  commandMode,
  errorHandle,
};
