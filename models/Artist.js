/**
 * Created by chaclus on 2017/2/15.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
    id: { type: String },
    name: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

mongoose.model('MsArtist', ArtistSchema);