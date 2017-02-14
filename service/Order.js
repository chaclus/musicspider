/**
 * Created by chaclus on 2017/2/14.
 */


var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

var ORDER_DB_NAME = "sheets";

//歌单库初始化
const orders = low('./db/sheet.json', {
    storage: fileAsync
});
orders.defaults({sheets: []}).write();


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
