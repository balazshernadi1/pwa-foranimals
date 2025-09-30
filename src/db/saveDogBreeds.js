const dogBreeds = {
    affenpinscher: [],
    african: [],
    airedale: [],
    akita: [],
    appenzeller: [],
    basenji: [],
    beagle: [],
    bluetick: [],
    borzoi: [],
    bouvier: [],
    boxer: [],
    brabancon: [],
    briard: [],
    brittany: [],
    bulldog: ["boston", "english", "french"],
    bullterrier: ["staffordshire"],
    cairn: [],
    cattledog: ["australian"],
    chihuahua: [],
    chow: [],
    clumber: [],
    cockapoo: [],
    collie: ["border"],
    coonhound: [],
    corgi: ["cardigan"],
    cotondetulear: [],
    dachshund: [],
    dalmatian: [],
    dane: ["great"],
    deerhound: ["scottish"],
    dhole: [],
    dingo: [],
    doberman: [],
    elkhound: ["norwegian"],
    entlebucher: [],
    eskimo: [],
    finnish: ["lapphund"],
    frise: ["bichon"],
    germanshepherd: [],
    greyhound: ["italian"],
    groenendael: [],
    hound: ["afghan", "basset", "blood", "english", "ibizan", "plott", "walker"],
    husky: [],
    keeshond: [],
    kelpie: [],
    komondor: [],
    kuvasz: [],
    labrador: [],
    leonberg: [],
    lhasa: [],
    malamute: [],
    malinois: [],
    maltese: [],
    mastiff: ["bull", "english", "tibetan"],
    mexicanhairless: [],
    mix: [],
    mountain: ["bernese", "swiss"],
    newfoundland: [],
    otterhound: [],
    papillon: [],
    pekinese: [],
    pembroke: [],
    pinscher: ["miniature"],
    pitbull: [],
    pointer: ["german", "germanlonghair"],
    pomeranian: [],
    poodle: ["miniature", "standard", "toy"],
    pug: [],
    puggle: [],
    pyrenees: [],
    redbone: [],
    retriever: ["chesapeake", "curly", "flatcoated", "golden"],
    ridgeback: ["rhodesian"],
    rottweiler: [],
    saluki: [],
    samoyed: [],
    schipperke: [],
    schnauzer: ["giant", "miniature"],
    setter: ["english", "gordon", "irish"],
    sheepdog: ["english", "shetland"],
    shiba: [],
    shihtzu: [],
    spaniel: ["blenheim", "brittany", "cocker", "irish", "japanese", "sussex", "welsh"],
    springer: ["english"],
    stbernard: [],
    terrier: [
      "american",
      "australian",
      "bedlington",
      "border",
      "dandie",
      "fox",
      "irish",
      "kerryblue",
      "lakeland",
      "norfolk",
      "norwich",
      "patterdale",
      "russell",
      "scottish",
      "sealyham",
      "silky",
      "tibetan",
      "toy",
      "westhighland",
      "wheaten",
      "yorkshire"
    ],
    vizsla: [],
    weimaraner: [],
    whippet: [],
    wolfhound: ["irish"]
  };

const catBreeds = [
    "Abyssinian",
    "American Bobtail",
    "American Curl",
    "American Shorthair",
    "American Wirehair",
    "Balinese",
    "Bengal",
    "Birman",
    "Bombay",
    "British Shorthair",
    "Burmese",
    "Burmilla",
    "Chartreux",
    "Cornish Rex",
    "Devon Rex",
    "Egyptian Mau",
    "European Burmese",
    "Exotic Shorthair",
    "Havana Brown",
    "Himalayan",
    "Japanese Bobtail",
    "Javanese",
    "Korat",
    "LaPerm",
    "Maine Coon",
    "Manx",
    "Norwegian Forest Cat",
    "Ocicat",
    "Oriental",
    "Persian",
    "Ragdoll",
    "Russian Blue",
    "Scottish Fold",
    "Selkirk Rex",
    "Siamese",
    "Siberian",
    "Singapura",
    "Snowshoe",
    "Somali",
    "Sphynx",
    "Tonkinese",
    "Toyger",
    "Turkish Angora",
    "Turkish Van"
  ];
  
