/**
 * Created by chaclus on 2017/2/14.
 */

// var fs = require("fs");

var request = require("request");
var cheerio = require("cheerio");
var EventProxy = require('eventproxy');
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var OrderProxy = require('./service/Order');
var MusicProxy = require('./service/Music');

//歌单库初始化
const sheets = low('./db/sheet.json', {
    storage: fileAsync
});
sheets.defaults({sheets: []}).write();


var ep = new EventProxy();
ep.fail(function (err) {
    if(err) {
        console.error("ep err > ", err);
    }
});

var getMusic = function (order, callback) {
    var order_url = 'http://music.163.com' + order.href;
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
            parseOrderInfo(order.id, $);

            //parse music list
            parseMusicList($, function (err, ret) {
               ep.emit("result")
            });

            ep.on('result', function () {
                callback(null, true);
            });

        }else{
            callback(error, null);
        }
    });
};


//解析歌单
var parseOrderInfo = function (id, $) {
    //order info
    var orderInfo = $('.cntc').children();

    //时间 评论数 收藏 标签 描述 歌曲数 播放次数
    var time = orderInfo.find('span').eq(1)[0].children[0].data;
    var num_comment = orderInfo.find('span').eq(2)[0].children[0].data;
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
        num_comment: parseInt(num_comment),
        num_follow: parseInt(num_follow),
        num_music: num_music,
        play_count: parseInt(play_count),
        tags: tags
    };

    OrderProxy.updateByQuery({id: id}, order);
};

var parseMusicList = function ($, callback) {
    var lis = $('#song-list-pre-cache').children('ul')[0].children;
    lis.forEach(function (li) {
        var href = li.children[0].attribs.href;
        var name = li.children[0].children[0].data;

        MusicProxy.save({href: href, name: name});

        ep.emit('save_music_list');
    });

    ep.after("save_music_list", lis.length, function () {
        callback(null, true);
    });
};



var songList = function () {
    sheets.get('sheets').value().forEach(function (order) {
        getMusic(order);
    });
};

songList();

/*
getMusic({
    "title": "2017年1月-3月新番OP&ED（装修中)",
    "href": "/playlist?id=536359367",
    "img": "http://p3.music.126.net/EGHx4hVY-_TXC8gRwNDP3g==/18516875325064826.jpg?param=140y140",
    "auth": "Erc丶凌乱",
    "auth_url": "/user/home?id=61759420",
    "id": 1487051872497
});*/