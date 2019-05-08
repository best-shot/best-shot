'use strict';

const connectHistoryApiFallback = require('connect-history-api-fallback');
const convert = require('koa-connect');
const foreach = require('lodash/forEach');
const httpProxyMiddleware = require('http-proxy-middleware');
const koaError = require('koa-error');
const koaMount = require('koa-mount');
const koaStatic = require('koa-static');
const weblog = require('webpack-log');
const webpackServe = require('webpack-serve');
const webpackServeWaitPage = require('webpack-serve-waitpage');
const { resolve } = require('path');
const { green } = require('chalk');

const log = weblog({ name: 'serve' });

function proxyLogProvider(provider) {
  const logger = weblog({ name: 'proxy' });
  return Object.keys(provider).reduce(
    (io, key) => ({
      ...io,
      [key]: (str, ...args) =>
        logger[key](str.replace(/^\[HPM\]\s/, ''), ...args)
    }),
    {}
  );
}

function wrapProxy(context, options) {
  return convert(
    httpProxyMiddleware(context, {
      ...options,
      logProvider: proxyLogProvider
    })
  );
}

function historyFallback({ publicPath }) {
  log.info('History api fallback is enable');
  return convert(
    connectHistoryApiFallback({
      htmlAcceptHeaders: ['text/html'],
      rewrites: [
        {
          from: new RegExp(`${publicPath}.*`),
          to: ({ parsedUrl: { pathname } }) =>
            (/\.[0-9a-z]+$/.test(pathname) ? pathname : `${publicPath}index.html`)
        }
      ]
    })
  );
}

function wrapStatic(publicPath, content) {
  if (publicPath !== '/') {
    return koaMount(publicPath, koaStatic(content));
  }
  return koaStatic(content);
}

module.exports = function server({
  devServer: {
    host,
    port,
    hotOnly,
    hot,
    proxy,
    contentBase,
    headers,
    publicPath,
    clientLogLevel,
    https,
    writeToDisk
  } = {},
  stats,
  ...webpackConfig
}) {
  webpackServe(
    {},
    {
      config: webpackConfig,
      clipboard: false,
      host,
      port,
      https,
      content: resolve(__dirname, '../empty'),
      devMiddleware: {
        publicPath,
        logLevel: clientLogLevel,
        headers,
        stats,
        writeToDisk
      },
      hotClient: hot
        ? {
          logLevel: clientLogLevel,
          reload: !hotOnly
          // allEntries: true
        }
        : false,
      add: (app, middleware, options) => {
        app.use(webpackServeWaitPage(options, { title: 'Please wait' }));
        middleware.webpack();
        log.info(
          `Webpack output is served from ${green(
            publicPath.replace(/\/$/, '')
          )}`
        );
        if (contentBase) {
          (Array.isArray ? contentBase : [contentBase]).forEach(dir => {
            app.use(wrapStatic(publicPath, dir));
          });
          log.info(
            `Serving static content from: ${green(contentBase.join(','))}`
          );
        }
        if (proxy) {
          foreach(proxy, (option, root) => {
            app.use(wrapProxy(root, option));
          });
        }
        app.use(historyFallback({ publicPath }));
        app.use(
          koaError({
            template: resolve(__dirname, 'error-page.ejs')
          })
        );
        middleware.content();
      }
    }
  );
};
