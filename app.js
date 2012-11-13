
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
  , instatagged = require('./class/instatagged/instatagged.js')
  , eventer     = require('./class/eventer/eventer.js');

eventer = new eventer();

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

var tracker = {};

io.sockets.on('connection', function(socket) {
  var tagger  = new instatagged();
  var current = {
    tag: undefined,
    id:  undefined
  };

  var choker = false;
  setInterval(function() {
    choker = true;
  }, 10000);

  socket.emit('/set-id', socket['id']);

  // Send new images to client
  tagger.on('/fetched', function(images) {
    socket.emit('/new-images', images);
  });

  eventer.on('/posted', function(data) {
    if ( choker ) {
      choker = false;

      for ( var i=0; i<data.length; i++ ) {
        var tag = data[i]['object_id'],
            id  = data[i]['subscription_id'];

        socket.emit('/are-you-subscribed', {tag: tag, id: id});
      }  
    }
  });

  socket.on('/yes-i-am-subscribed', function(tag, id) {
    tagger.fetchImagesByTag(tag);
  });

  tagger.on('/subscribed-to', function(data) {
    current['tag'] = data['data']['object_id'];
    current['id']  = data['data']['id'];

    socket.emit('/message', tracker);
  });

  tagger.on('/msg', function(data) {
    io.sockets.emit('/message', data);
  });

  // Fetch images by tag entered
  socket.on('/fetch-by-tag', function(data) {
    var tag = data['tag'].toLowerCase(),
        id  = data['id'];

    // Don't ask for same tag again
    if ( tag === current['tag'] ) return;

    tagger.fetchImagesByTag(tag);

    // Create new or add to existing
    if ( !tracker[tag] ) {
      tracker[tag] = 1;
    } else if ( 0 >= tracker[tag] ) {
      tracker[tag] = 1;
    } else {
      tracker[tag]++
    }

    // Decrement subscription count
    if ( tracker[current['tag']] ) {
      tracker[current['tag']]--;
    }

    // Tag is 0, unsubscribe tag
    if ( 0 >= tracker[current['tag']] ) {
      tagger.unsubscribe(current['tag'], current['id']);      
      delete tracker[current['tag']];
    }

    // Subscribe tag
    tagger.subscribe(tag);
  });

  socket.on('disconnect', function(data) {
    if ( !tracker[current['tag']] ) return;

    // Decrement subscription count
    if ( tracker[current['tag']] ) {
      tracker[current['tag']]--;
    }
  });
});

app.get('/', function(req, res) {
  res.render('index', { 
    title: '#InstaTagged'
  });
});

app.get('/subscriptions', function(req, res) {
  var query     = req['query'],
      challenge = query['hub.challenge'];

  if ( undefined === challenge ) {
    res.type('text/plain');
    res.send(500, 'No challenge id found.');
    return;
  }

  res.type('text/plain');
  res.send(challenge);
});

app.post('/subscriptions', function(req, res) {
  var body = req.body;

  if ( body ) {
    eventer.broadcast('/posted', body);
  }  

  res.send(200);
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
