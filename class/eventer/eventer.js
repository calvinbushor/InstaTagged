var util    = require('util'),
	events  = require('events');

function Eventer() {}

util.inherits(Eventer, events.EventEmitter);

Eventer.prototype.broadcast = function(e, data) {
  var that = this;
  that.emit(e, data);
}

module.exports = Eventer;