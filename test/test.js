/**
 * Created by chaclus on 2017/2/15.
 */



var crypto = require('crypto');
var bigInt = require('big-integer');

/**
 * 解密方法
 * @param key      解密的key
 * @param crypted  密文
 * @returns string
 */
var decrypt = function (crypted, key) {
    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('AES-128-CBC', key, "0102030405060708");
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};

function aesEncrypt(text, secKey) {
    var cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708');
    return cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
}



function createSecretKey(size) {
    var keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var key = "";
    for (var i = 0; i < size; i++) {
        var pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key = key + keys.charAt(pos)
    }
    return key;
}


// var encrypt = 'XkY3If/1feQzcGK/i90iSPLif0wo/k/2QMuAmant100i/k+VkuVExZc9FJrThc4cvToIXSGp350PwV6uizVEbfqE5eC98I7UActmCXitrklORTT3QRmaGjL9+YdnEGl4GJVURoihKWrW4+9AZa88C1I4xaUSY35c/aiw/wGzNFSkgqgNu6qlbfirfas7Iq6K';
var encrypt = aesEncrypt('123456', 'cmr8hfTFhta9xg5M');
var key = createSecretKey(16);

var first = decrypt(encrypt, 'cmr8hfTFhta9xg5M');


function addPadding(encText, modulus) {
    var ml = modulus.length;
    for (i = 0; ml > 0 && modulus[i] == '0'; i++){
        ml--;
    }
    var num = ml - encText.length, prefix = '';
    for (var i = 0; i < num; i++) {
        prefix += '0';
    }
    return prefix + encText;
}



function rsaEncrypt(data, two, three) {
    var rText = '', radix = 16;
    for (var i = data.length - 1; i >= 0; i--){
        rText += data[i];
    }
    var biText = bigInt(new Buffer(rText).toString('hex'), radix);
    var biEx = bigInt(two, radix);
    var biMod = bigInt(three, radix);
    var biRet = biText.modPow(biEx, biMod);

    return biRet.toString(radix);
}


function rsaDecrypt(data, two, three) {
    var rText = '', radix = 16;
    for (var i = data.length - 1; i >= 0; i--){
        rText += data[i];
    }
    var biText = bigInt(new Buffer(rText).toString('hex'), radix);
    var biEx = bigInt(two, radix);
    var biMod = bigInt(three, radix);
    var biRet = biText.modPow(biEx, biMod);

    return biRet.toString(radix);
}

var one = "FFFFFFFFFFFFFFFF", two = "010001";
var three = "00adbdfwec";
console.log("rsa :::: " + rsaEncrypt(one,two,three));

