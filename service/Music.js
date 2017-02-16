/**
 * Created by chaclus on 2017/2/14.
 */

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>lowdb<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
/*
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var MUSIC_DB_NAME = "musics";

//歌曲库初始化
const musics = low('../db/music.json', {
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
*/

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mongoose<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
var Music = require('../models').Music;


exports.save = function (data, callback) {

    Music.findOne({id: data.id}, function (err, ret) {
        if(err) {
            callback(err, null);
        }else if(ret) {
            //music existed
            callback(null, null);
        }else{
            var doc = new Music({
                id: data.id,
                name: data.name,
                href: data.href
            });
            doc.save(callback);
        }
    });
};