const pigBreeds = [
    "American Yorkshire",
    "Berkshire",
    "Chester White",
    "Duroc",
    "Hampshire",
    "Hereford",
    "Landrace",
    "Large Black",
    "Mangalica",
    "Meishan",
    "Ossabaw Island Hog",
    "Pietrain",
    "Red Wattle",
    "Spotted",
    "Tamworth",
    "Vietnamese Potbelly",
    "Kunekune",
    "Iberian",
    "Gloucestershire Old Spots",
    "Large White",
    "Saddleback",
    "Swabian Hall"
  ];

const dogColors = ['Black', 'Brown', 'White', 'Golden', 'Gray', 'Cream']
const catColors = ['Black', 'White', 'Orange', 'Gray', 'Calico', 'Tabby']
const pigColors = ['Pink', 'Black', 'White', 'Spotted']

const dogFeatures = [
  "Friendly",
  "Energetic",
  "Good with Kids",
  "Loyal"
];

const catFeatures = [
  "Independent",
  "Playful",
  "Good with Other Cats",
  "Cuddly"
];

const pigFeatures = [
  "Intelligent",
  "Social",
  "Clean",
  "Good with Kids"
];

const { default: mongoose } = require('mongoose');
const Breeds = require('../models/Breeds');

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

  function saveBreeds() {
    formattedDogBreeds = Object.entries(dogBreeds).map(([breed, subBreeds]) => ({
      breedName : breed,
      subBreeds : subBreeds
    }))
  
    formattedCatBreeds = catBreeds.map((cat)=>({  
      breedName : cat
    }))
  
    formattedPigBreeds = pigBreeds.map((pig)=>({
      breedName : pig
    }))
  
  
    const breeds = new Breeds({
  
      species : [
          {
              name : "dog",
              breeds : formattedDogBreeds
          },
          {
              name : "cat",
              breeds : formattedCatBreeds
          },
          {
              name : "pig",
              breeds : formattedPigBreeds
          }
  
      ]
  
    })
  
    breeds.save()
  
    process.exit(0)
  }

  async function saveColours() {
    try {
        // Find the breeds document
        const breeds = await Breeds.findOne();
        if (!breeds) {
            console.log("Breeds collection not found.");
            return;
        }

        // Update species colors
        for (let index = 0; index < 3; index++) {
            switch (index) {
                case 0:
                    breeds.species.find((s) => s.name === "dog").colours = dogColors;
                    break;
                case 1:
                    breeds.species.find((s) => s.name === "cat").colours = catColors;
                    break;
                case 2:
                    breeds.species.find((s) => s.name === "pig").colours = pigColors;
                    break;
            }
        }

        // Save the updated document back to the database
        await breeds.save();
        console.log("Colors updated successfully!");

    } catch (error) {
        console.error("Error updating colors:", error);
    }
}

  async function saveFeatures() {
    try {
      // Find the breeds document
      const breeds = await Breeds.findOne();
      if (!breeds) {
          console.log("Breeds collection not found.");
          return;
      }

      // Update species colors
      for (let index = 0; index < 3; index++) {
          switch (index) {
              case 0:
                  breeds.species.find((s) => s.name === "dog").features = dogFeatures;
                  break;
              case 1:
                  breeds.species.find((s) => s.name === "cat").features = catFeatures;
                  break;
                  case 2:
                breeds.species.find((s) => s.name === "pig").features = pigFeatures;
                  break;
          }
      }

      // Save the updated document back to the database
      await breeds.save();

      console.log("Colors updated successfully!");
  } catch (error) {
    console.error("Error updating colors:", error);
  }
  }

saveFeatures()