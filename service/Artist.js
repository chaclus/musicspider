
var Artist = require('../models').Artist;


exports.save = function (data, callback) {
    Artist.findOne({id: data.id}, function (err, ret) {
        if(err) {
            callback(err, null);
        }else if(ret) {
            //music existed
            callback(null, null);
        }else{
            var doc = new Artist({
                id: data.id,
                name: data.name,
            });
            doc.save(callback);
        }
    });
};