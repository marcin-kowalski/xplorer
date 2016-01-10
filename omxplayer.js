
var express = require('express');
var app = express();
var exec = require('child_process').exec;
var glob=require('glob');
var model = [];

var dbPath = "/media/klocek/";
var pipePath = "/tmp/cmd";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function rebuildModel(callback) {
	console.log("scanning database: " + dbPath);
	model.movies = [];
	glob(dbPath + "**/*.*",  function(er, files) {
		for (var i=0; i < files.length; ++i) {
			var file = files[i];
			if (file.endsWith("avi") || file.endsWith("mkv") || file.endsWith("mp4"))
				model.movies.push({id: model.movies.length, path: files[i]});
		}
		callback();
	});
}

function returnModel(res, model) {		
	res.send(model.movies);
}

app.get('/status', function (req, res) {
	res.send(model.status);
});

app.get('/start', function (req, res) {
	var id = req.query.id;
	if (id < model.movies.length) {
		var file = model[id].path;
		exec('omxplayer "' + file + '" < ' + pipePath, function(error, stdout, staderr) {
			if (error!=null) console.log("error: " + error);			

		});
		sendCommand("1");
		sendCommand("2");
		res.send("started " + file);
	} else {
		res.send("wrong id");
	}
});

app.get('/pause', function(req, res) {
	sendCommand("p");
	res.send("command sent");
});


app.get('/stop', function (req, res) {
	sendCommand("q");
	res.send('stop');
});

app.get('/fastback', function (req, res) {
	sendCommand("\x1b\x5b\x42");
	res.send("command sent");
});

app.get('/fastforward', function (req, res) {
	sendCommand("\x1b\x5b\x41");
	res.send("command sent");
});

app.get('/back', function (req, res) {
	sendCommand("\x1b\x5b\x44");
	res.send("command sent");
});

app.get('/forward', function (req, res) {
	sendCommand("\x1b\x5b\x43");
	res.send("command sent");
});

app.get('/list', function(req, res) {
	if (model.movies) 
		returnModel(res, model);		
	else
		rebuildModel(function() {returnModel(res, model);});
});


app.get('/refresh', function(req, res) {
	rebuildModel(function() {		
		res.send(model);		
	})
});


app.get('/volup', function (req, res) {
	sendCommand("+");
	res.send("command sent");
});

app.get('/voldown', function (req, res) {
	sendCommand("-");
	res.send("command sent");
});

function sendCommand(command) {
	exec("echo -n " + command + " > " + pipePath);
}

app.use(express.static('.'));


var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  model.status=[];
  console.log('Listening at http://%s:%s', host, port);
});

