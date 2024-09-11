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

export function mergeOptions({ name, props, data, methods, emits, ...rest }) {
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
