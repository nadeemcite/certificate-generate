module.exports=function(app){
    app.use('/api',require('./template'));
    app.use('/api',require('./doctype'));
    app.use('/api',require('./document'));
}
