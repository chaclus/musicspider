/**
 * Created by chaclus on 2017/2/14.
 */

/*
var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var ORDER_DB_NAME = "sheets";

//歌单库初始化
const orders = low('../db/sheet.json', {
    storage: fileAsync
});
orders.defaults({sheets: []}).write();


exports.getAll = function (callback) {
    try{
        callback(null, orders.get(ORDER_DB_NAME).value())
    }catch (e){
        callback(e, null);
    }
};
exports.save = function (data) {
    var size = orders.get(ORDER_DB_NAME).filter({href: data.href}).size().value();
    if(size > 0){
        return;
    }
    orders.get(ORDER_DB_NAME)
        .push(data)
        .last()
        .assign({id: Date.now()})
        .write();
};


exports.updateById = function (id, data) {
    orders.get(ORDER_DB_NAME)
        .find({id: id})
        .assign(data)
        .write();
};

exports.updateByQuery = function (query, data) {
    orders.get(ORDER_DB_NAME)
        .find(query)
        .assign(data)
        .write();
};
*/
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>mongoose<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

var Order = require('../models').Order;

exports.getAll = function (callback) {
    Order.find({}, callback);
};


exports.save = function (data, callback) {
    Order.findOne({id: data.id}, function (err, ret) {
        if(err) {
            callback(err, null);
        }else if(ret) {
            //music existed
            callback(null, null);
        }else{
            var doc = new Order({
                id: data.id,
                title: data.title,
                href: data.href,
                img: data.img,
                author: data.author,
                author_url: data.author_url,
                time: data.time,
                num_comment: data.num_comment,
                num_follow: data.num_follow,
                num_music: data.num_music,
                play_count: data.play_count,
                tags: data.tags
            });
            doc.save(callback);
        }
    });
};

exports.updateById = function (id, data, callback) {
    Order.findOne({id: id}, function (err, order) {
        if(err || !order) {
            callback(err, null);
        }else{
            for(var key in data) {
                order[key] = data[key];
            }

            order.save(callback);
        }
    });
};