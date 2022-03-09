const pako = require('pako')
const atob = require('atob')
const btoa = require('btoa')


var fn_decode = async (ctx, next) => {
    var obj = ctx.request.body.message;
    var unzipObj = unzip(obj);
    var result = JSON.parse(unzipObj);  
    ctx.response.body = result;
}

var fn_request = async (ctx, next) => {
    var obj = ctx.request.body.obj;
    var objStr = JSON.stringify(obj);
    var requestStr = zip(objStr);
    var rp = require('request-promise');

    var options = {
        method: 'POST',
        uri: 'http://172.16.149.183:9090/HDLServer/commonRequest/commonRequestAction',
        form: {
            // Like <input type="text" name="name">
            requestMessage: requestStr
        },
        headers: {
            /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
        }
    };

    var result = await rp(options);

    var unzipObj = unzip(result);
    var result = JSON.parse(unzipObj);
    ctx.response.body = result;
}

function unzip(b64Data){  
    var strData     = atob.atob(b64Data);  
      
    // Convert binary string to character-number array  
    var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});  
  
  
    // Turn number array into byte-array  
    var binData     = new Uint8Array(charData);  
  
  
    // // unzip  
    var data        = pako.inflate(binData);  
  
  
    // Convert gunzipped byteArray back to ascii string:  
    strData     = String.fromCharCode.apply(null, new Uint16Array(data));  
    return strData;  
}  
  
  
function zip(str){  
    var binaryString = pako.gzip(str, { to: 'string' });  
      
    return btoa(binaryString);  
}

module.exports = {
    'POST /api/pad/decode': fn_decode,
    'POST /api/pad/request': fn_request
}