const PluginName = 'ExposeEntryNamePlugin';

function getEntryName(loaderContext) {
  if (!loaderContext._compilation) {
    return '';
  }

  const { moduleGraph } = loaderContext._compilation;
  let entryName = '';

  for (const [name, { dependencies }] of loaderContext._compilation.entries) {
    for (const dep of dependencies) {
      const entryModule = moduleGraph.getModule(dep);

      if (entryModule && entryModule.resource === loaderContext.resource) {
        entryName = name;
        break;
      }
    }
  }

  return entryName;
}

export class ExposeEntryNamePlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    const { NormalModule } = compiler.webpack;

    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      NormalModule.getCompilationHooks(compilation).loader.tap(
        PluginName,
        (loaderContext) => {
          Object.defineProperty(loaderContext, 'entryName', {
            enumerable: true,
            configurable: false,
            get() {
              return getEntryName(loaderContext);
            },
          });
        },
      );
    });
  }
}
