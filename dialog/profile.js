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
function validateEntry(x,session){
	if(/(what|why|how|where)/i.test(x) || /(no|not)/i.test(x) || /(relevant|necessary|need|avoid)/i.test(x)){
		session.send("I will be using your information to make a better system.");
		session.send("Your information is protected.");
		session.send("I request you to help me help you.");
		console.log("inside the if!!!!!!");
		return true;
	}else return false;
	
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
				delete session.userData.name;
				if(validateEntry(args.response,session)){
					session.cancelDialog(0,'profile',session.userData);
				}else
					session.userData.name= args.response;
				console.log(args.response);
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
								builder.Prompts.choice(session,"...",
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
					// delete session.userData.name;
					session.userData.dbLook=true;
					session.send("oh sorry..");
					session.cancelDialog(0,'profile',session.userData);
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
				delete res;
				if(validateEntry(args.response,session)){
					session.cancelDialog(0,'profile',session.userData);
				}
				res = args.response;	
				
				if(/\d{10}/g.test(res)){
					session.userData.phone=res;
				}else{
					session.send("Enter a valid number(10 digits)....");
					session.cancelDialog(0,'profile',session.userData);
				}
				next();
			}
			else
				next();
		},
		function(session,args,next){
			if (!session.userData.age) {
				builder.Prompts.text(session,"Age?");
			}
			else{
				next();
			}
		},
		function(session,args,next){
			if (args.response) {
				if(validateEntry(args.response,session))
					session.cancelDialog(0,'profile',session.userData);
				if(/[0-9]/.test(args.response) && args.response > 6)
				{
					session.userData.age = args.response;	
				}else{
					session.send("you've entered a questionable age...");
					session.cancelDialog(0,'profile',session.userData);
				}
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
			session.send("Okay, thank you, "+session.userData.name+"!");
			builder.Prompts.choice(
				session,

				"Are you a :",
				["Event Service Provider","Event Planner"],
		        {
		            maxRetries: 2,
		            retryPrompt: 'Not a valid input. Event Service Provider: \'For supplying required facilities like Artists or resources like Stages.\' Event Planner: \'Hosts looking for Artists or Stage for thier events.\''
		        });
		},
		function(session,results){
			session.send("%s",results.response.entity);
			if(results.response.entity == 'Event Service Provider'){
				// session.send("we have not made it till here.");
				session.beginDialog('service');
				session.endDialog();
			}else{
				session.send(session.userData.name+",you can ask anything regarding the services you need. ex.: \"Show artists|Give stage info\"");
				session.endDialog();
			}

		}
	]
};

module.exports = profile;