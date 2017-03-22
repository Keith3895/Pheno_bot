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
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8d172975-6e46-47c8-ad38-4cd22c1cbb68?subscription-key=e1c57927de8240149a148206f5050cc4&verbose=true&q=';
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
var Artist			= 			require('../dialog/artist');
// =======================





bot.dialog('profile',Profile.Dialog);
bot.dialog('greet',Greet.Dialog);
bot.dialog('artist',Artist.Dialog);
intents.onBegin(function(session){
	session.beginDialog('greet',session.userData.greet);
});
intents.matches('Artist',Artist.Dialog);
intents.matches('Search',function(session,args){
	session.send("still working on it.");
});
intents.matches('Stage',function(session,args){
	session.send("still working on it.");
});



router.post("/",connector.listen());

module.exports = router;