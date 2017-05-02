/**
 * Created by chaclus on 2017/2/15.
 */

var kue = require('kue');
var request = require("request");
var cheerio = require("cheerio");
var EventProxy = require('eventproxy');

var config = require('../config');
var OrderProxy = require('../service/Order');
var MusicProxy = require('../service/Music');

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


var getMusicContent = function (music, callback) {
    var order_url = 'http://music.163.com' + music.href;
    console.log(order_url);

    request ({
        url: order_url,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        } //给个浏览器头，不然网站拒绝访问
    }, function(error, response, body) {
        if(!error) {
            var $ = cheerio.load(body);

            //parse order info
            parseOrderInfo(music.id, $, function (err, data) {
                if(err || !data) {
                    console.error("ERR musicSpider.getMusic > parseOrderInfo > ", err);
                    callback(err, null);
                }else{
                    //parse music list
                    parseMusicList($, function (err, ret) {
                        if(err || !ret) {
                            console.error("ERR musicSpider.getMusic > parseMusicList > ", err);
                            callback(err, null);
                        }else{
                            callback(null, true);
                        }
                    });
                }
            });
        }else{
            callback(error, null);
        }
    });
};


//解析歌单
var parseOrderInfo = function (id, $, callback) {
    //order info
    var orderInfo = $('.cntc').children();

    //时间 评论数 收藏 标签 描述 歌曲数 播放次数
    // var time = orderInfo.find('span').eq(1)[0].children[0].data;
    var time = $('.user').find('span')[1].children[0].data
    var num_comment = parseInt(orderInfo.find('span').eq(2)[0].children[0].data);
    var num_follow = $('.u-btni-fav').children('i').text().match(/\d+/)[0];
    var tags = [];
    for(var i=0;i<$('.u-tag').find('i').length;i++) {
        tags.push($('.u-tag').find('i')[i].children[0].data)
    }
    var desc = $('#album-desc-more').text();
    var num_music = parseInt($('#playlist-track-count').text());
    var play_count = $('#play-count').text();
    var order = {
        time: time.substring(0, 10),
        num_comment: num_comment ? num_comment : 0,
        num_follow: parseInt(num_follow),
        num_music: num_music,
        play_count: parseInt(play_count),
        tags: tags
    };

    OrderProxy.updateById(id, order, function (err, data) {
        callback(err, data);
    });
};

var parseMusicList = function ($, callback) {
    var ep = new EventProxy();
    ep.fail(function (err) {
        if(err) {
            console.error("ERR musicSpider.parseMusicList > ", err);
            callback(err, null);
        }
    });
    var lis = $('#song-list-pre-cache').children('ul')[0].children;
    lis.forEach(function (li) {
        var href = li.children[0].attribs.href;
        var name = li.children[0].children[0].data;

        MusicProxy.save({id:href.match(/\d+/)[0],href: href, name: name}, function (err, data) {
            ep.emit("result");
        });
    });

    ep.after("result", lis.length, function () {
        callback(null, true);
    });
};



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


//test
// exports.listen();
/*
getMusic({
    "title": "知乎的朋友让我看到你们的荧光棒！",
    "href": "/playlist?id=590785294",
    "img": "http://p3.music.126.net/XH2UX7XO2Et2vLonyCE7sA==/109951162855417315.jpg?param=140y140",
    "auth": "蛋蛋Mc",
    "auth_url": "/user/home?id=7660015",
    "id": 1487051870373,
    "time": "2017-02-04",
    "num_comment": 38,
    "num_follow": 350,
    "num_music": 12,
    "play_count": 3505,
    "tags": [
        "欧美",
        "放松",
        "兴奋"
    ]
})
    */