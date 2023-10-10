export function setOutputName({ script, style }) {
  return (chain) => {
    const jsFilename = chain.output.get('filename');

    chain.output.filename(script(jsFilename));

    if (chain.plugins.has('extract-css')) {
      chain
        .plugin('extract-css')
        .tap(([{ /* chunkFilename,  */ filename, ...options }]) => [
          {
            ...options,
            filename: style(filename),
            // chunkFilename: style(chunkFilename)
          },
        ]);
    }

    if (chain.module.rule('style').rule('all').oneOf('url').entries()) {
      const generator =
        chain.module.rule('style').rule('all').oneOf('url').get('generator') ||
        {};

      chain.module
        .rule('style')
        .rule('all')
        .oneOf('url')
        .set('generator', {
          ...generator,
          filename: style(generator.filename),
        });
    }
  };
}
