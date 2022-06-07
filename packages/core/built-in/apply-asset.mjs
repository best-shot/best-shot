import extToRegexp from 'ext-to-regexp';

export function apply() {
  return (chain) => {
    const mode = chain.get('mode');

    function file(io) {
      io.type('asset/resource').set('generator', {
        filename:
          mode === 'production' ? '[contenthash:8][ext]' : '[path][name][ext]',
      });
    }

    const text = chain.module
      .rule('text')
      .test(extToRegexp({ extname: ['txt'] }));

    text.oneOf('url').set('dependency', 'url').batch(file);

    text
      .oneOf('not-url')
      .set('dependency', { not: 'url' })
      .oneOf('query')
      .resourceQuery(/to-url/)
      .batch(file);

    text.oneOf('not-url').oneOf('raw').type('asset/source');
  };
}
