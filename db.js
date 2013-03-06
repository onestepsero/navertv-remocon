var request = require('request')
, cheerio = require('cheerio')
, S = require('string')
, fs = require('fs');

var contents = new Array(CHANNEL_LIST.length);
var ipadUseragent = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25";

/*
contents[channle][{text: , title:, href: }]

*/
// Array init
for(var i =0;  i< CHANNEL_LIST.length; i++) {
	contents[i] =[{}];
}

exports.getData = function(id) {	
	var keyIndex = CHANNEL_LIST.indexOf(id);
	return contents[keyIndex];
};

exports.naverTvUrlParse = function(){

	for(var i =0; i<CHANNEL_LIST.length; i++) {
		urlParseToDb(CHANNEL_LIST[i]);		
	}
}

urlParseToDb = function(channel){
	
	var keyIndex = CHANNEL_LIST.indexOf(channel);
	request(
	{ 
		uri: "http://tvcast.naver.com/" + channel
	},
	function(error, response, body){
		var $ = cheerio.load(body);
		var index = 0;
		$(".lst_obj  .conts > a").each(function(){
			var link = $(this);		
			var text = link.text();
			var title = link.attr("title");
			var href = link.attr("href");

			contents[keyIndex][index] =  {
				id: index,			
				title:title,
				href: href
			}

			tvInfoscript(index);

			index++;

		});
	});



	var tvInfoscript = function(index) {
	
	request({ 
		uri: contents[keyIndex][index].href,
		headers: {
			'user-agent' : ipadUseragent
		}
		},
		function(error, response, body){

		var $ = cheerio.load(body);
		//TODO
		$("#player").each(function(){
			var link = $(this).children().text();				
			var replaceContent = S(link).replaceAll('"', "'");

			contents[keyIndex][index].script  = replaceContent;

		});
	});		
	};

};

exports.makeJsonFile = function(param) {
	var data = { index: param};
	var outputFile = 'public/api.json';

	fs.writeFile(outputFile, JSON.stringify(data), function(err){
		if(err){
			console.log(err);
		} else {
			console.log("JSON saved to");
		}
	});		 

};