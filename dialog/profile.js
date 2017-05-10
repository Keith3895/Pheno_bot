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
				builder.Prompts.text(session,"If you dont mind, may I have your phone number to contact you with updates?");
			}
			else
				next();
		},
		function(session,args,next){
			if (args.response) {
				res = args.response;	
				if(res.match(/[0-9]+/)){
					session.userData.phone=numExtract(res);
					next();
				}else if(res.match(/(no|nope)/)){
					session.send("I'll take that as a no..That's alright.");
					session.userData.phone="0";
					next();
				}else if(res.match(/(yes|ya|sure|yup)/)){
					builder.Prompts.text(session,"Thanks and your number is?");	
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
				builder.Prompts.text(session,"age?");
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
				session.userData.email = args.response;
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

				"Thank You."+session.userData.name+"\n are you A :",
				["event service provider","event planner"],
		        {
		            maxRetries: 2,
		            retryPrompt: 'Not a valid option'
		        });
		},
		function(session,results){
			session.send("%s",results.response.entity);
			if(results.response.entity == 'event service provider'){
				// session.send("we have not made it till here.");
				session.beginDialog('service');
				session.endDialog();
			}else{
				
				session.endDialog();
			}

		}
	]
};

module.exports = profile;