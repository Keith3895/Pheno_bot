var builder 		=		require('botbuilder');

profile = {
	Label	: 	'Profile',
	Dialog	: 	[
		function(session,args,next){
			if(session.userData.name==undefined){
				session.send('hi lets get to know each other... ');
				builder.Prompts.text(session,'so what\'s your name?');
			}
			else
				next();
		},
		function(session,args,next){
			session.userData.name= args.response;
			if (!session.userData.age) {
				builder.Prompts.text(session,'and how old are you in years?');
			}
			else
				next();
		},
		function(session,results){
			session.userData.age = results.response;
			session.send('hi  %s how are you? ',session.userData.name);
			session.endDialog();
		}
	]
};

module.exports = profile;