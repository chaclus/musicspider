/**
 * Created by chaclus on 2017/2/14.
 */
var kue = require('kue');
var config = require('./config');


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


var orderListener = require('./listener/OrderSpiderListener');
orderListener.listen();

var base_url = 'http://music.163.com/discover/playlist/';


var addJob = function (order) {
    var job = queue.create(config.queue.url_name, order).save(function (err) {
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

var getHotMusicSheetByUrl = function () {
    var num = 0, max = 1435;
    var suffix = '?order=hot&cat=%E5%85%A8%E9%83%A8&limit=35&offset=';
    for(var i=0; i<max; i=i+35) {
        var url = base_url + suffix + i;
        addJob({url: url});
    }
};

getHotMusicSheetByUrl();