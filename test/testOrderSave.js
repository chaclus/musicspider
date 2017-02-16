/**
 * Created by chaclus on 2017/2/15.
 */
var OrderProxy = require('../service/Order');


var testSave = function () {

    OrderProxy.save({
        "title": "[和风电音] 樱华乱舞 电子节奏中的传统风韵",
        "href": "/playlist?id=111111111",
        "img": "http://p4.music.126.net/BgoVkGnNASmbrI5wNh3f9A==/18593841138970626.jpg?param=140y140",
        "auth": "漆黑丶烈焰使",
        "auth_url": "/user/home?id=97412802",
        "id": 111111111,
        "time": "2016-12-07",
        "num_comment": 0,
        "num_follow": 0,
        "num_music": 0,
        "play_count": 0,
        "tags": [
            "日语",
            "电子",
            "古风"
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