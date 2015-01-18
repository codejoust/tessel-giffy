module.exports.ModuleManager = function(){
	var readyCallbacks = [];
	var readyModules = [];
	
	var errorCallback = function(name){ 
		return function(err) {
			console.log('Module Loading Error!', '['+name+']');
			console.log(err);
		}
	}

	this.AddReadyCallback = function(cb) {
		readyCallbacks.push(cb);
	}

	this.AddReadyModule = function(name, module) {
		readyModules.push([name, module]);
	}
	this.AddReadyModules = function(modules) {
		modules.forEach(function(el) {
			this.AddReadyModules(['group', el]);
		})
	}
	var Start = function(){
		var readyCount = readyModules.length;
		var readyCallback = function(name) {
			return function() {
				if (--readyCount == 0) {
					readyCallbacks.forEach(function(cb) {
						cb();
					});
				} else {
					Start();
				}
				console.log('ready['+name+']: ', readyCount);
			}
		}
		while (readyModules.length) {
		  var mod = readyModules.pop();
		  mod[1].on('ready', readyCallback(mod[0]));
		  mod[1].on('error', errorCallback(mod[0]));
		}
	}
	this.Start = Start;

}