
var thrift = require('thrift');
var _ = require('underscore');

//
// Pull in generated Thrift "classes" from memberstore project
// Create connection and client
//
var MemberStore = require('../memberstore/gen-nodejs/MemberStore');
var Member = require('../memberstore/gen-nodejs/member_types').Member;
var conn = thrift.createConnection('localhost', 9701);
var client = thrift.createClient(MemberStore, conn);

conn.on('error', function(err) {
	console.error("error:", err);
});

//
// Backing functions for each endpoint routed in app.js
//
module.exports = {
	//
	// Handles GET /members
	//
	index: function(req, res){
		client.all(function (err, members) {
			res.send(err ? 500 : createCollectionResponse(members));
		});
	},

	//
	// Handles POST /members
	//
	create: function(req, res){
		client.create(new Member(req.body), function (err) {
			res.send(err ? 500 : 201);
		});
	},

	//
	// Handles GET /members/:id
	//
	show: function(req, res){
		client.get(req.params.member, function (err, client) {
			res.send(err ? 500 : createModelResponse(client));
		});
	},

	//
	// Handles PUT /members/:id
	//
	update: function(req, res){
		client.update(new Member(req.body), function (err) {
			res.send(err ? 500 : 200);
		});
	},

	//
	// Handles DELETE /members/:id
	//
	destroy: function(req, res){
		client.remove(req.params.member, function (err) {
			res.send(err ? 500 : 200);
		});
	},

	//
	// Handles POST /members/:id/:action
	//
	action: function(req, res){
		if (['promote', 'demote'].indexOf(req.params.action) === -1) {
			res.send(404);
		} else {
			client[req.params.action](req.params.member, function (err) {
				res.send(err ? 500 : 200);
			});
		}
	},

	//
	// Handles POST /members/reset
	//
	reset: function(req, res){
		client.reset(function (err) {
			res.send(err ? 500 : 200);
		});
	}

};

//
// Prepares a collection for JSON reponse by
// wrapping in envelope to match current framework
//
function createCollectionResponse(collection) {
	return {
		startIndex: 0,
		itemsPerPage: 50,
		totalResults: collection.length,
		entry: _(collection).map(function (model) { return createModelResponse(model); })
	};
}

//
// Prepares a model for JSON response by
// dynamically generating available actions
// TODO move action generation to underlying service
//
function createModelResponse(model) {
	model.actions = [];
	if (model.rank > 1) model.actions.push({ rel: 'promote', method: 'post', href: '/members/' + model.id + '/promote' });
	model.actions.push({ rel: 'demote', method: 'post', href: '/members/' + model.id + '/demote' });
	return model;
}