var express         =           require("express");
var router          =           express.Router();
var builder         =           require('botbuilder');
var mongoose 		= 			require('mongoose');
var User 			= 			require('../models/user');
require('dotenv').config();
//=========================================================
// Bot Setup
//=========================================================
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID, //|| 'cf79fde4-0886-4a5f-9388-5afbeb608ede',
    appPassword: process.env.MICROSOFT_APP_PASSWORD //|| 'AoRqywNmbqMMvKPM5GxphYG'
 });
var bot = new builder.UniversalBot(connector);
var model = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/8d172975-6e46-47c8-ad38-4cd22c1cbb68?subscription-key='+process.env.subscription_key+'&timezoneOffset=0&verbose=true&q=';
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
var Stage 			=			require('../dialog/stage');
var Search 			= 			require('../dialog/search');
var Service 		= 			require('../dialog/service_provider');
var StageProvider 	=			require('../dialog/stage_provider');
var ArtistProvider 	=			require('../dialog/artist_provider');
var Help 			=			require('../dialog/help');
var Turing 			= 			require('../dialog/turing');
// =======================

bot.dialog('help',Help.Dialog);
bot.dialog('profile',Profile.Dialog);
bot.dialog('greet',Greet.Dialog);
bot.dialog('artist',Artist.Dialog);
bot.dialog('stage',Stage.Dialog);
bot.dialog('search',Search.Dialog);
bot.dialog('service',Service.Dialog);
bot.dialog('stageProvider',StageProvider.Dialog);
bot.dialog('artistProvider',ArtistProvider.Dialog);
// =======================


intents.onBegin(function(session){
	session.beginDialog('greet',session.userData.greet);
});
intents.matches('Artist',Artist.Dialog);
intents.matches('Search',Search.Dialog);
intents.matches('Stage',Stage.Dialog);
intents.matches('Help',Help.Dialog);
intents.matches('Provider',Service.Dialog);
intents.matches('Reality',Turing.Real);
intents.matches('Name',Turing.Name);
intents.matches('Age',Turing.Age);
intents.matches('Location',Turing.Location);
intents.matches('Language',Turing.Language);
intents.matches('State',Turing.State);
intents.matches('Hobby',Turing.Hobby);
intents.matches('Appearance',Turing.Appearance);
intents.matches(/truth and consequences/i,[
	function(session){
		session.send("truth and consequences activated!");
		delete session.userData.name;
		delete session.userData.age;
		delete session.userData.phone;
		delete session.userData.email;
		delete session.userData.greet;
		delete session.userData.profile;
		session.beginDialog('greet',session.userData.greet);
	}]);
intents.onDefault([function(session){
	session.sendTyping();
	session.send("if you need help with something type \" Help me with ...... \"");
	session.send("if you are a service provider or an artist type \" I'm a service provider\" ");
	session.send("You can ask anything regarding the services you need. ex.: \" Show artists|give stage info\"");
}]);



router.post("/",connector.listen());

module.exports = router;