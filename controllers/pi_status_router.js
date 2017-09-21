const model = require('../model');

var fn_add = async (ctx, next) => {
    var
        cpu_temp = ctx.request.body.cpu_temp,
        gpu_temp = ctx.request.body.gpu_temp;
        
    ctx.response.type = 'application/json';    

    if (!cpu_temp && !gpu_temp) {
        ctx.response.body = {
            code: "0",
            message: "数据为空"
        };
        return;
    }    
    
    let Pi = model.pi_satus;
    var obj = await Pi.create({
        cpu_temp: cpu_temp,
        gpu_temp: gpu_temp
    });
    ctx.response.body = obj;
};

var fn_list = async (ctx, next) => {
    let Pi = model.pi_satus;

    ctx.response.type = 'application/json';

    page = +ctx.request.query.page;
    console.log(ctx.request.query)
    if (typeof page === 'number') {
        var objs = await Pi.findAll({
            limit: 7,
            offset: 7 * page
        });
        ctx.response.body = objs;
    } else {
        var objs = await Pi.findAll({ limit: 100 });
        ctx.response.body = objs;
    }
}


module.exports = {
    'POST /api/pi/status': fn_add,
    'GET /api/pi/status': fn_list
};