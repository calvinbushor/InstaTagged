io = require('socket.io');
var client_id = 'f8d635078bcc46c0b297cc914233ac8c';

/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path')
  , request = require('request')
  , app     = express()
  , server  = http.createServer(app);

io = io.listen(server);

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


var options = {
  method: 'GET',
  uri: 'https://api.instagram.com/v1/tags/1devday/media/recent?client_id=' + client_id,
  json: true
}

var images = {};

function instaWhat(socket) {
  request(options, function(err, response) {
    var data = response['body']['data'],
        flag = false;

    data = data.reverse();

    for ( var i=0; i<data.length; i++ ) {
      var id    = data[i]['id'].toString(),
          url   = data[i]['images']['standard_resolution']['url'];

      if ( undefined != images[id] ) continue;

      flag = true;
      images[id] = url;
    }

    if ( flag ) {
      socket.emit('images', images);
      flag = false; // reset
    }
  });
}
  
io.sockets.on('connection', function (socket) {
  // sendCached(socket);
  socket.emit('images', images);
  instaWhat(socket);
  
  setInterval(function() {
    instaWhat(socket);
  }, 10000);
});