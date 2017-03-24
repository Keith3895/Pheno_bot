var builder = require('botbuilder');
var express = require("express");
var app     = express();
var mongoose = require('mongoose');


var User = require("./models/user");
mongoose.connect("mongodb://admin:cloudnine@ds117829.mlab.com:17829/festmamu"); // public hosted mongo db
// mongoose.connect("mongodb://localhost/pheno_bot");
var converRoute = require("./routes/conv")
 
 app.use("/api/messages",converRoute);
app.get('/',function(req,res){
	res.send("hi");
});

  app.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('server started');
   console.log(process.env.PORT) ;
});
 
