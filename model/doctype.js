var mongoose = require('mongoose');
var doctype = mongoose.Schema({
    name: String
    , template:{type: mongoose.Schema.Types.ObjectId, ref: 'docdesign'}
    , createdOn: Date
    , updatedOn: Date
    , active: Boolean
});
module.exports = mongoose.model('doctype', doctype);
