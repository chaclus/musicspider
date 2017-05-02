/**
 * Created by chaclus on 2017/2/15.
 */
var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.url,{keepAlive: 10}, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
    console.log("db success")
});

//models
require('./Music');
require('./Order');
require('./Artist');



exports.Order            = mongoose.model('MsOrder');
exports.Music            = mongoose.model('MsMusic');
exports.Artist            = mongoose.model('MsArtist');
