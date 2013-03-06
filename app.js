global.CHANNEL_LIST = ['secretjuju', 'ted','tobot'];

var express = require('express')
, request = require('request')
, http = require('http')
, app = express()
, cp = require('child_process')
, path = require('path')
, server = http.createServer(app)
, db = require('./db.js');

var tvoutChild = cp.fork('naverTv.js');
var naverTvIndex  = 1;
var contents = [{}];

app.configure(function(){
	app.set('port', process.env.PORT || 8080);
	app.set('view', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use('/public',express.static(path.join(__dirname, '/public')));
})

//main
app.get('/', function(req, res){
	res.render("index", {channelList: CHANNEL_LIST})
	db.naverTvUrlParse();	
});

//list
app.get('/tvlist/:id', function(req, res){
	contents = db.getData(req.params.id)	;	
	res.render("list", {id: req.params.id, contents:contents});	
});

//detail
app.get('/detail/:id',  function(req, res){

	tvoutChild.send({naverTvIndex : req.params.id, tvInfo:contents[req.params.id]});
	db.makeJsonFile(req.params.id);	
	res.render('detail', {script:contents[req.params.id].script, naverTvIndex:req.params.id});
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});