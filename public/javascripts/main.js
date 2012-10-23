var socket = io.connect('/'),
	cache  = {};

socket.on('images', function(images) {
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
});

(function( $ ) {
	$.fn.updateTag = function() {
		return this.each(function() {
			$(this).on('submit', function(e) {
				e.preventDefault();

				var tag = $(this).closest('form').find('.tagName').val();

				socket.emit('updateTag', {tag: tag});
			});
		});
	}
})( jQuery );

$('.updateTag').updateTag();