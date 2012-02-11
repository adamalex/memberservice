var thrift = require('thrift');
var _ = require('underscore');

var MemberStore = require('../memberstore/gen-nodejs/MemberStore');
var conn = thrift.createConnection('localhost', 9701);
var	client = thrift.createClient(MemberStore, conn);

conn.on('error', function(err) {
	console.error("error:", err);
});

module.exports = {

	index: function(req, res){
		client.all(function (err, members) {
			res.send(createCollectionResponse(members));
		});
	},

	create: function(req, res){

	},

	show: function(req, res){
		client.get(req.params.member, function (err, client) {
			res.send(createModelResponse(client));
		});
	},

	update: function(req, res){

	},

	destroy: function(req, res){

	}

};

function createCollectionResponse(collection) {
	return {
		startIndex: 0,
		itemsPerPage: 50,
		totalResults: collection.length,
		entry: _(collection).map(function (model) { return createModelResponse(model); })
	};
}

function createModelResponse(model) {
	model.actions = [
		{ rel: 'promote', method: 'post', href: '/members/' + model.id + '/promote' },
		{ rel: 'demote', method: 'post', href: '/members/' + model.id + '/demote' }
	];
	return model;
}