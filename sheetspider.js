/**
 * Created by chaclus on 2017/2/14.
 */

// var fs = require("fs");

var request = require("request");
var cheerio = require("cheerio");
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

const db = low('./db/sheet.json', {
    storage: fileAsync
});
db.defaults({sheets: []}).write();


var getMusic = function (url) {
    console.log(url);
    request ({
        url: url,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
        }
    }, function(error, response, body) {
        if(!error) {
            var $ = cheerio.load(body);
            var uls = $("#m-pl-container").children();
            for(var i=1; i < uls.length; i++) {
                var li = uls.eq(i);
                var title = uls.eq(i).children('div').children('a').attr('title');
                var href = uls.eq(i).children('div').children('a').attr('href');
                var img = uls.eq(i).children('div').children('img').attr('src');
                var auth_url = uls.eq(i).find('.s-fc3').attr('href');
                var auth = uls.eq(i).find('.s-fc3').attr('title');

                var music_sheet = {
                    title: title,
                    href: href,
                    img: img,
                    auth: auth,
                    auth_url: auth_url
                };

                saveToDB(music_sheet);
            }
        }
    });
};


var saveToDB = function (data) {
    //判断去除重复
    var size = db.get('sheets').filter({href: data.href}).size().value();
    if(size > 0){
        return;
    }
    db.get('sheets')
        .push(data)
        .last()
        .assign({id: Date.now()})
        .write();
};


var base_url = 'http://music.163.com/discover/playlist/';
var getHotMusicSheetByUrl = function () {
    var num = 0, max = 1435;
    var suffix = '?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=';
    for(var i=0;i<max;i=i+35) {
        var url = base_url + suffix + i;
        getMusic(url);
    }
};

getHotMusicSheetByUrl();