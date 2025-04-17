import { readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import slash from 'slash';

import { CLSX_PLACEHOLDER } from '../helper/index.mjs';

const PLUGIN_NAME = 'AddWxsPlugin';
const WXS_FILENAME = 'wxs/clsx.wxs';

function getWxsContent() {
  return readFileSync(new URL('../wxs/clsx.wxs', import.meta.url), 'utf8');
}

export class AddWxsPlugin {
  apply(compiler) {
    const {
      sources: { RawSource, ReplaceSource },
      Compilation,
    } = compiler.webpack;

    const wxsContent = getWxsContent();

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          compilation.emitAsset(WXS_FILENAME, new RawSource(wxsContent));
        },
      );

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
        },
        (assets) => {
          for (const [assetName, source] of Object.entries(assets)) {
            if (
              extname(assetName) === '.wxml' &&
              source.source().includes(CLSX_PLACEHOLDER)
            ) {
              const relativePath = slash(
                relative(join(assetName, '..'), WXS_FILENAME),
              );

              const replaceSource = new ReplaceSource(source);

              const placeholderIndex = source
                .source()
                .indexOf(CLSX_PLACEHOLDER);

              if (placeholderIndex !== -1) {
                replaceSource.replace(
                  placeholderIndex,
                  placeholderIndex + CLSX_PLACEHOLDER.length - 1,
                  relativePath,
                );

                compilation.updateAsset(assetName, replaceSource);
              }
            }
          }
        },
      );
    });
  }
}
