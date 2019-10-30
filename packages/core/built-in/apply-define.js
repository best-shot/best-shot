'use strict';

const { DefinePlugin } = require('webpack');
const mapValues = require('lodash/mapValues');

const { objectFilter } = require('../lib/common');

const displayName = 'define';

exports.name = displayName;

exports.apply = function applyDefine({
  config: { define },
  platform: PLATFORM,
  options: { serve, watch }
}) {
  return chain => {
    const NODE_ENV = chain.get('mode');

    chain.plugin('define').use(DefinePlugin, [
      mapValues(
        objectFilter({
          'process.env.NODE_ENV': NODE_ENV,
          'process.env.PLATFORM': PLATFORM,
          'process.env.DEBUG': serve || watch,
          ...define
        }),
        JSON.stringify
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
