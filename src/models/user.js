const mongoose = require('mongoose');
const {AddressSchema} = require("./Address")

UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        minlength: 6
    },
    adoptedAnimals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            default : []
        }
    ],
    rehomedAnimals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            default : []
        }
    ],
    favouriteAnimals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            default: []
        }
    ],
    firstname: {
        type : String,
        default : ""

    },
    lastname: {
        type : String,
        default : ""
    },
    email : {
        type : String,
        unique: true,
        default : ""
    },
    phone : {
        type : String,
        default : ""
    },
    address: AddressSchema,
    refreshToken : {
        type : String,
        default : "",
        select : false
    },
    profileCompleted : {
        type : Boolean,
        default : false
    }
})

UserSchema.statics.updateDetails =  function(user_id, update){
    return this.findByIdAndUpdate(user_id, update, {returnOriginal : false})
}

UserSchema.statics.updateAdoptedAnimals = async function(user_id, animal_id){
    const user = await this.findById(user_id)
    user.adoptedAnimals.push(animal_id)
    await user.save()
    return user
}


const User = mongoose.model('User', UserSchema)

module.exports = User
