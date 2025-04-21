import { AddEntryPlugin } from './plugin/add-entry.mjs';
import { AddWxsPlugin } from './plugin/add-wxs.mjs';
import { CopyConfigPlugin } from './plugin/copy-config.mjs';
// import { ExposeEntryNamePlugin } from './plugin/expose-entry.mjs';
import { SfcSplitPlugin } from './plugin/sfc-split.mjs';

export class AllInOnePlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const { type } = this;

    if (type) {
      // new ExposeEntryNamePlugin().apply(compiler);
      new AddEntryPlugin({ type }).apply(compiler);
      new CopyConfigPlugin({ type }).apply(compiler);
      new AddWxsPlugin().apply(compiler);
      new SfcSplitPlugin().apply(compiler);
    }
  }
}
