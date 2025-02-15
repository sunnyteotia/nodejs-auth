const mongoose = require('mongoose')
const MONGO_URI=process.env.MONGO_URI
const connectToDB=async()=>{
 try{
     await mongoose.connect(MONGO_URI);
     console.log('MongoDb connected sucessfully');
 }catch(e){
    console.log('MongoDB connection failed');
    process.exit(1);
 }
}
module.exports=connectToDB;