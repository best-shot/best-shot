module.exports = function setOutputName(
  chain,
  {
    both, script = both, style = both, useHot = false
  }
) {
  const jsFilename = chain.output.get('filename');
  return chain.output
    .filename(script(jsFilename))
    .end()
    .when(!useHot, config =>
      config.plugin('extract-css').tap(([{ filename, ...options }]) => [
        {
          ...options,
          filename: style(filename)
        }
      ])
    );
};
