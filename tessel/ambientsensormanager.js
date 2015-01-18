var soundTriggerAmount = 0.1;
// var soundTriggerAmount = 0.16;


function getTrigger() {
	return Math.floor((new Date()).getTime() / 2000);
}

module.exports = function(ambient, LedManager, cameraManager){ 
  var lastTrigger = -1;


  ambient.setSoundTrigger(soundTriggerAmount);
  ambient.on('sound-trigger', function(data) {
    
    console.log('trigger val: ', lastTrigger, getTrigger());

  	if (lastTrigger != -1 && lastTrigger == getTrigger()) {
      cameraManager.endGif();
  	} else {
      console.log("Clap! Toggling gif: ", data);
      cameraManager.trigger();
  	}
    
    lastTrigger = getTrigger();

  });
}