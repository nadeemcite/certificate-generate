var mongoose = require('mongoose');
var docdesign = mongoose.Schema({
    pfid:String,
    uniqueid: String,
    bulkDocument: {
        type: mongoose.Schema.Types.ObjectId
        , ref: 'bulkdocument'
    }
    , rawData: String
    , file: Object
    , createdOn: Date
    , updatedOn: Date
    , active: Boolean
});
module.exports = mongoose.model('document', docdesign);
