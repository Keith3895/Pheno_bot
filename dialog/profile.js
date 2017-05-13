var builder 		=		require('botbuilder');
var User 			=		require('../models/user');
var bigJump;
var numExtract  =  function(str){
	var ch,str1="";
	for(i=0;i<str.length;i++){
		ch=str.charAt(i);
		if(ch>='0' && ch<='9'){
			str1+=ch;
		}
	}
	return str1;
};
function validateEmail(x) {
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
    }
    else
    	return true;
}
profile = {
	Label	: 	'Profile',
	Dialog	: 	[
		function(session,args,next){
			if(!args){
				next();
			}else{
				bigJump = true;
				next();
			}
		},
		function(session,args,next){
			if(!session.userData.name){
				session.send("Before we start...");
				// session.send('So let us get to know each other before starting');
				builder.Prompts.text(session,'What is your name?');
			}
			else{
				// session.userData.name=args;
				next();
			}
		},
		function(session,args,next){
			if(args.response){
				if(/my name is/i.test(args.response))
				{
					var match = /my name is/i.exec(args.response);
					args.response = args.response.substring(match[0].length,args.response.length);
				}
				session.userData.name= args.response;
				if(!session.userData.dbLook)	
				{
					User.findOne({'name':session.userData.name},function(err,Data){
						if(err){
							console.log(err);
						}else{
							// console.log(Data);
							if(Data!=null){
								session.userData.Data = Data;
								session.send("Hi %s, are these your details:",session.userData.name);
								session.send("age: %s",Data.age);
								session.send(Data.email);
								session.send("phone: %s",Data.phone);
								// builder.Prompts.text(session,"yes?");
								builder.Prompts.choice(session,"so?",
								["yes","no"],
						        {
						            maxRetries: 3,
						            retryPrompt: 'Not a valid option'
						        });
							}else{
								next();
							}
						}
					});
				}
			}
			else
				next();
		},
		function(session,args,next){
			// console.log(args.response.entity);
			if(args.response){
				if(args.response.entity == 'yes'){
					session.userData.age = session.userData.Data.age;
					session.userData.phone = session.userData.Data.phone;
					session.userData.email = session.userData.Data.email;
					session.userData.profile=true;
					delete session.userData.Data;
					session.send('ok');
					next();
				}else if(args.response.entity == 'no'){
					delete session.userData.name;
					session.userData.dbLook=true;
					session.send("oh sorry..");
					session.cancelDialog(0,'profile',session.userData.name);
				}
			}else{
				next();
			}
		},
		function(session,args,next){
			if (!session.userData.phone) {
				builder.Prompts.text(session,"Please enter your phone number:");
			}
			else
				next();
		},
		function(session,args,next){
			if (args.response) {
				res = args.response;	
				if(res.match(/(no|nope)/)){
					session.send("I'll take that as a no..That's alright.");
					session.userData.phone="0";
					next();
				}else if(res.match(/(yes|ya|sure|yup)/)){
					builder.Prompts.text(session,"Thanks and your number is?");	
				}else if(res.match(/[a-z]+/)){
					session.send('you\'ve entered alphabets not only numbers');
					session.cancelDialog(0,'profile',session.userData);
				}else{
					session.userData.phone=res;
					next();
				}
			}
			else
				next();
		},
		function(session,args,next){
			if(args.response){
				console.log("here");
				session.userData.phone=args.response;
			}
			if (!session.userData.age) {
				builder.Prompts.text(session,"Age?");
			}
			else{
				next();
			}
		},
		function(session,args,next){
			if (args.response) {
				session.userData.age = args.response;
			}
			if(!session.userData.email){
				builder.Prompts.text(session,"What is your email address?");
			}else
				next();
		},
		function(session,args,next){
				if(args.response){
					if(validateEmail(args.response)){
						session.userData.email = args.response;
					}
					else{
						session.send('you have entered the wrong format for a email address.');
						session.cancelDialog(0,'profile',session.userData);
					}
				}
			next();
		},
		function(session,results){
			console.log(session.userData.name);
			console.log(session.userData.age);
			console.log(session.userData.phone);
			// session.send(session.userData.greet);
			if(!session.userData.profile){
				storeData = {
					name		: 		session.userData.name,
					age			: 		session.userData.age,
					phone		: 		session.userData.phone,
					email 		:       session.userData.email
				}
				User.create(storeData,function(err,newData){
					console.log(newData);
					if(err){
						console.log(err);
					}else{
						newData.save();
						session.userData.profile=true;
					}
				});	

			}
			// else{
			// 	session.endDialog();
			// }
			builder.Prompts.choice(
				session,

				"Thank You, "+session.userData.name+"\n. Are you a :",
				["Event Service Provider","Event Planner"],
		        {
		            maxRetries: 2,
		            retryPrompt: 'Not a valid option'
		        });
		},
		function(session,results){
			session.send("%s",results.response.entity);
			if(results.response.entity == 'Event Service Provider'){
				// session.send("we have not made it till here.");
				session.beginDialog('service');
				session.endDialog();
			}else{
				session.send("You can ask anything regarding the services you need. ex.: \"Show artists|Give stage info\"");
				session.endDialog();
			}

		}
	]
};

module.exports = profile;