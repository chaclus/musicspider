/**
 * Created by chaclus on 2017/2/14.
 */


var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var MUSIC_DB_NAME = "musics";

//歌曲库初始化
const musics = low('./db/music.json', {
    storage: fileAsync
});
musics.defaults({musics: []}).write();


exports.save = function (data) {
    var size = musics.get(MUSIC_DB_NAME).filter({href: data.href}).size().value();
    if(size > 0){
        return;
    }
    musics.get(MUSIC_DB_NAME)
        .push(data)
        .last()
        .assign({id: Date.now()})
        .write();
};



