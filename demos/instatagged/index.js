/**
 * @param {Socket.IO} socket // Socket connection established from socket.io
 */
function instatagged(socket) {
	this.socket      = socket;
	this.tag         = '1devday';
	this.client_id   = process.env.INSTAGRAM_CID;
	this.instatagged = this;
	this.events   = require('events');	
	this.util     = require('util');
	this.request  = require('request');
	this.images   = {};

	this.events.EventEmitter.call(this);
	this.util.inherits(this.sendImages, this.events.EventEmitter);
}

instatagged.prototype.init = function() {
	var that = this;

	if ( undefined == that.client_id ) return;

	// Send cached images
	that.sendImages();
	that.fetchImages(function() {
		that.sendImages();
	});
	that.interval();
	that.updateTag();
}

instatagged.prototype.interval = function() {
	var that = this;

	setInterval(function() {
		that.fetchImages(function() {
			that.sendImages();
		});
	}, 10000);
}

instatagged.prototype.fetchImages = function(callback) {
	var images    = this.images,
		tag       = this.tag,
		client_id = this.client_id
		options   = {
			method: 'GET',
			json:   true,
			uri:    'https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=' + client_id,
		};

	this.request(options, function(err, response) {
		var data = response['body']['data'];

		if ( undefined == data ) return;

		data = data.reverse();

		for ( var i=0; i<data.length; i++ ) {
			var id  = data[i]['id'].toString(),
				url = data[i]['images']['standard_resolution']['url'];

			if ( undefined != images[id] ) continue;

			images[id] = url;
		}

		callback();
	});
}

instatagged.prototype.sendImages = function() {
	var socket = this.socket,
		images = this.images;

	socket.emit('images', images);
}

instatagged.prototype.updateTag = function() {
	var that   = this,
		socket = this.socket;

	socket.on('updateTag', function(data) {
		var tag = data['tag'];
		if ( undefined === tag ) return;

		that.tag = tag;
		that.fetchImages(function() {
			that.sendImages();
		});
	});
}

module.exports = instatagged;
