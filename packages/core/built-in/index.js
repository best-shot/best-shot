const applyBasic = require('./apply-basic');
const applyResolve = require('./apply-resolve');
const applyTersor = require('./apply-tersor');
const applyEntry = require('./apply-entry');
const applyClean = require('./apply-clean');
const applyCopy = require('./apply-copy');
const applyDefine = require('./apply-define');

module.exports = [
  applyBasic,
  applyEntry,
  applyResolve,
  applyTersor,
  applyClean,
  applyCopy,
  applyDefine
];
