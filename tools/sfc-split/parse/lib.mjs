import { deepmerge as deepMerge } from 'deepmerge-ts';
import { parse as yamlParse } from 'yaml';

export function mergeConfig(customBlocks) {
  const configs = customBlocks
    .filter(
      (block) =>
        block &&
        block.type === 'config' &&
        (block.lang === 'json' || block.lang === 'yaml') &&
        block.content &&
        block.content.trim(),
    )
    .map((block) =>
      block.lang === 'yaml'
        ? yamlParse(block.content)
        : JSON.parse(block.content),
    );

  return configs.length > 1 ? deepMerge(...configs) : configs[0] || {};
}
