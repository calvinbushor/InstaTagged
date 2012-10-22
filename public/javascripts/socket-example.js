var socket = io.connect('/');

socket.on('foo', function (data) {
	console.log(data['msg']);

	socket.emit('bar', { msg: '{Insert funny MEME here}' });
});