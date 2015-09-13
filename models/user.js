'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  	deviceId: String,
  	name: String,
	username : String,
	password: String,
	status: String
});

module.exports = mongoose.model('User', UserSchema);
