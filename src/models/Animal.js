const mongoose = require("mongoose")
const {AddressSchema} = require("./Address")

AnimalSchema = new mongoose.Schema({
    name:{type:String, required:true},
    age:{type:Number, required:true},
    location: AddressSchema,
    species: {type:String, required:true},
    sex : {type : String, enum : ["male", "female"]}, 
    breeds: {
        type:[String],
        validate: {
            validator: function(arr) {
                return arr.length > 0
            },
            message: 'The features array must have at least one item.'
        },
        required: true
    },
    colours: {
        type:[String],
        validate: {
            validator: function(arr) {
                return arr.length > 0
            },
            message: 'The features array must have at least one item.'
        },
        required: true
    },
    size: {
        type:String,
        enum:['small', 'medium', 'large', 'extra-large']
    },
    features: {
        type:[String],
        validate: {
            validator: function(arr) {
                return arr.length > 0
            },
            message: 'The features array must have at least one item.'
        },
        required: true
    },
    images: {
        type:[String],
        validate: {
            validator: function(v) {
                return arr.length > 0
            },
            message: 'The images array must have at least one item.'
        },
        required : true
    },
    fee: {
        type:Number, 
        default:150
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    adopter : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : null
    },
    description: {
        type:String,
        required : true
    },
    reason: {
        type:String, required : true
    },
    adoptionStatus: {
        type : String,
        enum : ['Available', 'Reserved', 'Adopted', 'Processing']
    },
    dateAdded : {type: Date, default : Date.now} 
})

AnimalSchema.statics.findFirst5 = function(){
    return this.find().limit(5)
}

AnimalSchema.query.byName = function(name){
    return this.where(name)
}

AnimalSchema.statics.findAdoptableAnimals = function(numberOfAnimals, offset = 0, sortby, filters){
    return this.find(filters, 
            'name age location.city images breeds dateAdded')
    .sort(sortby)
    .skip(offset)
    .limit(numberOfAnimals)
    }

     

const Animal = mongoose.model('Animal', AnimalSchema)

module.exports = Animal