var express = require('express');
var bodyParser = require('body-parser');
var httpconstants = require('../common/httpconstants');
var app = express();
var fs = require('fs');

var Canvas = require('canvas')
  , Image = Canvas.Image

var GifEncoder = require('gifencoder');

function setupEncoder() {
  var encoder = new GifEncoder(640, 480);
  encoder.start();
  encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
  encoder.setDelay(300);  // frame delay in ms
  encoder.setQuality(10); // image quality. 10 is default.
  encoder.createReadStream().pipe(fs.createWriteStream(__dirname + '/imgs/myanimated-'+(new Date()).getTime()+'.gif'));
  return encoder;
}

var encoder = setupEncoder();

var imageBodyParser = bodyParser.raw({'type': httpconstants.imageFileType});

var imageCount = 0;

app.post(httpconstants.endStreamPath, bodyParser.text(), function(req, res) {
  if (imageCount > 0) {
    console.log('encoding ' + imageCount + ' frames.');
    imageCount = 0;
    encoder.finish();
    encoder = setupEncoder();
  } else {
    console.log('no frames :(');
  }
  res.end(':)');
})

app.post(httpconstants.sendImagePath, imageBodyParser, function(req, res) {
  console.log('has new image :)');
  var canvas = new Canvas(640, 480);
  var ctx = canvas.getContext('2d');
  img = new Image;
  img.src = req.body;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  
  encoder.addFrame(ctx); 

  imageCount++;
  res.end(':)');
});

app.get('/', function(req, res) {
	res.end(':)');
})


var server = app.listen(httpconstants.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)

})
