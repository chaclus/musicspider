/**
 * Created by chaclus on 2017/2/15.
 */
var OrderProxy = require('../service/Order');


var testSave = function () {

    OrderProxy.updateById("529805171",{
        "title": "樱华乱舞",
        "href": "/playlist?id=529805171",
        "img": "http://p4.music.126.net/BgoVkGnNASmbrI5wNh3f9A==/18593841138970626.jpg?param=140y140",
        "auth": "漆黑丶烈焰使",
        "auth_url": "/user/home?id=97412802",
        "time": "2016-12-07",
        "num_comment": 1,
        "num_follow": 1,
        "num_music": 1,
        "play_count": 1,
        "tags": [
            "日语",
            "电子"
        ]
    }, function (err, data) {
        if(err) {
            console.error(err);
        }else{
            console.log(data);
        }
    });
};
testSave();