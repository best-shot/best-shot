import webpack from 'webpack';

export function createCompiler(config) {
  return webpack(
    Array.isArray(config) ? (config.length > 1 ? config : config[0]) : config,
  );
}
