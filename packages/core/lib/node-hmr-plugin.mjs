import { spawn } from 'node:child_process';
import { join } from 'node:path';

/** The name of the plugin */
const PLUGIN_NAME = 'node-hmr-plugin';

/**
 * The class that manages Node app spawning and termination
 */
class AppLauncher {
  constructor(logger, restartOnExitCodes) {
    this.logger = logger;
    this.restartOnExitCodes = restartOnExitCodes;
  }

  terminateApp() {
    if (this.app) {
      this.app.kill('SIGTERM');
      this.app = null;
    }
  }

  runApp(appPath, cmd) {
    if (!this.app) {
      const args = cmd
        .split(' ')
        .map((str) => (str === '{app}' ? appPath : str));
      this.app = spawn(process.execPath, [...args], {
        stdio: [0, 1, 2],
        env: {
          ...process.env,
          LAST_EXIT_CODE: String(this.lastExitCode),
        },
      });

      this.logger.info(
        `${['node', ...args].join(' ')}, env: { LAST_EXIT_CODE: ${this.lastExitCode} }`,
      );

      this.app.on('exit', (exitCode) => {
        this.app = null;
        this.lastExitCode = exitCode;
        this.logger.info('Node app stopped, exit code:', exitCode);

        if (
          this.restartOnExitCodes &&
          this.restartOnExitCodes.includes(exitCode)
        ) {
          this.runApp(appPath, cmd);
        }
      });
    }
  }
}

/** Node HMR Webpack Plugin */
export class NodeHmrPlugin {
  constructor(options = {}) {
    this.options = {
      cmd: options.cmd || '{app}',
      restartOnExitCodes: options.restartOnExitCodes || [],
      logLevel: options.logLevel || 'info',
    };
    this.isWatching = false;
  }

  apply(compiler) {
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);

    this.launcher = new AppLauncher(
      logger,
      this.options.restartOnExitCodes || [],
    );

    compiler.hooks.watchClose.tap(PLUGIN_NAME, () => {
      this.launcher.terminateApp();
      this.isWatching = false;
    });

    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, (_, callback) => {
      this.isWatching = true;
      callback();
    });

    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      if (this.isWatching) {
        const outputFilename = compilation.chunks
          .values()
          .next()
          .value.files.values()
          .next().value;

        const appPath = join(compiler.outputPath, outputFilename);
        this.launcher.runApp(appPath, this.options.cmd);
      }

      callback();
    });
  }
}
