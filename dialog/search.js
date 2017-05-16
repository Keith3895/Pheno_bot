var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var http = require('http');
var dataRecievedStage,dataRecievedArtist;
http.get("http://www.festmamu.tk/stage/list", function(res) {
	var body = ''; 
	res.on('data', function(data){
		body += data;
	});
	res.on('end', function() {
		var parsed = JSON.parse(body);
		// console.log(parsed);
		dataRecievedStage= parsed.stage;

	});
})
.on('error', function(e) {
	console.log("Got error: " + e.message);
});
http.get("http://www.festmamu.tk/artist/ar", function(res) {
	var body = ''; 
	res.on('data', function(data){
		body += data;
	});
	res.on('end', function() {
		var parsed = JSON.parse(body);
		// console.log(parsed);
		dataRecievedArtist= parsed;

	});
})
.on('error', function(e) {
	console.log("Got error: " + e.message);
});

var search = {
	Label 		:  		'Search',
	Dialog 		: 	[
	function(session,args,next){
		var AnyPhrase = builder.EntityRecognizer.findEntity(args.entities, 'AnyPhrase');
	    if (!AnyPhrase) {
	    	session.send("you have to be a little more specific..");
	        builder.Prompts.text(session, "What can I help you find?");
	    } else {
	        next({ response: AnyPhrase.entity });
	    }
	},
	function(session,args,next){
		find = true;
		if(args.response){
			AnyPhrase = args.response;
			var regex = new RegExp(AnyPhrase,"i");
			for(i in dataRecievedStage){
					if(regex.test(dataRecievedStage[i].Comp_Name)){
						// if(returned[0].includes(dataRecieved[i].Type)){
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecievedStage[i].Comp_Name)
					        .subtitle('located in :'+dataRecievedStage[i].Location.City+' \ncontact:'+dataRecievedStage[i].Location.Contact1 )
					        .text('cost: '+dataRecievedStage[i].cost.Cost)
					        .images([
					            builder.CardImage.create(session, 'http://www.queenshall.co.uk/userfiles/Stage%20Dimensions.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/stage/'+dataRecievedStage[i]._id, 'go to page')
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
			if(!find){
				// session.send("coundn't find the Stage you're looking for.");
				next({response: AnyPhrase});
			}else{
				session.endDialog();
			}
		}
	},
	function(session,args,next){
		var find = true;
		if(args.response){
			ArtistPhrase = args.response;
			var regex = new RegExp(ArtistPhrase,"i");
			for(i in dataRecievedArtist){
				if(regex.test(dataRecievedArtist[i].StageName)){
					// if(returned[0].includes(dataRecieved[i].Type)){
						var msg = new builder.Message(session)
		                    .attachments([ 
		                    new builder.HeroCard(session)
					        .title(dataRecievedArtist[i].StageName)
					        .subtitle(dataRecievedArtist[i].TagLine)
					        .text('cost per hour: '+dataRecievedArtist[i].price_per_hour)
					        .images([
					            builder.CardImage.create(session, 'https://s3-us-west-2.amazonaws.com/festmamu/'+dataRecievedArtist[i].image_link.split(',')[0]+'.jpg')
					        ])
					        .buttons([
					            builder.CardAction.openUrl(session, 'http://www.festmamu.tk/artist/'+dataRecievedArtist[i].Type.toLowerCase()+'/'+dataRecievedArtist[i]._id, 'go to page')
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
			if(!find){
				session.send("coundn't find what you're looking for.");	
				session.endDialog();
			}else{
				session.endDialog();
			}
		}
	}
	]
};



module.exports = search;