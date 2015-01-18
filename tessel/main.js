// module
var ModuleManagerLib = require('./modulemanager.js').ModuleManager;
var ModuleManager = new ModuleManagerLib();

var boardconfig = require('../common/boardconfig.js');

// led
var tessel = require('tessel');
var ledstatusmanagerLib = require('./ledstatusmanager.js');
var ledstatusmanager = new ledstatusmanagerLib(tessel);

// camera
var camera = require('camera-vc0706').use(tessel.port['B']);

camera.on('ready', function(){ 
	initAmbient();
})

var ambient = require('ambient-attx4').use(tessel.port['A']);

function readyCB() {
	console.log('at callback');
	var camManagerLib = require('./webcameramanager.js');
	var ambientManager = require('./ambientsensormanager.js');

	var webcameramanager = new camManagerLib(camera, ledstatusmanager);
	var ambientsensormanager = new ambientManager(ambient, ledstatusmanager, webcameramanager);
}

function initAmbient() {
	// ambient
	
	//ModuleManager.AddReadyModule('Ambient', ambient);


	ambient.on('ready', function() {
		readyCB();
	})
}

/*
ModuleManager.AddReadyModule('Camera', camera);

camera.on('ready', function() {
	//ambient.on('ready', function() {
		readyCB();
	//})
});
*/
/*


ModuleManager.AddReadyCallback(function(){ 
	});

ModuleManager.Start();

*/