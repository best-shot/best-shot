const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const mapValues = require('lodash/mapValues');

const displayName = 'define-env';

exports.name = displayName;

exports.apply = function applyDefine({
  config: { define },
  mode,
  options: { serve, watch }
}) {
  return chain =>
    chain
      .when(define, config =>
        config
          .plugin('define')
          .use(DefinePlugin, [mapValues(define, JSON.stringify)])
      )
      .plugin('environment')
      .use(EnvironmentPlugin, [
        {
          NODE_ENV: mode,
          DEBUG: serve || watch
        }
      ]);
};

exports.schema = {
  define: {
    description: 'Options of DefinePlugin',
    minProperties: 1,
    type: 'object'
  }
};
