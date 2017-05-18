var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http = require('http');
var dataRecieved;
http.get("http://www.festmamu.tk/artist/ar", function(res) {
	var body = ''; 
	res.on('data', function(data){
		body += data;
	});
	res.on('end', function() {
		var parsed = JSON.parse(body);
		// console.log(parsed);
		dataRecieved= parsed;

	});
})
.on('error', function(e) {
	console.log("Got error: " + e.message);
});


AristProvider = {
	Label	: 	'AristProvider',
	Dialog	: 	[
		function(session,args,next){
			session.sendTyping();
				session.send("you have to answer some questions before we can show you your data...");
				builder.Prompts.text(session,"What is the Stage Name you've used while signup on festmamu?");			
				
		},
		function(session,args,next){
			var found=false;
			if(args.response){
				session.send("looking for your profile on the festmamu database");
				session.sendTyping();
				var regex = new RegExp(args.response,"i");
				for(i in dataRecieved){
					if(regex.test(dataRecieved[i].StageName)){
						console.log(dataRecieved[i]);
						card= createHeroCard(session,dataRecieved[i]);
						var msg = new builder.Message(session).addAttachment(card);
				        session.send(msg);
				        found=true;
					}
				}
			}
			if(!found){
				session.send("I did not find your data on the festmamu database.");
				card= createSigninCard(session);
				var msg = new builder.Message(session).addAttachment(card);
				session.send(msg);
				session.endDialog();
			}else
				session.endDialog();
		}
		]
	};

	function createSigninCard(session) {
		session.sendTyping();
	    return new builder.HeroCard(session)
	        title("error")
	        .text(' We are glad to have a provider. You can provide services only on sign up. Would you like to?')
	        .button(builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/register', 'Sign-Up'));
	}
function createHeroCard(session,data){
	return new builder.HeroCard(session)
					        .title(data.Aname)
					        .subtitle('Category: '+data.Type)
					        .text('cost:'+data.price_per_hour+'\n  Views:'+data.views+
					        	'\n  Comments:'+data.Comments.length)
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/artist/test/'+data._id, 'More Information')
					        ]);
}

module.exports = AristProvider;