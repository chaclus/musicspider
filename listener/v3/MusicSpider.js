/**
 * Created by chaclus on 2017/3/31.
 */
var kue = require('kue');
var request = require('request');

var config = require('../../config');
var Crypto = require('../../lib/Crypto');
var MusicProxy = require('../../service/Music');
var ArtistProxy = require('../../service/Artist');


//init redis of kue dependency
var queue = kue.createQueue({
    prefix: 'kue_q',
    redis: {
        port: config.redis.port,
        host: config.redis.host,
        auth: config.redis.pass,
        db: 0,
    }
});

exports.listen = function () {
    queue.process(config.queue.order_name, function (job, done) {
        getMusic(job.data, function (err, ret) {
            if(err) {
                console.log("ERR getMusic ", err);
            }
            done();
        });
    });
};

var getMusic = function (callback) {
    var first_param = {
        "id": '329154267',
        "offset": 0,
        "total": true,
        "limit": 1000,
        "n": 1000,
        "csrf_token": ''
    };

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
        if(error) {
            callback(null, null);
        }else{
            try{
                parseMusicList(JSON.parse(body), function (err, ret) {

                });
            }catch (e){
                callback(e, null);
            }
        }
    });
};


var parseMusicList = function (data, callback) {
    var tracks = data.playlist.tracks;
    console.log('music list len : ' + tracks.length);
    tracks.forEach(function (m) {
        MusicProxy.save({id: m.id, name: m.name}, function (err, ret) {
            if(err) {
                console.error("failed to update music, id:" + m.id, err);
            }
        });
        if(m.ar && m.ar.length > 0) {
            m.ar.forEach(function (ar) {
                ArtistProxy.save({id: ar.id, name: ar.name}, function (err, ret) {
                    if(err) {
                        console.error(" failed to update artist, id:" + ar.id, err);
                    }
                });
            });
        }
    });
    callback(null, null);
};

getMusic(function (err, ret) {


});
