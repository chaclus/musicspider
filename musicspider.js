/**
 * Created by chaclus on 2017/2/14.
 */

// var fs = require("fs");
var kue = require('kue');

var config = require('./config');
var OrderProxy = require('./service/Order');


//init redis of kue dependency
var queue = kue.createQueue({
    prefix: 'kue_q',
    redis: {
        port: config.redis.port,
        host: config.redis.host,
        auth: config.redis.pass,
        db: 0
    }
});


var musicListener = require('./listener/MusicSpiderListener');
musicListener.listen();


var addJob = function (order) {
    var job = queue.create(config.queue.order_name, order).save(function (err) {
        if(err) {
            console.error("ERR save job to queue at addJob mth.", err);
        }else{
            console.log(config.queue.order_name + " > Add job success : ", job.id);
        }
    });

    job.on('complete', function (result) {
        console.log(config.queue.order_name + '> Job completed ');
    }).on('failed attempt', function (errorMessage, doneAttempts) {
        console.log(config.queue.order_name + '> attempt job failed');

    }).on('failed', function (errorMessage) {
        console.log(config.queue.order_name + '> Job failed');

    }).on('progress', function (progress, data) {
        console.log(config.queue.order_name + '> progress #### ' + job.id + ' ' + progress + '% complete with data ', data);
    });
};

var songList = function () {
    OrderProxy.getAll(function (err, orders) {
        if(err) {
            console.error("ERR OrderProxy.getAll", err);
        }else{
            orders.forEach(function (order) {
                addJob(order);
            });
        }
    });
};

songList();

