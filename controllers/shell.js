var shell = require('shelljs');
var fs = require('fs');

function executeShell() {
    return new Promise((resolve, reject) => {
        fs.readFile("./natapp.sh", "utf-8", (err, data) => {
            if (err) {
                reject("读取脚本失败");
            } else {
                console.log('正在执行脚本');
                var result = shell.exec(data);
                console.log('执行完毕');
                resolve(result.stdout);
            }
        });
    });
}

var fn_shell = async (ctx, next) => {
    let result = await executeShell();
    ctx.response.body = `<pre>${result}</pre>`;
};

module.exports = {
    'GET /shell': fn_shell,
};