var mongoose = require('mongoose');
var fs = require('fs-extra')
var User = require('./models/user');
var _ = require('lodash');
var exec = require('exec');

var config = require('./config');

var series = 639370000000;

function rewriteFiles()
{
	// get all users
	User.find({}, function(err, users){
		if(err) return handleError(res, "ERROR_ENCOUNTERED:D1");

		writeFile(config.asterisk.sip_conf, users);
		writeFile(config.asterisk.extension_conf, users);

		// reload asterisk
		
		restartAsterisk();
	});
	// write sip.conf
	// write extension.conf
}

function restartAsterisk()
{
	exec('asterisk -x "sip reload"', function(err, out, code) {
	  if (err instanceof Error)
	    throw err;
	  console.log('reloaded sip peers');
	  process.stderr.write(err);
	  process.stdout.write(out);
	});
	exec('asterisk -x "dialplan reload"', function(err, out, code) {
	  if (err instanceof Error)
	    throw err;
	  console.log('reloaded dialplan');
	  process.stderr.write(err);
	  process.stdout.write(out);
	});
}

function writeFile(config, dataArray)
{
	// where's the file

	var ws = fs.createOutputStream(config.path);

	console.log("WRITING", config.path);


	if(config.header)
	{
		ws.write(config.header + "\n");
	}

	_.each(dataArray, function(v, k){

		var r = config.template;

		r = r.replace(/%username%/g, v.username);

		console.log("writing", v.username);
		ws.write(r + "\n");
	});
}

exports.index = function(req, res)
{
	res.send("INDEX");
}

exports.register = function(req, res)
{
	var param = req.query;

	console.log("REGISTER request", param);

	  // User.findOne({ username : param.username }, function(err, user){
	  // 	if(err) return handleError(res, "ERROR_ENCOUNTERED:C1");

	  // 	if(user)
	  // 	{
	  // 		// user exist, just return the user
	  // 		res.json(user);
	  // 	}
	  // 	else
	  // 	{



	
	User.findOne({'deviceId': param.device_id}, function(err, doc) {
		if(err) {console.log(err)}
		if(doc){
			res.send(doc);
		} else {
			// user not found
			var autoUsername = ++series;
			var user = new User();
			user.deviceId = param.device_id;
			user.username 	= autoUsername;
			user.password 	= autoUsername;
			user.name 		= autoUsername;
			user.save(function(err){
				if(err) return handleError(res, "ERROR_ENCOUNTERED:C2");

				rewriteFiles();

				res.send(user);
			})
		}
	}); 

	  	// }
	  // })
}

exports.update = function(req, res)
{
  var param = req.query;

  console.log("UPDATE request", param);

  User.findOne({ deviceId: param.device_id}, function(err, user){
  	if(err || !user) return handleError(res, "ERROR_ENCOUNTERED:C1");

  	
  	// user is found
  	user.name = param.name;
  	user.save(function(err){
		if(err) return handleError(res, "ERROR_ENCOUNTERED:C2");
 
 		rewriteFiles();

 		res.send(user);
 	})
  })
}

exports.list = function(req, res)
{
  var param = req.query;

  console.log("LIST request", param);

  if(param.username)
  	filter = { username : { '$ne' : param.username  } };
  else
  	filter = {};

  User.find( filter, function(err, users){
  	if(err || !users) return handleError(res, "ERROR_ENCOUNTERED:C1");

  	res.json(users);	
  	
  })
}

exports.updatePeerStatus = function(username, isOnline) {
	User.findOne({'username': username}, function(err, doc) {
		if(err) {console.log(err)}
		if(doc){
			doc.status = 'offline';
			if(isOnline === true) {
				doc.status = 'online';
			} 
			console.log('setting ', username, 'to', doc.status);
			doc.save();
		} else {
			//peep not found
		}
	}); 
}

function handleError(res, error)
{
	res.send(500, error);
}
