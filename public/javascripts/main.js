(function( $ ) {
	var socket  = io,
		id      = undefined,
		currTag = undefined,
		cache   = {};

	socket = socket.connect('/');

	socket.on('/set-id', function(data) {
		id = socket.socket.sessionid;
	});

	function handleImages(images) {
		for ( var id in images ) {
			var url = images[id],
				image;

			if ( undefined != cache[id] ) continue;

			image     = $('<div class="media"><img src="' + url + '" alt="Image from instagram API."/></div>');
			cache[id] = url;

			image.css({
				display: 'none'
			});

			$('.instatagged').prepend(image);		
			image.fadeIn(3000);
		}
	}

	socket.on('/message', function(msg) {
		console.log(msg);
	});

	socket.on('/new-images', function(images) {
		handleImages(images);
		$('.tagName').removeClass('active');
	});

	socket.on('/are-you-subscribed', function(data) {
		var tag = data['tag'],
			id  = data['id'];

		if ( tag === currTag ) {
			socket.emit('/yes-i-am-subscribed', tag, id);
		}
	});

	function getImages(tag) {
		if ( undefined === tag ) return;

		currTag = tag;
		socket.emit('/fetch-by-tag', {tag: tag, id: id});

		History.pushState({tag: tag, id: id}, 'Instatagged', '?tag=' + tag);
	}

	$.fn.updateTag = function() {
		var state = History.getState();
		var input = $('.tagName');

		if ( undefined !== state['data']['tag'] ) {				
			input.val(state['data']['tag']);
			getImages(state['data']['tag']);
			input.addClass('active');
		}

		if ( undefined !== state['hash'] ) {
			var tag = state['hash'].match(/\?tag=+(\w*\d*)+/);
			if ( null !== tag[1] ) {
				input.val(tag[1]);
				input.addClass('active');
				getImages(tag[1]);				
			}			
		}

		return this.each(function() {
			$(this).on('submit', function(e) {
				var tag = $(this).closest('form').find('.tagName').val();
				
				input.addClass('active');
				getImages(tag);				
				return false;
			});
		});
	}

	$('.updateTag').updateTag();
})( jQuery );

