const User = require("../models/User")
const Animal = require("../models/Animal")
const Donation = require("../models/Donations")
const jwt = require("../auth/JsonWebToken")

exports.renderDashbaord = async (req, res) =>{
    try{
        const user_id = req.token.payload

        const user = await User.findById(user_id)
         .populate({
            path: "adoptedAnimals",
            select: "name species images adoptionStatus",
            match: { adoptionStatus: {$in : ["Adopted" , "Reserved"]}}
            })
         .populate("rehomedAnimals", "name species images adoptionStatus")
         .populate("favouriteAnimals", "name species images adoptionStatus")

         const donations = await Donation.find()
         .populate("donors.donor", "username ")
        

         let userDonations
         if (donations){
            userDonations = donations
            .filter(donation =>
                donation.donors.some(donor => donor.donor && donor.donor._id.toString() === user_id)
            )
            .map(donation => {
                const totalDonatedByUser = donation.donors
                    .filter(donor => donor.donor && donor.donor._id.toString() === user_id)
                    .reduce((total, donor) => total + donor.amountDonated, 0)

                return {
                    campaignName: donation.name,
                    goal: donation.goal,
                    totalDonated: donation.amount, 
                    userDonated: totalDonatedByUser
                }
            })
         }

        res.render("dashboard", {
            user,
            donations : userDonations,
            adoptedAnimals: user.adoptedAnimals,
            rehomedAnimals: user.rehomedAnimals,
            favouriteAnimals: user.favouriteAnimals,
            extractScripts: true
        })

    }catch(error){
        console.log("ERROR", error)
        res.redirect("/")
    }
}

exports.logoutUser = async (req, res) =>{
    await User.findOneAndUpdate({_id : req.token.payload}, {refreshToken : ""})

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.redirect('/')
}

exports.renderGetAdditionalDetailsPage = async (req, res) => {
    const returnTo = req.query.returnTo
    const user_id = req.token.payload

    const user = await User.findById(user_id, "username")

    res.render("userDetails", {user})

}

exports.saveDetails = async (req, res) => {
    const user_id = req.token.payload

    for (const key in req.body.required) {
        if (Object.prototype.hasOwnProperty.call(req.body.required, key)) {
            const element = req.body.required[key];
            if (element == null || element == undefined)
                return res.status(500).json({message : "Missing details! Please try again!"})
        }
    }

    const update = {
        firstname : req.body.required.firstname,
        lastname : req.body.required.lastname,
        phone : req.body.required.phone,
        address : req.body.required.address,
        email : req.body.required.email,
        profileCompleted : req.body.required.profileCompleted
    }

    if(req.body.optional.county){
        update.address.county = req.body.optional.county
    }

    try {
        const user = await User.updateDetails(user_id, update)
        res.status(200).json({redirectTo : req.body.returnTo ? req.body.returnTo : "/" })
    } catch (error) {
        res.status(500).json({message : "Unexpected error please try again later!"})
    }


}

exports.unAdopt = async (req, res) => {
    const user_id = req.token.payload
    const {unAdoptAnimalId} = req.body

    try {
        await User.findByIdAndUpdate(user_id, { $pull :  {adoptedAnimals : unAdoptAnimalId}})
        await Animal.findByIdAndUpdate(unAdoptAnimalId , {adopter : null, adoptionStatus : "Available"})
        res.status(200).json({message : "Animal has been un-adopted"})
    } catch (error) {
        res.status(500).json({message : "Unexpected error has occured", error : error})
    }
}

exports.finaliseAdoption = async (req, res) => {
    
    const user_id = req.token.payload
    const {adoptAnimalId} = req.body
    try {
        const animal = await Animal.findById(adoptAnimalId)

        if (!animal) {
            return res.status(404).json({ message: "Animal not found." })
        }

        if (animal.adoptionStatus !== "Reserved") {
            return res.status(400).json({ message: "Animal is not available for finalizing adoption." })
        }

        if (animal.adopter.toString() !== user_id) {
            return res.status(403).json({ message: "You are not authorized to finalize this adoption." })
        }

        await User.findByIdAndUpdate(animal.owner, {$pull : {rehomedAnimals : animal._id}})

        animal.owner = user_id;
        animal.adopter = null;
        animal.adoptionStatus = "Adopted";

        await animal.save();

        res.status(200).json({message: "Adoption finalised!"})

    } catch (error) {
        res.status(500).json({message : "Unexpcted error has occured", error : error})
    }

}

exports.takeOffSite = async (req, res) => {
    
    const user_id = req.token.payload
    const {unRehomeAnimalId} = req.body

    try {

        const animal = await Animal.findById(unRehomeAnimalId)

        if (!animal) {
            return res.status(404).json({ message: "Animal not found." })
        }

        if (animal.adoptionStatus === "Reserved" || animal.adoptionStatus === "Processing"){
            return res.status(403).json({message : "Animal cannot be taken off site, please contact support!"})
        }
        
        await User.findByIdAndUpdate(user_id, {$pull : {rehomedAnimals : unRehomeAnimalId}})
        await Animal.findByIdAndDelete(unRehomeAnimalId)

        res.status(200).json({message : "Animal taken off site!"})
    } catch (error) {
        res.status(500).json({message : "Unexpected error has occured!"})
    }

}