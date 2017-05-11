var express=require('express');
var app=express();
var PORT = process.env.PORT || 9000;;
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
mongoose.connect('mongodb://zenwaystest:pf1bc@ds056979.mlab.com:56979/zenwaystest');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var routes=require('./routes/routes-config');
routes(app);
app.use(express.static(__dirname + '/public'));
app.use(function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT,function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Started at - '+PORT);
	}
});
