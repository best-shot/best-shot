import { toJSONString } from './index.mjs';
import { readConfig } from './read.mjs';

export function createEmitFile({
  PLUGIN_NAME,
  compilation,
  RawSource,
  Compilation,
}) {
  return (name, content) => {
    compilation.hooks.processAssets.tap(
      {
        name: PLUGIN_NAME,
        stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
      },
      () => {
        compilation.emitAsset(
          name,
          new RawSource(
            typeof content === 'string' ? content : toJSONString(content),
          ),
        );
      },
    );
  };
}

export function readAndTrack(compiler, compilation) {
  return (name) => {
    const { filePath, config = {} } = readConfig(compiler.context, name);

    if (filePath) {
      compilation.fileDependencies.add(filePath);
    }

    return {
      name: `${name}.json`,
      content: config,
      empty: Object.keys(config).length === 0,
    };
  };
}

export function createAddEntry(compiler, EntryPlugin) {
  return (name, path) => {
    new EntryPlugin(compiler.context, path, {
      import: [path],
      layer: name,
      name,
    }).apply(compiler);
  };
}
