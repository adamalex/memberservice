//
// Standard Express framework boilerplate
//
var express = require('express');
require('express-resource');

var app = module.exports = express.createServer();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

//
// Endpoint logic is in the controller
// Standard CRUD is mapped by app.resource
// Followed by POST handlers for custom actions
//
var controller = require('./controller');
app.resource('members', controller);
app.post('/members/:member/:action', controller.action);
app.post('/members/reset', controller.reset);


// Start
app.listen(9702);
console.log("Member Service listening on port %d in %s mode", app.address().port, app.settings.env);