const { red } = require('chalk');

function errorHandle(callback) {
  try {
    callback();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(red('Error:'), error.message);
      process.exitCode = 1;
    }
    throw error;
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
