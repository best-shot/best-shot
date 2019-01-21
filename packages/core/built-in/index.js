const applyBasic = require('./before/apply-basic');
const applyResolve = require('./before/apply-resolve');
const applyTersor = require('./before/apply-tersor');
const applyEntry = require('./before/apply-entry');

const applyClean = require('./after/apply-clean');
const applyCopy = require('./after/apply-copy');
const applyDefine = require('./after/apply-define');
const applyExtraWatch = require('./after/apply-extra-watch');

module.exports = {
  before: [applyBasic, applyEntry, applyResolve, applyTersor],
  after: [applyClean, applyCopy, applyDefine, applyExtraWatch]
};
