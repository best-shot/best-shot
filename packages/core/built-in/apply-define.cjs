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

exports.apply = function applyDefine({ config: { define } }) {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const name = chain.get('name');

    chain.plugin(displayName).use(DefinePlugin, [
      variables({
        ...define,
        'process.env.NODE_ENV': mode,
        'BEST_SHOT.MODE': mode,
        'BEST_SHOT.WATCHING': watch,
        'BEST_SHOT.CONFIG_NAME': name,
      }),
    ]);
  };
};

exports.schema = {
  define: {
    title: 'Options of DefinePlugin',
    description: 'transform by `JSON.stringify`',
    type: 'object',
  },
};
