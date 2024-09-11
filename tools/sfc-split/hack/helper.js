function toProperties(props, properties) {
  const io = props
    ? Object.fromEntries(
        Object.entries(props).map(([key, prop]) => [
          key,
          {
            ...prop,
            type: prop.type,
            value:
              typeof prop.default === 'function'
                ? prop.default()
                : prop.default,
          },
        ]),
      )
    : undefined;

  return io || properties ? { ...io, ...properties } : undefined;
}

export function mergeOptions({
  name,
  props,
  properties,
  data,
  methods,
  emits,
  ...rest
}) {
  return {
    properties: toProperties(props, properties),
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
