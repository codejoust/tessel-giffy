var httpManager = require('../../tessel/httpmanager.js');
var fs = require('fs');

var imageFile = fs.readFileSync(__dirname + '/test.jpg');

console.log(imageFile);

//httpManager.sendPicture(imageFile);
//httpManager.sendPicture(imageFile);

setTimeout(function(){ 
  httpManager.endGif();
}, 1000);
