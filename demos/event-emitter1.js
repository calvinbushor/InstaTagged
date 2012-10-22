
var events = require('events');
var util   = require('util');

Eventer = function(){
	events.EventEmitter.call(this);

	this.foo = function(){
		var data = 'I know my calculus!'
		this.emit('foo', data);
	}

	this.bar = function(){
		var data = 'It says, "You + Me = Us."'
		this.emit('bar', data);
	}
};

util.inherits(Eventer, events.EventEmitter);

Listener = function(){
	this.fooHandler =  function(data){
		console.log(data);
	},
	this.barHandler = function(data){
		console.log(data);
	}
};

// Our "Instagram" API call
function someServiceCall() {
	var eventer  = new Eventer();
	var listener = new Listener();

	// Setup the what on the when
	eventer.on('foo', listener.fooHandler);
	eventer.on('bar', listener.barHandler);

	// Our response take a second... or 3
	setTimeout(function() {
		// Execute the events
		eventer.foo();
		eventer.bar();
	}, 3000);
}

someServiceCall();

