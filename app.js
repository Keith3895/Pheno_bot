var builder = require('botbuilder');
var express = require("express");
var app     = express();
var mongoose = require('mongoose');
require('dotenv').config();

// var User = require("./models/user");
mongoose.connect("mongodb://"+process.env.DB_Host+":"+process.env.DB_Password+"@ds141410.mlab.com:41410/keithtrials"); // public hosted mongo db

// mongoose.connect("mongodb://localhost/pheno_bot");
var converRoute = require("./routes/conv")
 
 app.use("/api/messages",converRoute);
app.get('/',function(req,res){
	res.send("hi");
});

  app.listen(process.env.port || process.env.PORT ||3978, function () {
   console.log('server started');
   console.log(process.env.PORT) ;
   console.log(process.env.port) ;
});
 
