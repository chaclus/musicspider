/**
 * Created by chaclus on 2017/2/14.
 */

var low = require('lowdb');
var fileAsync = require('lowdb/lib/storages/file-async');

//歌单库初始化
const users = low('./db/user.json', {
    storage: fileAsync
});
users.defaults({users: []}).write();


exports.save = function (data) {

};