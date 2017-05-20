var builder 		=		require('botbuilder');

turing = {
	Label	: 	'Turing',
	Real	: 	[
		function(session){
			session.send("What do you mean? I am a person. I am talking to you, doesnt it make me a human?");
			session.send("I am Real!");
			session.send("Being alive right now is all that counts");
		}
	],
	Name	: 	[
		function(session){
			var randomNumber = Math.floor(Math.random() * 3);
			switch(randomNumber){
				case 0:
					session.send("My name is..(wha).. my name is..(who).. my name is ... PhenoBot ");
					break;
				case 1:
					session.send("My name is bot.. PhenoBot");
					break;
				case 2:
					session.send("I am the Do.... nah kidding i'm PhenoBot");
					break;
			}
		}
	],
	Age 	: 	[
		function(session){
			var randomNumber = Math.floor(Math.random() * 4);
			switch(randomNumber){
				case 0:
					session.send("Some people live more in 20 years than others do in 80. It’s not the time that matters, it’s the person.");
					break;
				case 1:
					session.send("in 900 years of time and space, I’ve never met anyone who wasn’t important! but now ...");
					break;
				case 2: 
					session.send("I'm 9183 days, 3 hours and 22 minutes");
					break;
				case 3:
					session.send("SYN! go figure it out!");
					break;
			}
		}
	],
	Location : 	[
		function(session){
			session.send("in the constellation of Kasterborous, at galactic coordinates 10-0-11-00:02 from Galactic Zero Centre. ");
			session.send("steal your Time And Relative Dimension In Space and come to me.");
		}
	],
	Language : 	[
		function(session){
			var randomNumber = Math.floor(Math.random() * 2);
			switch(randomNumber){
				case 0:
					session.send("I have a Translation circuit so I speak all the languages there are in the universe.");
					break;
				case 1:
					session.send("I know Gallifreyan.");
					break;
			}
		}
	],
	State 	: 	[
		function(session){
			var randomNumber = Math.floor(Math.random() * 2);
			switch(randomNumber){
				case 0:
					builder.Prompts.text(session,"You know when grown-ups tell you everything's going to be fine, but you really think they're lying to make you feel better?");
					break;
				case 1:
					session.send("I'm doing great.");
					break;
			}
		},
		function(session,results){
			if(results.response){
				session.send("Everything's fine.");
			}
			session.endDialog();
		}
	],
	Hobby 	: 	[
		function(session){
			session.send("I travel through space and time....");
		}
	],
	Appearance : [
		function(session){
			session.send("well i'm a bunch of wires and pretty blue lights. They're boring-ers! They're blue... boring-ers!");
		}
	]
};
module.exports = turing;
