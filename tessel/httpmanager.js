var http = require('http');
var extend = require('util')._extend;
var httpconstants = require('../common/httpconstants');

var remoteServer = {
	host: httpconstants.host,
	port: httpconstants.port,
	method: 'POST',
	'User-Agent': 'tessel',
	'Accept': '*/*',
	'Connection': 'keep-alive'
}

function handleResponseDebug(res) {
	console.log('status: ', res.statusCode);
	console.log('headers: ', res.headers);
	res.on('data', function(d) {
		console.log(' ', ' ');
		console.log(String(d));
	})
}

module.exports = {
	sendPicture: function(image) {
		var requestParams = extend(remoteServer,
		{
			path: httpconstants.sendImagePath,
			headers: {
				'Content-Type': httpconstants.imageFileType,
				'Content-Length': image.length
			}
		});
		var req = http.request(requestParams, handleResponseDebug);
	    req.write(image);
	    req.end();

	    req.on('error', function(e) {
	      console.error(e);
	    });

	},
	endGif: function() {
		var req = http.request(extend(remoteServer, 
		{
			path: '/endGif',
			headers: {
				'Content-Type': 'text/plain'
			}
		}), handleResponseDebug);
		console.log('sending gif end command');
		req.end();
	},
	testHome: function(){
		var req = http.request(extend(remoteServer, {
			method: 'GET',
			path: '/'
		}), handleResponseDebug);
		req.end();
	}
}

