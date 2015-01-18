module.exports = function(tessel){
   var lights = { 
        green: tessel.led[0], 
        blue: tessel.led[1], 
        red: tessel.led[2],
        amber: tessel.led[3]
    };
  this.isTakingPicture = function(takingPicture) {
      if (takingPicture) {
        lights.green.write(takingPicture);
        lights.amber.write(0);
      }
    }
  this.hasVibration = function() {
      this.isTakingPicture(false);
      lights.amber.write(1);
  }
  this.hasWifi = function(hasWifi) {
      lights.red.write(hasWifi ? 0 : 1);
  }
  return this;
};