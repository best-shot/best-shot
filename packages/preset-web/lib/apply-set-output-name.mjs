export function setOutputName({ script, style }) {
  return (chain) => {
    chain.output.filename(script(chain.output.get('filename')));

    const cssFilename = style(chain.output.get('cssFilename'));

    chain.output.cssFilename(cssFilename);

    // Assets pulled in via CSS url() (e.g. url('./other.css')) share the
    // stylesheet naming so they get the same min/hash treatment.
    chain.module
      .rule('style')
      .rule('all')
      .oneOf('url')
      .generator.filename(cssFilename);
  };
}
