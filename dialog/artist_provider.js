var builder 		=		require('botbuilder');
var User 			=		require('../models/user');

AristProvider = {
	Label	: 	'AristProvider',
	Dialog	: 	[
		function(session,args,next){
			session.send("Artist Provider Details");
		}
		]
	};

module.exports = AristProvider;