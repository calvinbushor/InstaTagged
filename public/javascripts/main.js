var socket = io.connect('/'),
	cache  = {};

socket.on('images', function(images) {
	for ( var id in images ) {
		var url = images[id],
			image;

		if ( undefined != cache[id] ) continue;

		image     = '<div class="media"><img src="' + url + '" alt="Image from instagram API."/></div>';
		cache[id] = url;

		$(image).insertBefore('#hidden');
	}

	// for ( var i=0; i<data.length; i++) {
	// 	var url = data[i],
	// 		el  = '<div class="media"><img src="' + url + '" alt="Image from instagram API."/></div>';

	// 	// $('body').prepend(el);

	// 	$(el).insertBefore('#hidden');
	// }
});