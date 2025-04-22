'use strict';

const { resolve, join, relative } = require('node:path');
const { createHash } = require('node:crypto');

function createShortHash(input) {
  return createHash('sha256').update(input).digest('hex').slice(0, 8);
}

function handleImport({
  toThis,
  caller,
  componentRoot,
  context,
  rootContext,
  slash,
  maps,
  callback,
}) {
  if (Object.keys(maps).length > 0) {
    for (const [name, path] of Object.entries(maps)) {
      if (path.endsWith('.vue') && !path.startsWith('plugin://')) {
        try {
          const absolutePath = slash(
            path.startsWith('.')
              ? resolve(context, path)
              : require.resolve(path),
          );

          const relativePath = slash(relative(rootContext, absolutePath));

          const hack = relativePath.startsWith('..');

          const entryName = hack
            ? [
                componentRoot,
                absolutePath
                  .split('/')
                  .slice(-2)
                  .join('/')
                  .replace(/\.vue$/, ''),
                createShortHash(slash(absolutePath)),
              ].join('/')
            : relativePath.replace(/\.vue$/, '');

          const placer = toThis(entryName);

          callback({ name, placer });

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
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

module.exports = async function loader(source, map, meta) {
  this.cacheable();

  const callback = this.async();

  const { api, caller, componentRoot } = this.getOptions();

  const { layer } = this._module;

  const { default: slash } = await import('slash');

  const resourcePath = slash(this.resourcePath);

  const { paths, config, script } = api.processSfcFile(source, resourcePath);

  const { rootContext, context } = this;

  for (const path of paths) {
    const filePath = join(rootContext, path);
    this.addDependency(filePath);
    this.addMissingDependency(filePath);
  }

  function toThis(entryName) {
    return slash(relative(`/${layer}/..`, `/${entryName}`));
  }

  if (config?.usingComponents) {
    handleImport.bind(this)({
      toThis,
      caller,
      componentRoot,
      context,
      rootContext,
      slash,
      maps: config.usingComponents,
      callback({ name, placer }) {
        config.usingComponents[name] = placer;

        if (placer.includes(componentRoot)) {
          config.componentPlaceholder ??= {};
          config.componentPlaceholder[name] = 'view';
        }
      },
    });
  }

  if (config?.componentGenerics) {
    handleImport.bind(this)({
      toThis,
      caller,
      componentRoot,
      context,
      rootContext,
      slash,
      maps: Object.fromEntries(
        Object.entries(config.componentGenerics)
          .filter(([_, item]) => item?.default)
          .map(([key, item]) => [key, item.default]),
      ),
      callback({ name, placer }) {
        config.componentGenerics[name].default = placer;
      },
    });
  }

  const file = [
    ...paths
      .map((path) => relative(`${resourcePath}/..`, path))
      .map((path) => `import "./${path}";`),
    script,
  ].join('\n');

  this.emitFile(`${layer}.json`, JSON.stringify(config, null, 2));

  callback(null, file, map, meta);
};
