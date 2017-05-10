var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http = require('https');
var dataRecieved;
http.get("https://festmamu-keithfranklin.c9users.io/artist/ar", function(res) {
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


artist = {
	Label	: 	'Artist',
	Dialog	: 	[
	function(session,args,next){
		var ArtistPhrase = builder.EntityRecognizer.findEntity(args.entities, 'ArtistPhrase');
	    // console.log(dataRecieved);
	    if (!ArtistPhrase) {
	    	var list=[];
	    	for(i in dataRecieved){
	    		list.push(""+dataRecieved[i].Type+":   "+dataRecieved[i].StageName+"");
	    	}
	    	builder.Prompts.choice(session,"For more information on artist type their serial number.",list,
		        {
		            maxRetries: 2,
		            retryPrompt: 'Not a valid option'
		        });
	        // builder.Prompts.text(session, "What can I help you find?");
	    } else {
	        next({ phrase: ArtistPhrase.entity });
	    }
	},
	function(session,args,next){
		var find = true;
		if(args.phrase){
			ArtistPhrase = args.phrase;
			var regex = new RegExp(ArtistPhrase,"i");
			for(i in dataRecieved){
				if(regex.test(dataRecieved[i].StageName)){
					// if(returned[0].includes(dataRecieved[i].Type)){
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecieved[i].StageName)
					        .subtitle(dataRecieved[i].TagLine)
					        .text('cost per hour: '+dataRecieved[i].price_per_hour)
					        .images([
					            builder.CardImage.create(session, 'https://s3-us-west-2.amazonaws.com/festmamu/'+dataRecieved[i].image_link.split(',')[0]+'.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'https://festmamu-keithfranklin.c9users.io/artist/'+dataRecieved[i].Type.toLowerCase()+'/'+dataRecieved[i]._id, 'go to page')
					        ])
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
					session.send("coundn't find the artist you're looking for.");	
		}else if(args.response){
			returned = args.response.entity;
			returned = returned.split(':');
			for(i in dataRecieved){
				if(returned[1].includes(dataRecieved[i].StageName))
					if(returned[0].includes(dataRecieved[i].Type)){
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecieved[i].StageName)
					        .subtitle(dataRecieved[i].TagLine)
					        .text('cost per hour: '+dataRecieved[i].price_per_hour)
					        .images([
					            builder.CardImage.create(session, 'https://s3-us-west-2.amazonaws.com/festmamu/'+dataRecieved[i].image_link.split(',')[0]+'.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://festmamu-keithfranklin.c9users.io/artist/'+dataRecieved[i].Type.toLowerCase()+'/'+dataRecieved[i]._id, 'go to page')
					        ])
		                ]);
				        session.send(msg);			
				    }
			}
		}
	}
	]
};

module.exports = artist;