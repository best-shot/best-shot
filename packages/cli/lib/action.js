'use strict';

const BestShot = require('@best-shot/core');

const { commandEnv } = require('./utils');
const { applyProgress, applyAnalyzer } = require('./apply');
const handle = require('./handle');
const { reachConfig, reachBrowsers, reachPackages } = require('./reach');

module.exports = function action({
  _: [command],
  platform,
  custom,
  progress,
  analyze
}) {
  const rootPath = process.cwd();
  const mode = commandEnv(command);
  const configFunc = reachConfig(rootPath);
  const packages = reachPackages(rootPath);
  const browsers = reachBrowsers(rootPath, mode);

  const { webpackChain, presets = [], ...config } = configFunc({
    command,
    custom,
    platform,
    analyze
  });

  if (command === 'serve') {
    presets.unshift('serve');
  }

  const io = new BestShot({ presets })
    .load({
      options: {
        watch: ['watch', 'serve'].includes(command)
      },
      mode,
      browsers,
      config,
      packages,
      platform,
      rootPath
    })
    .when(typeof webpackChain === 'function', webpackChain)
    .when(command === 'watch' || command === 'serve', conf => conf.watch(true))
    .when(progress, applyProgress)
    .when(analyze, applyAnalyzer);

  handle(command, io);
};
