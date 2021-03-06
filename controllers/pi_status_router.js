const model = require('../model');

var fn_add = async (ctx, next) => {
    var
        cpu_temp = ctx.request.body.cpu_temp,
        gpu_temp = ctx.request.body.gpu_temp;
        battery_temp = ctx.request.body.battery_temp;
        
    ctx.response.type = 'application/json';    

    if (!cpu_temp && !gpu_temp && !battery_temp) {
        ctx.response.body = {
            code: "0",
            message: "数据为空"
        };
        return;
    }    
    
    let Pi = model.pi_satus;
    var obj = await Pi.create({
        cpu_temp: cpu_temp,
        gpu_temp: gpu_temp,
        battery_temp: battery_temp
    });
    ctx.response.body = obj;
};

var fn_time_search = async (ctx, next) => {

    if (typeof ctx.request.body.start_time != "string" || typeof ctx.request.body.end_time != "string") {
        ctx.response.body = { message: "格式错误" };
        return;
    }

    var start_time = new Date(ctx.request.body.start_time).getTime();
    var end_time = new Date(ctx.request.body.end_time).getTime();

    let Pi = model.pi_satus;
    var objs = await Pi.findAll({
        where: {
            created_time: {
                $gte: start_time,
                $lte: end_time
            }
        }
    })

    ctx.response.body = objs;
}

var fn_time_countSearch = async (ctx, next) => {

        let Pi = model.pi_satus;
        var objs = await Pi.findAll({
            where: {
                created_time: {
                    $gte: +ctx.request.body.start_time,
                    $lte: +ctx.request.body.end_time
                }
            }
        })
    
        ctx.response.body = objs;
    }

var fn_list = async (ctx, next) => {
    let Pi = model.pi_satus;

    ctx.response.type = 'application/json';

    let page = ctx.request.query.page;
    console.log(ctx.request.query)
    if (!isNaN(page)) {
        const pageNum = 30;
        var objs = await Pi.findAll({
            limit: pageNum,
            offset: pageNum * page,
            order: [[ 'created_time', 'DESC' ]]
        });

        ctx.response.body = objs.sort((obj1, obj2) => obj1.created_time > obj2.created_time);
    } else {
        var objs = await Pi.findAll({ limit: 100, order: [[ 'created_time', 'DESC' ]] });
        ctx.response.body = objs.sort((obj1, obj2) => obj1.created_time > obj2.created_time);
    }
}



module.exports = {
    'POST /api/pi/status': fn_add,
    'GET /api/pi/status': fn_list,
    'POST /api/pi/search': fn_time_search,
    'POST /api/pi/time_search': fn_time_countSearch
};