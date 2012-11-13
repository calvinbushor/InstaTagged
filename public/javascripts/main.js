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
});

socket.on('/are-you-subscribed', function(data) {
	var tag = data['tag'],
		id  = data['id'];

	if ( tag === currTag ) {
		socket.emit('/yes-i-am-subscribed', tag, id);
	}
});

(function( $ ) {
	$.fn.updateTag = function() {
		function getImages(tag) {
			if ( undefined === tag ) return;
			
			currTag = tag;
			socket.emit('/fetch-by-tag', {tag: tag, id: id});

			History.pushState({tag: tag, id: id}, 'Instatagged', '?tag=' + tag);
		}

		return this.each(function() {
			var state = History.getState();

			if ( undefined !== state['data']['tag'] ) {				
				getImages(state['data']['tag']);
			}

			$(this).on('submit', function(e) {
				var tag = $(this).closest('form').find('.tagName').val();
				
				getImages(tag);
				return false;
			});
		});
	}
})( jQuery );

$('.updateTag').updateTag();