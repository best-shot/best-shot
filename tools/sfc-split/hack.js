// eslint-disable-next-line import/no-extraneous-dependencies
import { defineComponent } from '@vue-mini/core';

function toProperties(props) {
  return props
    ? Object.fromEntries(
        Object.entries(props).map(([key, prop]) => [
          key,
          {
            type: prop.type,
            value:
              typeof prop.default === 'function'
                ? prop.default()
                : prop.default,
          },
        ]),
      )
    : undefined;
}

function mergeOptions({ name, props, data, methods, emits, ...rest }) {
  return {
    properties: toProperties(props),
    data: typeof data === 'function' ? data() : data,
    methods: {
      $emit(event, ...args) {
        this.triggerEvent(event, ...args);
      },
      ...methods,
    },
    ...rest,
  };
}

export function $$asSetupComponent(options) {
  const io = mergeOptions(options);

  defineComponent(io);
}

export function $$asComponent(options) {
  const io = mergeOptions(options);
  /* global Component: readonly */
  Component(io);
}
