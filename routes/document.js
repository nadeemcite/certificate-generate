var app = require('express').Router();
var Document = require('../model/document');
var multer=require('multer');
var upload = multer({
    dest: 'documents/'
});
app.get('/document',function(req,res){
    Document.find({active:true},function(err,docs){
        if (!err) {
            res.send({
                success: true
                , docs: docs
            })
        }
        else {
            res.send({
                success: false
                , error: err
            })
        }
    })
});
app.get('/documentimage/:docid',function(req,res){
    Document.findOne({
        _id: req.params.docid
    }, function (err,_doc) {
        if (!err) {
            res.header("Content-Type", _doc.file.mimetype);
            res.sendFile(_doc.file.path,{root:__dirname+'/../'});
        }
    });
});
app.post('/document',upload.single('document'),function(req,res){
    var documentObj=req.body;
    documentObj.file=req.file;
    documentObj.createdOn=new Date();
    documentObj.updatedOn=documentObj.createdOn;
    documentObj.active=true;
    Document.create(documentObj,function(err,_document){
        if (!err) {
            res.send({
                success: true
                , document: _document
            })
        }
        else {
            res.send({
                success: false
                , doctypes: err
            })
        }
    })
});
module.exports=app;
