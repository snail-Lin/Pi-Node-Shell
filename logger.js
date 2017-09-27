const path = require('path')
const log4js = require('koa-log4');
const appDir = path.resolve(__dirname, '.')
const logDir = path.join(appDir, 'logs')
const logger = log4js.getLogger('app')

function logBegin() {
    try {
        require('fs').mkdirSync(logDir);
      } catch (e) {
        if (e.code != 'EEXIST') {
          console.error('Could not set up log directory, error was: ', e);
          process.exit(1);
        }
      }
    
    log4js.configure(path.join(appDir, 'log4js.json'), { cwd: logDir });
    return log4js;
}

module.exports = logBegin;