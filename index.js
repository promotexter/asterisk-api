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