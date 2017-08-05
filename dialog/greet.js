var builder			=		require("botbuilder");

var date = new Date();
var hr = date.getHours();
console.log(hr);
greet	=	{
	Label		: 		'Greet',
	Dialog   	: 		[
		function(session,args,next){
			// session.send("hi");
				if(hr > 4 && hr<12){
					session.send('Good Morning!');
				}else if(hr>=12 && hr < 17){
					session.send('Good Afternoon!');
				}else if (hr>= 17 && hr <21 ) {
					session.send('Good Evening!');
				}else{
					session.send('Hi, At this late hour in the day Good Evening i guess.');
				}
				next();
		},
		function(session,args,next){
			if(!session.userData.greet){
				session.send("I am Pheno.");
				session.send("I'm created to help you with various aspects of hosting your event.");
			}
			next();
		},
		function(session,args,next){
			session.userData.greet=true;
			// session.send("if you have any difficulties with interacting with me just type 'help ...' ");
			session.beginDialog('profile',session.userData.profile);
		}
	]
};

module.exports = greet;