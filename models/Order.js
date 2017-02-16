/**
 * Created by chaclus on 2017/2/15.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    id: { type: String },
    title: { type: String },
    href: { type: String },
    img: { type: String },
    author: { type: String },
    author_url: { type: String },
    time: { type: String },
    num_comment: { type: Number },
    num_follow: { type: Number },
    num_music: { type: Number },
    play_count: { type: Number },
    tags: { type: Array },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

mongoose.model('MsOrder', OrderSchema);