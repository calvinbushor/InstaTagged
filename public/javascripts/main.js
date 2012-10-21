var socket = io.connect('/');

socket.on('images', function(data) {
	console.log(data);
	for ( var i=0; i<data.length; i++) {
		var url = data[i],
			el  = '<div class="media"><img src="' + url + '" alt="Image from instagram API."/></div>';

		// $('body').prepend(el);

		$(el).insertBefore('#hidden');
	}
});