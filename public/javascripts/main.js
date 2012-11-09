var socket = io,
	id     = undefined,
	cache  = {};

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

socket.on('/new-images', function(images) {
	console.log('new images');
	handleImages(images);
});

(function( $ ) {
	$.fn.updateTag = function() {
		return this.each(function() {
			$(this).on('submit', function(e) {
				var tag  = $(this).closest('form').find('.tagName').val();

				socket.emit('/fetch-by-tag', {tag: tag, id: id});
				return false;
			});
		});
	}
})( jQuery );

$('.updateTag').updateTag();