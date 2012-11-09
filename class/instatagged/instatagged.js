var util    = require('util'),
	events  = require('events'),
	request = require('request');

function Instatagged (client_id) {
	var that  = this;

	this.client_id = client_id;
	this.cache     = {};
}

util.inherits(Instatagged, events.EventEmitter);

Instatagged.prototype.fetchImagesByTag = function(tag) {
	var that    = this,
	    images  = {},
		options = {
			method: 'GET',
			json:   true,
			uri:    'https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=' + that.client_id
		};

	request(options, function(err, response) {
		var objects = response['body']['data'];

		if ( undefined === objects ) return;

		objects = objects.reverse();

		for ( var i=0; i<objects.length; i++ ) {
		  var id  = objects[i]['id'].toString(),
		      url = objects[i]['images']['standard_resolution']['url'];

		  // Check variable outside this scope
		  if ( undefined != that.cache[id] ) continue;

		  images[id]     = url;
		  that.cache[id] = url;
		}

		that.emit('/fetched', images);
	});
}

module.exports = Instatagged;