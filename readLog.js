var fs = require('fs');

// require('shelljs/global');
var httpReg = new RegExp(`(https?)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`, "g");
var tcpReg = new RegExp(`(tcp)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`, "g");

function searchAria2Url (fileName) {
    return new Promise((resolve, reject) => {
        var path = "/home/pi/Desktop/";
        var name = fileName || "natapp.out";
        fs.readFile(path + name, 'utf-8', function (err, data) {
            if (err) {
                reject('查询失败');
            } else {
                resolve({
                    "httpUrl": data.match(httpReg).pop(),
                    "tcpUrl": data.match(tcpReg).pop()
                });
            }
        });
    });
}

module.exports = {
    "searchUrlPromise": searchUrlPromise
}