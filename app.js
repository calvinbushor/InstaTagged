
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path')
  , app     = express()
  , server  = http.createServer(app)
  , io      = require('socket.io').listen(server)
  , instatagged = require('./class/instatagged/instatagged.js');

io.sockets.on('connection', function(socket) {
  var tagger = new instatagged(process.env['INSTAGRAM_CLIENT_ID']);

  socket.emit('/set-id', socket['id']);

  // Send new images to client
  tagger.on('/fetched', function(images) {
    socket.emit('/new-images', images);
  });

  // Fetch images by tag entered
  socket.on('/fetch-by-tag', function(data) {
    var tag = data['tag'],
        id  = data['id'];

    tagger.fetchImagesByTag(tag);
  });
});

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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
