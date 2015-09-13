var config = require('./config');
var controller = require('./controller');

var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri);


var express = require('express');
var app = express();

app.get('/', controller.index);
app.get('/register', controller.register);
app.get('/update', controller.update);
app.get('/list', controller.list);




var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


console.log(config.asterisk);
var ami = new require('asterisk-manager')(config.asterisk.manager.port,
	config.asterisk.manager.host,
	config.asterisk.manager.username,
	config.asterisk.manager.password,
	true);
ami.keepConnected();
ami.on('managerevent', function(evt) {
	var events = ['PeerStatus']
	if(events.indexOf(evt.event) === -1) {
		return;
	}
	
	var online = ['Reachable', 'Lagged']

	isOnline = online.indexOf(evt.peerstatus) === -1 ? false : true;
	if(isOnline === false) {
		// record, we don't know this shiz
		console.log('UNKNOWN_STATUS', evt.peerstatus);
	}
	controller.updatePeerStatus(evt.peer.replace('SIP/', ''), isOnline);
});
