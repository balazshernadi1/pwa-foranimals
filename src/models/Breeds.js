const mongoose = require("mongoose")

const BreedsSchema = new mongoose.Schema({
    species: [{
        name: { 
            type: String, 
            required: true, 
            unique: true, 
        },
        breeds: [{
            breedName: { 
                type: String, 
                required: true, 
            },
            subBreeds: {
                type: [String],
                default: [] 
            }
        }],
        colours: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr) {
                    return arr.length > 0 
                },
                message: "At least one colour must be specified."
            }
        },
        features: {
            type: [String],
            default: [], 
            validate: {
                validator: function (arr) {
                    return arr.length > 0
                },
                message: "At least one feature must be specified."
            }
        }
    }]
})

function formatBreeds(breeds) {
    breedsToReturn = []
    breeds.forEach((breedInfo) => {
        breedsToReturn.push(breedInfo.breedName)
        if (breedInfo.subBreeds){
            breedInfo.subBreeds.forEach((subBreed) => {
                breedsToReturn.push(`${subBreed} ${breedInfo.breedName}`)
            })
        }
    });
    return breedsToReturn
}


BreedsSchema.statics.getBreedsBasedOfSpecies = async function(speciesName) {
    const result = await this.findOne()
    const breeds = result?.species.find((species) => species.name === speciesName)?.breeds
    const formattedBreeds = formatBreeds(breeds)
    return formattedBreeds || []
}

BreedsSchema.statics.getColoursBasedOfSpecies = async function(speciesName) {
    const result = await this.findOne()
    const colours = result?.species.find((species) => species.name === speciesName)?.colours
    return colours || []
    
}

BreedsSchema.statics.getFeaturesBasedOfSpecies = async function(speciesName) {
    const result = await this.findOne()
    const features = result?.species.find((species) => species.name === speciesName)?.features
    return features || []
    
}

const Breeds = new mongoose.model("Breeds" ,BreedsSchema)

module.exports = Breeds
