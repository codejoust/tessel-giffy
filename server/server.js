var bodyParser = require('body-parser');
var httpconstants = require('../common/httpconstants');
var fs = require('fs');


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var serveStatic = require('serve-static');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');

var imagePath = __dirname + '/public/imgs/';

var Canvas = require('canvas')
  , Image = Canvas.Image;

var latestUrl = '/gif-latest.gif';
var gifPath = __dirname + '/public' + latestUrl;

var GifEncoder = require('gifencoder');


io.on('connection', function(socket){
  console.log('new connection!')
  fs.readdir(imagePath, function(err, files) {
    socket.emit('init', {files: files});
  })
});

var hasAdded = false;

function setupEncoder() {
  var encoder = new GifEncoder(640, 480);
  encoder.start();
  encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
  encoder.setDelay(300);  // frame delay in ms
  encoder.setQuality(10); // image quality. 10 is default.
  var newPath = '/ag-' + (new Date()).getTime() + '.gif';

  io.emit('newImage', newPath);
  if (hasAdded) { fs.renameSync(gifPath, imagePath + newPath); }
  hasAdded = true;
  encoder.createReadStream().pipe(fs.createWriteStream(gifPath));
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

  io.emit('reloadPreview', true);


  imageCount++;
  res.end(':)');
});

app.get('/', function (req, res) {
  res.render('index', {latestUrl: latestUrl});
})

server.listen(httpconstants.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)

})
