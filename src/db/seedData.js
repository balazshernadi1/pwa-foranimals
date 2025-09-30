const Animal = require('../models/Animal');
const User = require('../models/User');
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const MONGO_URI = 'mongodb+srv://balazshernadi1:UUfOtJTGYlyfezox@pet-adoption.gauw6.mongodb.net/pet_adoption_db?retryWrites=true&w=majority&appName=pet-adoption'


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

connectDB()

let animals = []
let users = []

const seed = async () => {
    try {
        const createdUsers = await User.insertMany(users);

        for (let index = 0; index < createdUsers.length; index++) {
            animals[index].currentOwner = createdUsers[index]._id

            
            const createdAnimal = new Animal(animals[index])
            await createdAnimal.save()

           
            createdUsers[index].rehomedAnimals.push(createdAnimal._id)
            await createdUsers[index].save()
        }

        console.log("Database seeded successfully!");

    } catch (error) {
        console.error("Error seeding the database:", error)
    } finally {
        process.exit()
    }
}

// Generate Dummy Users
for (let index = 0; index < 10; index++) {
    users[index] = {
        username: faker.internet.username(), 
        password: faker.internet.password(),
        adoptedAnimals: [],
        rehomedAnimals: [],
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),  
        address: {
            city: faker.location.city(),
            street: faker.location.streetAddress(),
            postcode: faker.location.zipCode(),
            county: faker.location.county(),
        },
    }
}

// Generate Dummy Animals
for (let index = 0; index < 10; index++) {
    animals[index] = {
        name: faker.animal.petName(),
        age: faker.finance.amount({ min: 1, max: 10 }),
        location: {
            city: faker.location.city(),
            street: faker.location.streetAddress(),
            postcode: faker.location.zipCode(),
            county: faker.location.county(),
        },
        species: 'cat',
        breeds: [faker.animal.cat()],
        colours: [faker.color.human()],
        size: 'medium',
        features: ['Something'],
        image: 'https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_640.jpg',
        fee: faker.finance.amount({ min: 200, max: 255 }),
        description: faker.lorem.sentence(),
        reasonForRehoming: faker.lorem.sentence(),
        isChipped: false,
        adoptionStatus: 'Available',
        dateAdded : Date.now()
    }
}
seed()
