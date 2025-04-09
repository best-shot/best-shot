function toProperties(props, properties) {
  const io = props
    ? Object.fromEntries(
        Object.entries(props).map(([key, prop]) => [
          key,
          prop.type
            ? {
                ...prop,
                type: prop.type,
                value:
                  typeof prop.default === 'function'
                    ? prop.default()
                    : prop.default,
              }
            : { type: prop },
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
  created,
  beforeCreate,
  ...rest
}) {
  return {
    ...rest,
    properties: toProperties(props, properties),
    data: typeof data === 'function' ? data() : data,
    methods: {
      $emit(event, ...args) {
        this.triggerEvent(event, ...args);
      },
      ...methods,
    },
    created(...options) {
      if (beforeCreate) {
        beforeCreate.apply(this, options);
      }

      if (created) {
        created.apply(this, options);
      }

      Object.defineProperties(this, {
        props: {
          enumerable: true,
          configurable: false,
          get() {
            return this.properties;
          },
        },
        $props: {
          enumerable: true,
          configurable: false,
          get() {
            return this.properties;
          },
        },
      });
    },
  };
}
