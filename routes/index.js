
/*
 * GET home page.
 */

exports.index = function(req, res) {
  	res.render('index', { title: 'Express' });
};

exports.socket = function(req, res) {
  	res.render('socket', { title: 'Socket.IO Example' });
};