import { readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import slash from 'slash';

const PLUGIN_NAME = 'AddWxsPlugin';

export class AddWxsPlugin {
  apply(compiler) {
    const {
      sources: { RawSource, ConcatSource },
    } = compiler.webpack;

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      const wxsContent = readFileSync(
        new URL('../wxs/clsx.wxs', import.meta.url),
        'utf8',
      );
      compilation.emitAsset('wxs/clsx.wxs', new RawSource(wxsContent));

      compilation.hooks.processAssets.tap(PLUGIN_NAME, (assets) => {
        for (const [assetName, source] of Object.entries(assets)) {
          if (
            extname(assetName) === '.wxml' &&
            source.source().includes('clsx.clsx(')
          ) {
            const path = slash(relative(join(assetName, '..'), 'wxs/clsx.wxs'));
            const head = `<wxs src="${path}" module="clsx" />\n`;
            compilation.updateAsset(
              assetName,
              (old) => new ConcatSource(head, old),
            );
          }
        }
      });
    });
  }
}
