import { readFileSync } from 'node:fs';

// 模拟微信小程序的 WXS 特性
const preload = `
function getRegExp(pattern, flags) {
  return new RegExp(pattern, flags);
}
`;

export async function load(url, context, nextLoad) {
  if (url.endsWith('.wxs')) {
    const source = readFileSync(new URL(url), 'utf8');

    return {
      format: 'commonjs',
      source: preload + source.replaceAll("'Array'", 'Array'),
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}

// import { createRequire } from 'node:module';
// import { pathToFileURL } from 'node:url';

// export async function resolve(specifier, context, nextResolve) {
//   if (specifier.endsWith('.wxs')) {
//     const { href } = pathToFileURL(
//       createRequire(context.parentURL).resolve(specifier),
//     );
//     return {
//       url: href,
//       format: 'commonjs',
//       shortCircuit: true,
//     };
//   }
//   return nextResolve(specifier, context);
// }
