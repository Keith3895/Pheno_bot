var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    name		: 	String,
    email		: 	{ type: String,  unique: true },
    age 		: 	String,
    phone 		:   String
});

module.exports = mongoose.model("User", UserSchema);