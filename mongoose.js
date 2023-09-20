const mongoose = require("mongoose");
const dbURL = "mongodb://Rohan:Qwerty%40123@ac-7db0vbs-shard-00-00.nfyphpy.mongodb.net:27017,ac-7db0vbs-shard-00-01.nfyphpy.mongodb.net:27017,ac-7db0vbs-shard-00-02.nfyphpy.mongodb.net:27017/?ssl=true&replicaSet=atlas-tqpx6d-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(dbURL, (err)=>{
    if(err) return console.log(err);
    console.log("Successfully connected to database")
});
module.exports = {mongoose};