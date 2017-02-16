/**
 * Created by chaclus on 2017/2/15.
 */

var kue = require('kue');
var request = require("request");
var cheerio = require("cheerio");

var config = require('../config');
var OrderProxy = require('../service/Order');

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

var getMusicList = function (url, callback) {
    console.log(url);
    request ({
        url: url,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        }
    }, function(error, response, body) {
        if(error) {
            callback(error, null);
        }else{
            var $ = cheerio.load(body);
            var uls = $("#m-pl-container").children();
            for(var i=1; i < uls.length; i++) {
                var li = uls.eq(i);
                var title = uls.eq(i).children('div').children('a').attr('title');
                var href = uls.eq(i).children('div').children('a').attr('href');
                var img = uls.eq(i).children('div').children('img').attr('src');
                var auth_url = uls.eq(i).find('.s-fc3').attr('href');
                var auth = uls.eq(i).find('.s-fc3').attr('title');

                var order = {
                    id: href.match(/\d+/)[0],
                    title: title,
                    href: href,
                    img: img,
                    auth: auth,
                    auth_url: auth_url
                };

                OrderProxy.save(order, function (err, data) {
                    if(err || !data) {
                        callback(err, null);
                    }else{
                        callback(null, data);
                    }
                });
            }
        }
    });
};


exports.listen = function () {
    queue.process(config.queue.url_name, function (job, done) {
        var order = job.data;
        if(order) {
            getMusicList(order.url, function (err, ret) {
                if(err) {
                    console.log("ERR getMusicList ", err);
                }
                done();
            });
        }else{
            console.warn("illegal params at orderListener.");
        }

    });
};