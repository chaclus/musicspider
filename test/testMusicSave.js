/**
 * Created by chaclus on 2017/2/15.
 */
var MusicProxy = require('../service/Music');


var testSave = function () {

    MusicProxy.save({id: '11111', name: 'test', href: 'http://www.baidu.com'}, function (err, data) {
        if(err) {
            console.error(err);
        }else{
            console.log(data);
        }
    });
};
testSave();