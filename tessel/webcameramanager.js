var httpManager = require('./httpmanager');

// Wait for the camera module to say it's ready
module.exports = function(camera, LedStatusManager){
  camera.setResolution('vga');
  // vga = 640x480
  var isTakingGif = false;
  var isValidGif = true;
  this.trigger = function() {
    console.log('taking photo!');
    LedStatusManager.isTakingPicture(true);
    camera.takePicture(function(err, img) {
      setTimeout(function(){ 
        LedStatusManager.isTakingPicture(false);
      }, 200);
      if (err) {
        console.log('error taking picture!');
      } else {
        httpManager.sendPicture(img);
      }
    });
  },

  this.endGif = function(){
    console.log('gif end :( -- sending http manager');
    httpManager.endGif();
  }

}
