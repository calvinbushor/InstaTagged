var socket = io.connect('http://localhost');

socket.on('images', function(data) {
	console.log(data);
	for ( var i=0; i<data.length; i++) {
		var url = data[i];

		$('body').prepend(
			'<div class="media"><img src="' + url + '" alt="Image from instagram API."/></div>')
	}
});