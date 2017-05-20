 var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http = require('http');
var dataRecieved;
http.get("http://www.festmamu.tk/stage/list", function(res) {
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


stage = {
	Label	: 	'Stage',
	Dialog	: 	[
	function(session,args,next){
		var StagePhrase = builder.EntityRecognizer.findEntity(args.entities, 'StagePhrase');
	    console.log(dataRecieved);
	    if (!StagePhrase) {
	    	var list=[];
	    	for(i in dataRecieved){
	    		list.push(""+dataRecieved[i].Comp_Name+":   "+dataRecieved[i].Location.City+"");
	    	}
	    	builder.Prompts.choice(session,"For more information on Stage type their serial number.\n",list,
		        {
		            maxRetries: 2,
		            retryPrompt: 'Not a valid option '+session.userData.name+'. Choose from the list provided...'
		        });
	        // builder.Prompts.text(session, "What can I help you find?");
	    } else {
	        next({ phrase: StagePhrase.entity });
	    }
	},
	function(session,args,next){
		var find = true;
		if(args.phrase){
			StagePhrase = args.phrase;
			var regex = new RegExp(StagePhrase,"i");
			for(i in dataRecieved){
				if(regex.test(dataRecieved[i].Comp_Name)){
					// if(returned[0].includes(dataRecieved[i].Type)){
						session.sendTyping();
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecieved[i].Comp_Name)
					        .subtitle('located in :'+dataRecieved[i].Location.City)
					        .subtitle('contact:'+dataRecieved[i].Location.Contact1)
					        .text('cost: '+dataRecieved[i].cost.Cost)
					        .images([
					            builder.CardImage.create(session, 'http://www.queenshall.co.uk/userfiles/Stage%20Dimensions.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+dataRecieved[i]._id, 'go to page')
					        ])
					        .tap(builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+dataRecieved[i]._id, 'go to page'))

		                ]);
				        session.send(msg);
				        find=true;
				        break;		
				    }
				else{
					find = false;
				}
			}
			if(!find)
					session.send("coundn't find the Stage you're looking for.");	
		}else if(args.response){
			returned = args.response.entity;
			returned = returned.split(':');
			for(i in dataRecieved){
				if(returned[1].includes(dataRecieved[i].Location.City))
					if(returned[0].includes(dataRecieved[i].Comp_Name)){
						session.sendTyping();
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecieved[i].Comp_Name)
					        .subtitle('located in :'+dataRecieved[i].Location.City+' \ncontact:'+dataRecieved[i].Location.Contact1 )
					        .text('cost: '+dataRecieved[i].cost.Cost)
					        .images([
					            builder.CardImage.create(session, 'http://www.queenshall.co.uk/userfiles/Stage%20Dimensions.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+dataRecieved[i]._id, 'go to page')
					        ])
					        .tap(builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+dataRecieved[i]._id, 'go to page'))
		                ]);
				        session.send(msg);			
				    }
			}
		}
	}
	]
};

module.exports = stage;