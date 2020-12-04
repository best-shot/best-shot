/* eslint-disable global-require */
const { red } = require('chalk');

const rootPath = process.cwd();

function safeRun(callback) {
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

module.exports = function action({ _: [command], progress }) {
  safeRun(function main() {
    const readConfig = require('./read-config');
    const applyProgress = require('./apply-progress');

    const { commandEnv, getCompiler, getConfig } = require('./utils');
    const configFunc = readConfig(rootPath);

    const { name, chain, presets = [], ...config } = configFunc({ command });

    const final = getConfig({ name, presets })
      .setup({
        watch: command === 'watch',
        mode: commandEnv(command),
        config,
      })
      .when(typeof chain === 'function', chain)
      .when(progress, applyProgress)
      .toConfig();

    if (command !== 'watch') {
      const { compiler, showStats } = getCompiler(() => final);
      if (compiler) {
        compiler.run(showStats);
      }
    } else {
      const { compiler, showStats, watchOptions } = getCompiler(() => final);

      if (compiler) {
        compiler.watch(watchOptions, showStats);
      }
    }
  });
};
