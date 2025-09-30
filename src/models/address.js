const mongoose = require("mongoose")

AddressSchema = new mongoose.Schema({
    city:String,
    street:String,
    postcode:String,
    county:String
})

module.exports = {AddressSchema}