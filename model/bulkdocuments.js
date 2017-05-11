var mongoose = require('mongoose');
var docdesign = mongoose.Schema({
    rawData: String
    , doctype: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'doctype'
    }
    , createdOn: Date
    , updatedOn: Date
    , active: Boolean
});
module.exports = mongoose.model('bulkdocument', docdesign);
