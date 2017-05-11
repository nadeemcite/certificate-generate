var mongoose = require('mongoose');
var docdesign = mongoose.Schema({
    name: String
    , canvas: String
    , file: Object
    , createdOn: Date
    , updatedOn: Date
    , active: Boolean
});
module.exports = mongoose.model('docdesign', docdesign);
