var express         =           require("express");
var router          =           express.Router();
var builder         =           require('botbuilder');


//=========================================================
// Bot Setup
//=========================================================
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID|| 'cf79fde4-0886-4a5f-9388-5afbeb608ede',
    appPassword: process.env.MICROSOFT_APP_PASSWORD || 'AoRqywNmbqMMvKPM5GxphYG'
 });
var bot = new builder.UniversalBot(connector);
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f7e538c8-c1aa-474f-a135-223303bf83ae?subscription-key=473378f051924e268711aae581e38f24';
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


// =======================


bot.dialog('profile',Profile.Dialog);

intents.onDefault([function(session){
	if(!session.userData.name)
    	session.beginDialog('profile');
    else
    	session.send("hey");
},
function(session,args){
	console.log(session.userData.name  +"  "+ args.response);
}]);


router.post("/",connector.listen());

module.exports = router;

