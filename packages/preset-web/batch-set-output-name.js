module.exports = function setOutputName(
  chain,
  { both, script = both, style = both }
) {
  const jsFilename = chain.output.get('filename');

  chain.output.filename(script(jsFilename));

  if (chain.plugins.has('extract-css')) {
    chain.plugin('extract-css').tap(([{ filename, ...options }]) => [
      {
        ...options,
        filename: style(filename)
      }
    ]);
  }
};
