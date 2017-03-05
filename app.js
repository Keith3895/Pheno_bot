var builder = require('botbuilder');
var express = require("express");
var app     = express();
var converRoute = require("./routes/conv")
 
 app.use("/api/messages",converRoute);


  app.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('server started');
   console.log(process.env.PORT) ;
});
 
