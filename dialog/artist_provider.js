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
			session.sendTyping();session.sendTyping();session.sendTyping();
				session.send("you have to answer some questions before we can show you your data...");
				session.sendTyping();
				builder.Prompts.text(session,"What is the Stage Name you've used while signup on festmamu?");			
				
		},
		// function(session,args,next){
		// 	notfound=true;
		// 	if(args.response){
		// 		var regex = new RegExp(args.response,"i");
		// 		for(i in dataRecieved){
		// 			if(regex.test(dataRecieved[i].author.username)){
		// 				notfound=false;
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	if(notfound){
		// 		session.send("username not found");
		// 		session.endDialog();
		// 	}
		// 	else
		// 	{
		// 		builder.Prompts.text(session,"What is the Stage Name you've used while signup on festmamu?");			
		// 	}
			
		// },
		function(session,args,next){
			if(args.response){
				session.send("looking for your profile on the festmamu database");
				session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();session.sendTyping();
				var regex = new RegExp(args.response,"i");
				for(i in dataRecieved){
					if(regex.test(dataRecieved[i].StageName)){
						console.log(dataRecieved[i]);
						card= createReceiptCard(session,dataRecieved[i]);
						var msg = new builder.Message(session).addAttachment(card);
				        session.send(msg);
					}
				}
			}
			session.endDialog();
		}
		]
	};

	function createReceiptCard(session,data) {
		// session.sendTyping();session.sendTyping();
    return new builder.ReceiptCard(session)
        .title(data.StageName)
        .facts([
        	builder.Fact.create(session, data.Aname, 'Name'),
            builder.Fact.create(session, data.Type, 'Type:'),
            builder.Fact.create(session, data.price_per_hour, 'Cost')
        ])
        .items([
            builder.ReceiptItem.create(session, data.views, 'Views')
                .image(builder.CardImage.create(session, '	https://s3-us-west-2.amazonaws.com/festmamu/eye.png')),
            builder.ReceiptItem.create(session, data.Comments.length, 'Comments')
                .image(builder.CardImage.create(session, 'https://s3-us-west-2.amazonaws.com/festmamu/chat.png'))
        ])
        // .tax('$ 7.50')
        // .total('$ 90.95')
        .buttons([
            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/artist/test/'+data._id, 'More Information')
        ]);
}

module.exports = AristProvider;