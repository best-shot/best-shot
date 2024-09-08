'use strict';

const { resolve, join, relative } = require('node:path');
const slash = require('slash');
const { createHash } = require('node:crypto');

function createShortHash(input) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}

module.exports = function loader(source, map, meta) {
  this.cacheable();

  const { api, caller } = this.getOptions();

  const { layer } = this._module;

  const resourcePath = slash(this.resourcePath);

  const { paths, config, script } = api.processSfcFile(source, resourcePath);

  for (const path of paths) {
    const filePath = join(this.rootContext, path);
    this.addDependency(filePath);
    this.addMissingDependency(filePath);
  }

  function toThis(entryName) {
    return slash(relative(`/${layer}/..`, `/${entryName}`));
  }

  if (
    config?.usingComponents &&
    Object.keys(config.usingComponents).length > 0
  ) {
    for (const [name, path] of Object.entries(config.usingComponents)) {
      const absolutePath = path.startsWith('.')
        ? slash(resolve(this.context, path))
        : require.resolve(path);

      const relativePath = slash(relative(this.rootContext, absolutePath));

      const entryName = relativePath.startsWith('..')
        ? `as-components/${name}/${createShortHash(absolutePath)}`
        : relativePath.replace(/\.vue$/, '');

      const placer = toThis(entryName);

      config.usingComponents[name] = placer;

      const entryPath = relativePath.startsWith('..')
        ? absolutePath
        : `./${relativePath}`;

      this.addDependency(resolve(absolutePath));
      this.addMissingDependency(resolve(absolutePath));

      caller({
        name,
        path,
        absolutePath,
        relativePath,
        entryName,
        entryPath,
        placer,
      });
    }
  }

  const file = [
    ...paths
      .map((path) => relative(`${resourcePath}/..`, path))
      .map((path) => `import "./${path}";`),
    script,
  ].join('\n');

  this.emitFile(`${layer}.json`, JSON.stringify(config, null, 2));

  this.callback(null, file, map, meta);
};
