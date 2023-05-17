import * as applyAsset from './apply-asset.mjs';
import * as applyBasic from './apply-basic.mjs';
import * as applyDefine from './apply-define.mjs';
import * as applyEntry from './apply-entry.mjs';
import * as applyLast from './apply-last.mjs';
import * as applyNode from './apply-node.mjs';
import * as applyOther from './apply-other.mjs';
import * as applyResolve from './apply-resolve.mjs';
import * as applyTersor from './apply-tersor.mjs';

export const builtIn = [
  applyBasic,
  applyEntry,
  applyResolve,
  applyTersor,
  applyOther,
  applyDefine,
  applyNode,
  applyAsset,
  applyLast,
];
