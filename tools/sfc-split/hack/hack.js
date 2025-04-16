// eslint-disable-next-line import/no-extraneous-dependencies
import { customRef, ref } from '@vue-mini/core';

const prefix = '__';

const DefaultValues = {
  boolean: false,
  number: 0,
  string: '',
};

export function hackOptions(options) {
  const { data, observers, ...io } = options;

  if (!data || !Object.keys(data).length > 0 || !io.setup) {
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
      return io.setup(props, {
        ...context,
        hackRef(key) {
          const fakeKey = prefix + key;

          const init = DefaultValues[typeof data[fakeKey]] ?? null;

          if (!needHacks.some(([name]) => name === fakeKey)) {
            return ref(null);
          }

          return (
            customRef((track, trigger) => {
              $triggers[fakeKey] = trigger;

              return {
                get() {
                  track();
                  return context.data[fakeKey] ?? init;
                },
                set(value) {
                  trigger();
                  // context.setData({ [fakeKey]: value ?? init });
                },
              };
            }) ?? init
          );
        },
      });
    },
  };
}
