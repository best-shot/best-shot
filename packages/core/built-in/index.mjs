import * as applyAsset from './apply-asset.mjs';
import * as applyBasic from './apply-basic.mjs';
import * as applyDefine from './apply-define.mjs';
import * as applyEntry from './apply-entry.mjs';
import * as applyLast from './apply-last.mjs';
import * as applyNode from './apply-node.mjs';
import * as applyOther from './apply-other.mjs';
import * as applyResolve from './apply-resolve.mjs';
import * as applyTerser from './apply-terser.mjs';
import * as applySplitChunks from './apply-split-chunks.mjs';

export const builtIn = [
  applyBasic,
  applyEntry,
  applyResolve,
  applyTerser,
  applyOther,
  applyDefine,
  applyNode,
  applyAsset,
  applySplitChunks,
  applyLast,
];
