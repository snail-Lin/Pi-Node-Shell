// 创建一个Koa对象表示web app本身:
const Koa =  require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const rest = require('./rest');
const axios = require('axios')


// 导入controller middleware:
const controller = require('./controller');
const isProduction = process.env.NODE_ENV === 'production';
const templating = require('./templating.js');
const model = require('./model');


const log4js = require('./logger')();
const logger = log4js.getLogger('app')

axios.post('http://wect.haidilao.com/hdl_market/rs/inner/appCommonRest/toQueryInfoPage', {
    
}).then(function(response) {
    console.log(response)
}).catch(function(error) {
    console.log(response)
})

app.use(cors({
  origin: function (ctx) {
      return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

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

//解析POST请求,赋值body
app.use(bodyParser());

//使用Nunjucks
app.use(templating('view', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(rest.restify());

//处理URL路由
app.use(controller());

app.on('error', function (err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
  })

app.listen(10001);

console.log('app started at port 10001...');