'use strict';

const { DefinePlugin } = require('webpack');
const mapValues = require('lodash/mapValues');

const { objectFilter } = require('../lib/common');

const displayName = 'define';

exports.name = displayName;

exports.apply = function applyDefine({ config: { define }, platform }) {
  return chain => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.plugin(displayName).use(DefinePlugin, [
      mapValues(
        objectFilter({
          'process.env.NODE_ENV': mode,
          'process.env.PLATFORM': platform,
          'process.env.LOCAL': watch,
          ...define
        }),
        value => JSON.stringify(value)
      )
    ]);
  };
};

exports.schema = {
  define: {
    description: 'Options of DefinePlugin',
    type: 'object'
  }
};
