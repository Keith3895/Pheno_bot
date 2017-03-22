var express         =           require("express");
var router          =           express.Router();
var builder         =           require('botbuilder');
var mongoose 		= 			require('mongoose');
var User 			= 			require('../models/user');

//=========================================================
// Bot Setup
//=========================================================
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID|| 'cf79fde4-0886-4a5f-9388-5afbeb608ede',
    appPassword: process.env.MICROSOFT_APP_PASSWORD || 'AoRqywNmbqMMvKPM5GxphYG'
 });
var bot = new builder.UniversalBot(connector);
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f7e538c8-c1aa-474f-a135-223303bf83ae?subscription-key=e1c57927de8240149a148206f5050cc4';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//=========================================================
// Bots Dialogs
//=========================================================

// ======================
// external dialog
// ======================
var Profile         =           require('../dialog/profile');
var Greet			= 			require('../dialog/greet');

// =======================





bot.dialog('profile',Profile.Dialog);
bot.dialog('greet',Greet.Dialog);

intents.onBegin(function(session){
	session.beginDialog('greet',session.userData.greet);
});

router.post("/",connector.listen());

module.exports = router;

// intents.onDefault([function(session,args,next){
// 	if(!session.userData.name)
//     	session.beginDialog('profile');
//     else
//     	next();
// }
// function(session,args,next){
// 	builder.
// 	Prompts.choice(
// 		session,
// 		"hi "+session.userData.name+" we provide 2 main funtions on FeastMaMu",
// 		["event service provider","event planner"],
//         {
//             maxRetries: 3,
//             retryPrompt: 'Not a valid option'
//         });
// },
// function(session,results){
	
// 	session.send("%s",results.response.entity);
// 	session.send("thanks for that choice");
// }
// ]);