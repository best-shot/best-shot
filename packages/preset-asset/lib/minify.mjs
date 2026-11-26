import gif from '@volue/wasm-codecs-gifsicle';

// `MinimizerPlugin.napiRsImageMinify` handles avif/jpeg/jpg/png/webp via its
// own `filter`. GIF is left here because @napi-rs/image does not support it.
export async function gifMinify(input) {
  const [code] = Object.values(input);

  try {
    const result = await gif(code, { interlaced: true });

    return { code: result.length < code.length ? result : code };
  } catch (error) {
    return { code, errors: [error] };
  }
}

gifMinify.filter = (name) => /\.gif$/i.test(name);
gifMinify.supportsBinary = () => true;
// A native addon cannot cross the worker boundary, so keep it in-process
// (same as napiRsImageMinify).
gifMinify.supportsWorker = () => false;
gifMinify.supportsWorkerThreads = () => false;
