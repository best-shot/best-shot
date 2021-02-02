const BestShot = require('@best-shot/core');

const { errorHandle, commandMode } = require('@best-shot/cli/lib/utils.cjs');

const concatStr = require('./concat-str.cjs');
const makeWriteFile = require('./write-file.cjs');

function isSafeError(error) {
  return (
    error.code === 'MODULE_NOT_FOUND' &&
    error.requireStack &&
    error.requireStack[0] === __filename
  );
}

module.exports = function action({ stamp = 'none' }) {
  console.log('Output files ...');

  const commands = ['watch', 'dev', 'prod'];

  let autoAddPreset;

  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    autoAddPreset = require('@best-shot/dev-server/lib/utils.cjs')
      .autoAddPreset;
    if (autoAddPreset) {
      commands.push('serve');
    }
  } catch (error) {
    if (!isSafeError(error)) {
      throw error;
    }
  }

  errorHandle(async () => {
    const readConfig = require('@best-shot/cli/lib/read-config.cjs');

    const rootPath = process.cwd();
    const writeFile = makeWriteFile(rootPath, stamp);

    // eslint-disable-next-line no-restricted-syntax
    for (const command of commands) {
      const mode = commandMode(command);
      // eslint-disable-next-line no-await-in-loop
      const configs = await readConfig(rootPath, false)({ command });

      if (command === 'serve') {
        autoAddPreset(configs);
      }

      configs.forEach((config) => {
        const { chain, name, presets = [], ...rest } = config;

        const io = new BestShot({
          name,
          presets:
            command === 'serve'
              ? presets
              : presets.filter((item) => item !== 'serve'),
        });

        const watch = ['watch', 'serve'].includes(command);

        writeFile({
          name: name ? `${name}/${command}.js` : `${command}.js`,
          data: concatStr({
            stamp,
            input: {
              watch,
              name,
              mode,
              command,
              presets,
              config: rest,
              ...(chain ? { chain } : undefined),
            },
            schema: io.schema.toObject(),
            output: io
              .setup({ watch, mode, config: rest })
              .when(typeof chain === 'function', chain),
          }),
        });
      });
    }
  });
};
