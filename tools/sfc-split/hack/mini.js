// eslint-disable-next-line import/no-extraneous-dependencies
import { defineComponent } from '@vue-mini/core';

import { hackOptions } from './hack.js';
import { mergeOptions } from './helper.js';

export function $$asComponent(options) {
  const io = options.options?.hacked
    ? hackOptions(mergeOptions(options))
    : mergeOptions(options);

  if (io.setup) {
    defineComponent({
      ...io,
      setup(props, context) {
        return io.setup(props, {
          ...context,
          expose: () => {},
          emit: (event, ...args) => {
            context.triggerEvent(event, ...args);
          },
          get parent() {
            return context.selectOwnerComponent();
          },
        });
      },
    });
  } else {
    /* global Component: readonly */
    Component(io);
  }
}
