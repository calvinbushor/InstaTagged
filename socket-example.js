// ================= Setup ===================== //
var http    = require('http'),
	express = require('express'),
	routes  = require('./routes'),
	path    = require('path'),
	app     = express(),
	server  = http.createServer(app),
	io	    = require('socket.io');

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

io = io.listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// ================= Socket.io ===================== //

io.sockets.on('connection', function (socket) {
	// Trigger event and send data
	socket.emit('foo', { msg: 'Sending all the things.' });

	// Respond to an event
	socket.on('bar', function (data) {
		console.log(data);
	});
});

app.get('/socket', routes.socket);

