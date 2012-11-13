var util    = require('util'),
	events  = require('events'),
	request = require('request');

function Instatagged () {
	var that  = this;

	this.client_id     = process.env['INSTAGRAM_CLIENT_ID'];
	this.client_secret = process.env['INSTAGRAM_CLIENT_SECRET'];
	this.cache         = {};
	this.callback_url  = 'http://instatagged.jit.su/subscriptions/';
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

Instatagged.prototype.subscribe = function(tag) {
	var that = this;

	var options = {
			method: 'post',
			url:    'https://api.instagram.com/v1/subscriptions/',
			form:   {
			client_id:     that.client_id,
			client_secret: that.client_secret,
			object:        'tag',
			object_id:     tag,
			aspect:        'media',
			callback_url:  that.callback_url
	    }
    };

    request(options, function(err, response) {
      if ( err ) return;


      var body = JSON.parse(response.body);

      if ( 400 == body['meta']['code'] ) return;

      console.log('** Subscribing socket to tag: ' + tag);
      that.emit('/subscribed-to', body);
    });
}

Instatagged.prototype.unsubscribe = function(tag, id) {
	var that = this;

	var url = ['https://api.instagram.com/v1/subscriptions?'];
	
	url.push('id=');
	url.push(id);
	url.push('&');
	url.push('object=all');
	url.push('&');
	url.push('client_id=');
	url.push(that.client_id);
	url.push('&');
	url.push('client_secret=');
	url.push(that.client_secret);

	var options = {
			method: 'DELETE',
			url:    'https://api.instagram.com/v1/subscriptions/',
			form:   {
			client_id:     that.client_id,
			client_secret: that.client_secret,
			object:        'all',
			object_id:     tag,
			id:            id
	    }
    };
that.emit('/msg', url.join(''));
    request.del(url.join(''), function(err, response){
        that.emit('/unsubscribed-from', tag);
    });
}

module.exports = Instatagged;