export function setOutputName({ script, style }) {
  return (chain) => {
    chain.output.filename(script(chain.output.get('filename')));

    chain.output.cssFilename(style(chain.output.get('cssFilename')));

    const io = chain.module.rule('style').rule('all').oneOf('url');

    if (io.generator.get('filename')) {
      io.generator.filename(style(io.generator.get('filename')));
    }
  };
}
