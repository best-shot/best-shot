'use strict';

const cloneDeep = require('lodash/cloneDeep');
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line node/no-extraneous-require
const Chain = require('webpack-chain');
const BestShot = require('@best-shot/core');
const { commandEnv } = require('@best-shot/core/lib/common');
/* eslint-enable */

const { applyProgress, applyAnalyzer } = require('@best-shot/cli/apply');
const {
  reachDependencies,
  reachConfig,
  reachBrowsers
} = require('@best-shot/cli/reach');
const { concatStr, formatJs } = require('./concat-str');
const makeWriteFile = require('./write-file');

const commands = ['serve', 'watch', 'dev', 'prod'];

module.exports = function inspector({
  platforms = [''],
  stamp = 'none',
  analyze
}) {
  const rootPath = process.cwd();
  const configFunc = reachConfig(rootPath, 'best-shot.config.js');
  const dependencies = reachDependencies(rootPath);
  const writeFile = makeWriteFile(rootPath, stamp);

  console.log('Output files ...');

  platforms.forEach(async (_, platform = _ || undefined) => {
    commands.forEach(async command => {
      try {
        const mode = commandEnv(command);
        const browsers = reachBrowsers(rootPath)[mode];

        const { webpackChain, presets, ...config } = cloneDeep(
          configFunc({
            command,
            platform,
            analyze
          })
        );

        if (command === 'serve') {
          presets.unshift('serve');
        }

        const io = new BestShot({ presets });

        const schema = io.schema.toString();

        const result = io
          .load({
            options: {
              watch: command === 'watch',
              serve: command === 'serve'
            },
            rootPath,
            dependencies,
            mode,
            config,
            platform,
            browsers
          })
          .when(typeof webpackChain === 'function', webpackChain);

        if (result) {
          writeFile({
            name: `${platform ? `${platform}-` : ''}${command}.js`,
            data: concatStr({
              stamp,
              input: {
                platform,
                mode,
                browsers,
                command,
                presets,
                config,
                webpackChain
              },
              schema,
              output: result.toString()
            })
          });
        }
      } catch (error) {
        throw error;
      }
    });
  });

  writeFile({
    name: 'progress-analyze.js',
    data: formatJs(
      `// $ best-shot dist --progress --analyze

exports.sample = ${new Chain()
    .batch(applyProgress)
    .batch(applyAnalyzer)
    .toString()}`
    )
  });

  writeFile({
    name: 'dependencies.json',
    data: JSON.stringify(dependencies, null, '  ')
  });
};
