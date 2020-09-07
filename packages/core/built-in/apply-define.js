const { DefinePlugin } = require('webpack');
const mapValues = require('lodash/mapValues');
const pickBy = require('lodash/pickBy');

function variables(object) {
  return mapValues(
    pickBy(object, (item) => item !== undefined),
    (value) => JSON.stringify(value),
  );
}

const displayName = 'define';

exports.name = displayName;

exports.apply = function applyDefine({ config: { define }, platform }) {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.plugin(displayName).use(DefinePlugin, [
      variables({
        ...define,
        'process.env.NODE_ENV': mode,
        'process.env.PLATFORM': platform,
        'process.env.LOCAL': watch,
      }),
    ]);
  };
};

exports.schema = {
  define: {
    description: 'Options of DefinePlugin',
    type: 'object',
  },
};
