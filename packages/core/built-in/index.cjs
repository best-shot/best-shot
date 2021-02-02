const applyBasic = require('./apply-basic');
const applyResolve = require('./apply-resolve');
const applyTersor = require('./apply-tersor');
const applyEntry = require('./apply-entry');
const applyOther = require('./apply-other');
const applyDefine = require('./apply-define.cjs');

module.exports = [
  applyBasic,
  applyEntry,
  applyResolve,
  applyTersor,
  applyOther,
  applyDefine,
];
