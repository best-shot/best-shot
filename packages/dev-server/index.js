'use strict';

const connectHistoryApiFallback = require('connect-history-api-fallback');
const convert = require('koa-connect');
const foreach = require('lodash/forEach');
const httpProxyMiddleware = require('http-proxy-middleware');
const koaError = require('koa-error');
const weblog = require('webpack-log');
const webpackServe = require('webpack-serve');
const webpackServeWaitPage = require('webpack-serve-waitpage');
const { resolve } = require('path');

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

function historyFallback(options) {
  log.info('History api fallback is enable');
  const opts = options === true ? undefined : options;
  return convert(connectHistoryApiFallback(opts));
}

module.exports = function server({
  devServer: {
    clientLogLevel,
    contentBase,
    headers,
    historyApiFallback,
    host,
    hot,
    hotOnly,
    https,
    port,
    proxy,
    publicPath,
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
      content:
        Array.isArray(contentBase) && contentBase.length > 0
          ? contentBase
          : contentBase || resolve(__dirname, '../empty'),
      devMiddleware: {
        publicPath,
        logLevel: clientLogLevel,
        headers,
        stats,
        writeToDisk
      },
      hotClient: hot ? { logLevel: clientLogLevel, reload: !hotOnly } : false,
      add: (app, middleware, options) => {
        middleware.content();
        if (proxy) {
          foreach(proxy, (option, root) => {
            app.use(wrapProxy(root, option));
          });
        }
        app.use(webpackServeWaitPage(options, { title: 'Please wait' }));
        log.info(`Webpack output is served from ${publicPath}`);
        middleware.webpack();
        if (historyApiFallback) {
          app.use(historyFallback(historyApiFallback));
        }
        app.use(
          koaError({
            template: resolve(__dirname, 'error-page.ejs')
          })
        );
      }
    }
  );
};
