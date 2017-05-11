var app = require('express').Router();
var Doctype = require('../model/doctype');
app.get('/doctypes', function (req, res) {
    Doctype.find({
        active: true
    }).populate('template').exec(function (err, _doctypes) {
        if (!err) {
            res.send({
                success: true
                , doctypes: _doctypes
            })
        }
        else {
            res.send({
                success: false
                , doctypes: err
            })
        }
    });
});
app.post('/doctype', function (req, res) {
    var doctypeObj = req.body;
    doctypeObj.active = true;
    doctypeObj.createdOn = new Date();
    doctypeObj.updatedOn = doctypeObj.createdOn;
    Doctype.create(doctypeObj, function (err, _doctype) {
        if (!err) {
            res.send({
                success: true
                , doctype: _doctype
            })
        }
    })
});
app.delete('/doctype/:docid', function (req, res) {
    console.log('called')
    Doctype.findOneAndUpdate({
        _id: req.params.docid
    }, {
        "$set": {
            active: false
        }
    }, function (err) {
        if (!err) {
            res.send({
                success: true
            })
        }
        else {
            res.send({
                success: false
                , error: err
            })
        }
    });
})
module.exports = app;
