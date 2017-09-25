const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// 导入controller middleware:
const controller = require('./controller');
const isProduction = process.env.NODE_ENV === 'production';
const templating = require('./templating.js');
const model = require('./model');

const path = require('path')
const log4js = require('koa-log4');
const appDir = path.resolve(__dirname, '.')
const logDir = path.join(appDir, 'logs')
const logger = log4js.getLogger('app')

try {
    require('fs').mkdirSync(logDir)
  } catch (e) {
    if (e.code != 'EEXIST') {
      console.error('Could not set up log directory, error was: ', e)
      process.exit(1)
    }
  }

log4js.configure(path.join(appDir, 'log4js.json'), { cwd: logDir })


app.use(log4js.koaLogger(log4js.getLogger("http"), { level: 'auto' }))
//记录URL以及页面执行时间
app.use(async (ctx, next) => {
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;

    ctx.response.set('X-Response-Time', `${execTime}ms`);
    
    logger.info(`${ctx.method} ${ctx.url} - ${execTime}ms`);
    logger.info(JSON.stringify(ctx.request.body));
    logger.info(JSON.stringify(ctx.response.body));
});

//处理静态文件
if (!isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

//解析POST请求
app.use(bodyParser());

//使用Nunjucks
app.use(templating('view', {
    noCache: !isProduction,
    watch: !isProduction
}));

//处理URL路由
app.use(controller());

app.on('error', function (err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
  })

app.listen(10001);

console.log('app started at port 10001...');