/**
 * Created by chaclus on 2017/2/15.
 */

var config = {
    queue:{
        url_name: 'm_url',
        order_name: 'm_order',
        music_name: 'm_music'
    },
    redis: {
        host: '192.168.3.30',
        port: 6379,
        pass: 'TUTU@live2016'
    },
    mongodb: {
        url: 'mongodb://192.168.3.30:27017/ms',
    }
};

module.exports = config;