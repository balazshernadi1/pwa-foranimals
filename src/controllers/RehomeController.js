const { uploadImageToAzureBlob } = require("../db/blob")
const Animal = require("../models/Animal")
const Breeds = require("../models/Breeds")
const Payment = require("../models/payment")
const User = require("../models/User")

exports.renderRehomePage = async (req, res) => {

    const stats = await Payment.getRecentTransaction(5)

    console.log(stats)

    res.render("rehomePage", {stats})
}

exports.renderRehomeFormPage = async (req, res) => {
    if (!res.locals.profileCompleted){
        return res.redirect("/account/additional-details?returnTo=/rehome/pet-details&skip=/rehome")
    }

    const user_id = req.token.payload
    
    const user = await User.findById(user_id, "username")

    res.render('rehomeForm', {user})

}

exports.rehomePet = async (user_id, pet_details) => {

    if (!user_id || !pet_details) {
        return { success: false, message: "Invalid parameters." };
    }
    
    try {
        const animal = new Animal(pet_details)
        animal.owner = user_id
        const user = await User.findById(user_id, "address rehomedAnimals")

        if(!user){
            return {success : false, message: "User not found"}
        }

        user.rehomedAnimals.push(animal._id)
        user.save()
        animal.location = user.address
        animal.adoptionStatus = "Processing"
        animal.save()

        return {success: true, id: animal._id}
    } catch (error) {
        console.log("Error:", error)
        return {success : false, message : "Rehomepet error"}
    }

    
}

exports.getFeaturesBasedOfSpecies = async (req, res) => {
    const species = req.body.speciesName

    const features = await Breeds.getFeaturesBasedOfSpecies(species)
    
    res.send({features : features})
}

exports.getColoursBasedOfSpecies = async (req, res) => {
    const species = req.body.speciesName

    const colours = await Breeds.getColoursBasedOfSpecies(species)
    
    res.send({colours : colours})
}

exports.getBreedsBasedOfSpecies = async (req, res) => {
    
    const species = req.body.speciesName

    const breeds = await Breeds.getBreedsBasedOfSpecies(species)

    res.send({breeds : breeds})
}

exports.renderUploadPage = (req, res) =>{

    res.render("upload.ejs")

}

exports.uploadImages = async (req, res) => {
    
    const { animal_id } = req.body;
    console.log(animal_id)
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImageUrls = []
    try {
        for (const file of req.files) {
            const imageUrl = await uploadImageToAzureBlob(file)
            uploadedImageUrls.push(imageUrl)
        }
    const animal = await Animal.findByIdAndUpdate(animal_id, {images : uploadedImageUrls, adoptionStatus : "Available", fee: 150})

    res.status(200).send({message : "Images uploaded successfully!", redirectTo : `/adopt/pet/${animal._id}`})

    } catch (error) {
        res.status(500).json({message : "Image upload has failed"})    
    }


}