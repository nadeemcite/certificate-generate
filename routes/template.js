var express = require('express');
var app = express.Router();
var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
})
var Docdesign = require('../model/docdesign');
app.post('/docs', upload.single('background'), function (req, res) {
    var docdesignObj = req.body;
    docdesignObj.file = req.file;
    docdesignObj.active = true;
    docdesignObj.createdOn = new Date();
    docdesignObj.updatedOn = docdesignObj.createdOn;
    Docdesign.create(docdesignObj, function (err, _doc) {
        res.send(req.file);
    })
})
app.get('/docs', function (req, res) {
    Docdesign.find({active:true}, function (err, docs) {
        if (!err) {
            res.send({
                success: true
                , docs: docs
            })
        }
    })
});
app.delete('/docs/:docid', function (req, res) {
    Docdesign.findOneAndUpdate({
        _id: req.params.docid
    }, {
        "$set": {
            active: false
            , updatedOn: new Date()
        }
    }, function (err) {
        if (!err) {
            res.send({
                success: true
            })
        }else{
            res.send({
                success:false
                , error:err
            })
        }
    });
});
app.get('/docbackground/:docid',function(req,res){
    Docdesign.findOne({
        _id: req.params.docid
    }, function (err,_docdesign) {
        if (!err) {
            res.header("Content-Type", _docdesign.file.mimetype);
            res.sendFile(_docdesign.file.path,{root:__dirname+'/../'});
        }
    });
});
module.exports = app;
