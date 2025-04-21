// eslint-disable-next-line import/no-extraneous-dependencies
import { getCurrentInstance } from '@vue-mini/core';

const prefix = '__';

const DefaultValues = {
  boolean: false,
  number: 0,
  string: '',
};

export function hackOptions(options) {
  const { data, observers, ...io } = options;

  if (!data || Object.keys(data).length === 0 || !io.setup) {
    return options;
  }

  const $triggers = {};

  const needHacks = Object.entries(data)
    .filter(
      ([key, value]) =>
        key.startsWith(prefix) && (typeof value) in DefaultValues,
    )
    .map(([key]) => [
      key,
      () => {
        if (typeof $triggers[key] === 'function') {
          $triggers[key]();
        }
      },
    ]);

  if (needHacks.length === 0) {
    return options;
  }

  return {
    ...io,
    data,
    observers: {
      ...observers,
      ...Object.fromEntries(needHacks),
    },
    setup(props, context) {
      const current = getCurrentInstance();

      Object.defineProperty(current, '$triggers', {
        enumerable: true,
        configurable: false,
        get() {
          return $triggers;
        },
      });

      Object.defineProperty(current, '$needHacks', {
        enumerable: true,
        configurable: false,
        get() {
          return needHacks;
        },
      });

      Object.defineProperty(current, '$options', {
        enumerable: true,
        configurable: false,
        get() {
          return options;
        },
      });

      return io.setup(props, {
        ...context,
      });
    },
  };
}
