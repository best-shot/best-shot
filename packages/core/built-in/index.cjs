const applyBasic = require('./apply-basic.cjs');
const applyResolve = require('./apply-resolve.cjs');
const applyTersor = require('./apply-tersor.cjs');
const applyEntry = require('./apply-entry.cjs');
const applyOther = require('./apply-other.cjs');
const applyDefine = require('./apply-define.cjs');

module.exports = [
  applyBasic,
  applyEntry,
  applyResolve,
  applyTersor,
  applyOther,
  applyDefine,
];
