var builder = require('botbuilder');
var express = require("express");
var app     = express();
var mongoose = require('mongoose');


var User = require("./models/user");

var converRoute = require("./routes/conv")
 
 app.use("/api/messages",converRoute);
app.get('/',function(req,res){
	res.send("hi");
});
mongoose.connect("mongodb://localhost/pheno_bot");
  app.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('server started');
   console.log(process.env.PORT) ;
});
 
