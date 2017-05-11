var builder 		=		require('botbuilder');

help = {
	Label	: 	'Help',
	Dialog	: 	[
		function(session){
			session.send("working on help");
		}
	]
};
module.exports = help;
