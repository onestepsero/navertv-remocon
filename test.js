var request = require('request')
, cheerio = require('cheerio')
, S = require('string')
, fs = require('fs');


request(
	{ 
		uri: "http://tvcast.naver.com/secretjuju" 
	},
	function(error, response, body){
		var $ = cheerio.load(body);
		var index = 0;
		$(".lst_obj  .conts > a > p.thumb > img").each(function(){
			var link = $(this);					
			console.log(link.attr('src'));
		});
	});