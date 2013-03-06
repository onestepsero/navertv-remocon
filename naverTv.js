var express = require('express') 
, http = require('http')
, app = express()
, server = http.createServer(app)
, path = require('path');

var tvInfo  ;
var naverTvIndex  ;

app.configure(function(){
	app.set('port',  16100);
	app.set('view', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use('/public',express.static(path.join(__dirname, '/public')));
});

process.on('message', function(m) {	
	naverTvIndex = m.naverTvIndex;
	tvInfo = m.tvInfo;
	// console.log('CHILD got message:', m );
});

app.get('/', function(req, res){		

	if(naverTvIndex == undefined) {
		res.sendfile("views/noindex.html");	
	} else {				
		res.render('view', {script:tvInfo.script.s, tvInfo:tvInfo});
	}
});

server.listen(app.get('port'), function(){
  console.log("TVCast server listening on port " + app.get('port'));
});
