var builder 		=		require('botbuilder');
var User 			=		require('../models/user');

StageProvider = {
	Label	: 	'StageProvider',
	Dialog	: 	[
		function(session,args,next){
			session.send("Stage Provider Details");
		}
		]
	};

module.exports = StageProvider;