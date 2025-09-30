
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;


const connectDB = async ()=> {
    try{
        await mongoose.connect(MONGO_URI)
        console.log("Connection establshied")
        console.log("Mongo URI:", MONGO_URI)
    } catch(err){
        console.error("Failed to connect to database", err.message)
        console.log("Mongo URI:", MONGO_URI)
        process.exit(1)
    }
};


module.exports = {connectDB}