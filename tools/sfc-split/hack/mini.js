// eslint-disable-next-line import/no-extraneous-dependencies
import { defineComponent } from '@vue-mini/core';

import { mergeOptions } from './helper.js';

export function $$asComponent(options) {
  const io = mergeOptions(options);

  defineComponent({
    ...io,
    setup(props, context) {
      return io.setup(props, {
        ...context,
        expose: () => {},
        get parent() {
          return context.selectOwnerComponent();
        },
      });
    },
  });
}
