/**
 * Created by chaclus on 2017/2/16.
 */
var request = require("request");
var cheerio = require("cheerio");
var Crypto = require('../lib/Crypto');

//params
var first_param = {
    "id": '329154267',
    "offset": 0,
    "total": true,
    "limit": 1000,
    "n": 1000,
    "csrf_token": ''
};


var getMusic = function (callback) {
    var url = "http://music.163.com/weapi/v3/playlist/detail?csrf_token=";
    var params = Crypto.aesRsaEncrypt(JSON.stringify(first_param));
    console.log(params);
    request ({
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        },
        form: params
    }, function(error, response, body) {
        if(!error) {

            callback(null, body);
        }else{
            callback(error, null);
        }
    });
};


getMusic(function (err, data) {
    if(err) {
        console.error(err);
    }else {
        console.log(data);
    }
});