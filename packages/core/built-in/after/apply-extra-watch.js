const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

const displayName = 'extra-watch';

exports.name = displayName;

exports.apply = function applyExtraWatch({
  options: { watch },
  config: { [displayName]: extraWatch }
}) {
  return chain =>
    chain.when(watch && extraWatch, config =>
      config.plugin(displayName).use(ExtraWatchWebpackPlugin, [extraWatch])
    );
};

const stringType = {
  minLength: 1,
  type: 'string'
};

const oneOfType = {
  oneOf: [
    stringType,
    {
      type: 'array',
      items: stringType,
      minItems: 1,
      uniqueItems: true
    }
  ]
};

exports.schema = {
  [displayName]: {
    description: 'Option of ExtraWatchWebpackPlugin',
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      files: oneOfType,
      dirs: oneOfType
    }
  }
};
