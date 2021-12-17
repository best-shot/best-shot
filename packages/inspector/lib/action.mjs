import { commandMode, errorHandle } from '@best-shot/cli/lib/utils.mjs';
import { BestShot } from '@best-shot/core';

import { concatStr } from './concat-str.mjs';
import { makeWriteFile } from './write-file.mjs';

export function action({ stamp = 'none' }) {
  console.log('best-shot', 'output files ...');

  const commands = ['watch', 'dev', 'prod', 'serve'];

  errorHandle(async () => {
    const { readConfig } = await import('@best-shot/config');

    const rootPath = process.cwd();
    const writeFile = makeWriteFile(rootPath, stamp);

    for (const command of commands) {
      const mode = commandMode(command);
      const configs = await readConfig(rootPath, false)({ command });

      configs.forEach(async (config) => {
        const { chain, name, presets = [], ...rest } = config;

        const io = new BestShot({ name });

        const watch = ['watch', 'serve'].includes(command);

        writeFile({
          name: name ? `${name}/${command}.js` : `${command}.js`,
          data: await concatStr({
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
            output: (
              await io.setup({
                watch,
                serve: command === 'serve',
                mode,
                presets,
                config: rest,
              })
            )
              // eslint-disable-next-line unicorn/no-await-expression-member
              .when(typeof chain === 'function', chain),
          }),
        });
      });
    }
  });
}
