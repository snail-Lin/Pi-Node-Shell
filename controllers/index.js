const model = require('../model');
var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};

var fn_signin = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
};

var fn_test = async (ctx, next) => {
    // ctx.response.body = {name: 'lin',sfasdf: 'fsa'};
    var cpu_temp = ctx.request.body.cpuTemp
    let Status = model.Status

    let result 
    await Status.findAll().then(function (pets) {
        result = pets
    })
    
    ctx.response.body = pets
    
};

module.exports = {
    'GET /': fn_index,
    'GET /test': fn_test,
    'POST /signin': fn_signin
};