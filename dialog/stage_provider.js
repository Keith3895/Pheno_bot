var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http 			= 		require('http');

var dataRecieved;
http.get("http://www.festmamu.tk/stage/list/", function(res) {
	var body = ''; 
	res.on('data', function(data){
		body += data;
	});
	res.on('end', function() {
		var parsed = JSON.parse(body);
		// console.log(parsed);
		dataRecieved= parsed.stage;

	});
})
.on('error', function(e) {
	console.log("Got error: " + e.message);
});



StageProvider = {
	Label	: 	'StageProvider',
	Dialog	: 	[
		function(session,args,next){
			session.sendTyping();session.sendTyping();session.sendTyping();
				session.send("you have to answer some questions before we can show you your data...");
				session.sendTyping();
				builder.Prompts.text(session,"What is the user name you've used to signup on festmamu?");
		},
		function(session,args,next){
			var found=false;
			if(args.response){
				session.send("looking for your profile on the festmamu database");
				session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();
				var regex = new RegExp(args.response,"i");
				for(i in dataRecieved){
					if(regex.test(dataRecieved[i].author.username)){
						console.log(dataRecieved[i]);
						card= createReceiptCard(session,dataRecieved[i]);
						var msg = new builder.Message(session).addAttachment(card);
						session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();
				        session.send(msg);
				        found =true;
					}
				}
			}
			if(!found){
				session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();
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
		session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();
	    return new builder.SigninCard(session)
	        .text('festmamu sign-up')
	        .button('Sign-in', 'http://www.festmamu.tk/stage/register');
	}
	function createReceiptCard(session,data) {
		// session.sendTyping();session.sendTyping();
    return new builder.ReceiptCard(session)
        .title(data.Comp_Name)
        .facts([
            builder.Fact.create(session, data.Location.City, 'City:'),
            builder.Fact.create(session, data.cost.Cost, 'Cost')
        ])
        .items([
            builder.ReceiptItem.create(session, data.views, 'Views')
                .quantity(720)
                .image(builder.CardImage.create(session, '	https://s3-us-west-2.amazonaws.com/festmamu/eye.png')),
            builder.ReceiptItem.create(session, data.Comments.length, 'Comments')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://s3-us-west-2.amazonaws.com/festmamu/chat.png'))
        ])
        // .tax('$ 7.50')
        // .total('$ 90.95')
        .buttons([
            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+data.author.id+'/mylistings', 'More Information')
        ]);
}

module.exports = StageProvider;