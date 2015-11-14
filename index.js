/**
 * PixelNode_Input_bbbGPIO 
 * 
 * Binary input from GPIOs (beaglebone only)
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var util = require("util");
var _ = require('underscore');
var b = require('bonescript');


/* Class Constructor
 * ==================================================================================================================== */

// extending Effect
PixelNode_Input = require('pixelnode-input');

// define the Student class
function PixelNode_Input_bbbGPIO(options,pixelData) {
  var self = this;
  PixelNode_Input_bbbGPIO.super_.call(self, options, pixelData);
  this.className = "PixelNode_Input_bbbGPIO";
}

// class inheritance 
util.inherits(PixelNode_Input_bbbGPIO, PixelNode_Input);

// module export
module.exports = PixelNode_Input_bbbGPIO;


/* Variables
 * ==================================================================================================================== */

PixelNode_Input_bbbGPIO.prototype.default_options = {
	pins: [
		{ number: "P8_8", input: "button1", default: false },
		{ number: "P8_10", input: "button2", default: false },
		{ number: "P8_12", input: "button3", default: false }
	],
	frequency: 50
};
PixelNode_Input_bbbGPIO.prototype.status_interval = 0;


/* Overridden Methods
 * ==================================================================================================================== */

// init effect – override
PixelNode_Input_bbbGPIO.prototype.init = function() {
	var self = this;

	// start
	console.log("Init Input GPIO".grey);

	// init pins
	this.initPins();

	// start interval to get pin status
	self.status_interval = setInterval(function() {self.getPinStatus()}, self.options );

}


/* Methods
 * ==================================================================================================================== */

// initializing pins
PixelNode_Input_bbbGPIO.prototype.initPins = function() {
	var self = this;
	
	// inputs
	var init_inputs = {};

	// init
	self.options.pins.forEach(function(pin) {
		// set input mode
		b.pinMode(pin.number, b.INPUT);
		
		// set inputs
		init_inputs[pin.input] = pin.default;
	});

	// init pixelNode data
	global.pixelNode.data.extend(["inputs",self.options.name], init_inputs);
}

// get pin status
PixelNode_Input_bbbGPIO.prototype.getPinStatus = function() {
	var self = this;

	// each pin
	self.options.pins.forEach(function(pin) {
		// read value
		b.digitalRead(pin.number, function(x) {
			// write to PixelNode_Data
			global.pixelNode.data.set(["inputs", self.options.name, pin.input], x.value == 1);
		} );
	});

}



