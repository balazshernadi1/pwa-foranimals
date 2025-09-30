# pwa-foranimals

A progressive web application (PWA) focused on animal adoption, rehoming, and donation.
# Introduction

 For Animals is a web application built to serve as a platform for animal welfare. 
 It was developed as a server-side-rendered (SSR) progressive web application (PWA). The project's purpose is to provide users with three core services: 

 - **Adopt Animals:** Allow users to view and adopt animals in need of a home.  
 - **Rehome Pets:** Give pet owners a way to list their pets for rehoming. 
 - **Donate:** Enable users to contribute to animal welfare charities. 
 
 The application was designed with a focus on core functionality, user experience, and a responsive interface that works on various devices.
 
This project was created for a Web and App development module to demonstrate software design, software engineering, and database modelling skills learned in class.
# Achievements and Challenges

- **Complex Feature Implementation:** Successfully built the three core functionalities (Adoption, Rehoming, Donations) from the ground up, integrating them with a user authentication system and personal dashboards
- **Efficient Database Strategy:** Integrated two distinct database technologies. MongoDB for structured data and Azure Blob Storage for binary image files.
- **Dynamic Data Handling:** Implemented a powerful filtering and sorting system for the adoption page. This was achieved by processing multiple query parameters on the server to dynamically render customised results for the user.
- **Focus on Accessibility:** The application was developed to conform to various accessibility standards, including WCAG 2.1 criteria for colour contrast and content reflow, and followed Nielsen's Usability Heuristics for error prevention and system feedback.
- **Preventing Data Integrity Issues (Adoption):** A challenge arose when a user could potentially adopt a pet they had already put up for rehoming. This could cause data conflicts. **Solution:** Implemented a validation function in the payment controller that checks if the adopter's user ID matches the pet's owner ID. If they match, the action is blocked, and an error message is returned to the user, preserving data integrity.
- **Handling Duplicate Entries (Rehoming):** Another issue was that a user could rehome the same pet multiple times, creating duplicate entries in the database. **Solution:** A function was added to the payment controller to check if the incoming pet's name, age, and species match any existing pets already rehomed by that specific user. If a duplicate is found, the process is cancelled before any data is created.
- **Project Scoping:** The initial scope of the project was very ambitious, which led to time management challenges as I worked to implement complex features while also learning the technologies involved. **Solution:** Development efforts were refocused on the most critical core features to ensure the primary objectives of the application were met successfully within the deadline. This experience provided a valuable lesson in realistic project planning and prioritisation for future work.
# Technologies 

## Backend
**Runtime Environment** : NodeJS.
**Web framework**: Express.js was chosen as it was a requirement by the module.
**Templating Engine**: Embedded JavaScript (EJS) was chosen as it was a requirement by the module. (Its simple syntax was preferred for a faster development cycle compared to the learning curve of alternatives like React).
## Frontend
**Styling**: TailwindCSS was chosen over plain CSS for its utility-first classes, which allowed for faster prototyping and implementation of the responsive design.
**Client-side Logic:** Vanilla JavaScript was used for dynamic updates, such as interacting with the backend via the Fetch API.
## Database
**Primary Database**: MongoDB was chosen as it was required by the module.
**Secondary Database**: Azure Blob Storage was chosen to store and serve animal images. This is to prevent MongoDB documents from becoming too large (also, there is a 16MB limit anyway). 
# Key Features

- **Adoption**: Users can browse a list of available animals, with advanced filtering and sorting by age, species, breed, location and more.
- **Rehoming**: Authenticated users can fill out a form and upload a picture to list their own pets for adoption.
- **Donation**: Users can contribute to various animal welfare charities through a mock payment system that simulates the process.
- **User Dashboard**: Registered users have a personal dashboard to manage their adopted animals, rehomed pets, and donation history.
- **Offline functionality**: Service-workers cache the app shell, which redirects users to a fallback page when offline. 
- **Accessibility**: The user interface is fully responsive and adapts to different resolutions.

# Database Model

MongoDB doesn't enforce a schema, allowing the data model to change over time. However, libraries such as Mongoose (which was used) exist to enforce data and schema validation before inserting or updating data. 

**Breed**

| Attribute Name           | Data Type        | Constraints                      | Description                                  |
| ------------------------ | ---------------- | -------------------------------- | -------------------------------------------- |
| _id                      | ObjectId         | Primary Key                      | Unique identifier for the document           |
| species.name             | String           | Required, Unique                 | Name of the species                          |
| species.breeds           | Array of Objects | Optional                         | List of breeds associated with the species   |
| species.breeds.breedName | String           | Required                         | Name of the breed                            |
| species.breeds.subBreeds | Array of Strings | Default: Empty Array             | List of sub-breeds for the breed             |
| species.colours          | Array of Strings | Default: Empty Array, At least 1 | List of colours associated with the species  |
| species.features         | Array of Strings | Default: Empty Array, At least 1 | List of features associated with the species |
**Animal**

| Attribute Name  | Data Type        | Constraints                                    | Description                                    |
|-----------------|-----------------|------------------------------------------------|------------------------------------------------|
| _id             | ObjectId        | Primary Key                                    | Unique identifier for the animal                |
| name            | String          | Required                                       | Name of the animal                              |
| age             | Number          | Required                                       | Age of the animal                               |
| location        | Address (Embedded) | Optional                                    | Address details (linked to AddressSchema)       |
| species         | String          | Required                                       | Species of the animal                           |
| sex             | String          | Enum: "male", "female"                         | Gender of the animal                            |
| breeds          | Array of Strings| Required, Must have at least 1 item            | List of breeds                                  |
| colours         | Array of Strings| Required, Must have at least 1 item            | List of colors                                  |
| size            | String          | Enum: "small", "medium", "large", "extra-large"| Size category of the animal                     |
| features        | Array of Strings| Required, Must have at least 1 item            | Special features of the animal                  |
| images          | Array of Strings| Required, Must have at least 1 item            | List of image URLs                              |
| fee             | Number          | Default: 150                                   | Adoption fee                                    |
| owner           | ObjectId (FK)   | References User, Required                      | Reference to the owner (User)                   |
| adopter         | ObjectId (FK)   | References User, Default: Null                 | Reference to the adopter (User)                 |
| description     | String          | Required                                       | Description of the animal                       |
| reason          | String          | Required                                       | Reason for adoption                             |
| adoptionStatus  | String          | Enum: "Available", "Reserved", "Adopted", "Processing" | Status of the adoption                 |
| dateAdded       | Date            | Default: Current Timestamp                     | Date the animal record was added                |

**User**

| Attribute Name    | Data Type        | Constraints                                    | Description                                     |
|-------------------|-----------------|------------------------------------------------|-------------------------------------------------|
| _id               | ObjectId        | Primary Key                                    | Unique identifier for the user                   |
| username          | String          | Required, Unique, Trimmed                      | Username for the user                            |
| password          | String          | Required, Minlength: 6                         | Hashed password for the user                     |
| adoptedAnimals    | Array of ObjectIds| Default: Empty Array, References Animal       | List of animals adopted by the user              |
| rehomedAnimals    | Array of ObjectIds| Default: Empty Array, References Animal       | List of animals rehomed by the user              |
| favouriteAnimals  | Array of ObjectIds| Default: Empty Array, References Animal       | List of animals marked as favorites by the user  |
| firstname         | String          | Default: Empty String                          | First name of the user                           |
| lastname          | String          | Default: Empty String                          | Last name of the user                            |
| email             | String          | Unique, Default: Empty String                  | Email address of the user                        |
| phone             | String          | Default: Empty String                          | Phone number of the user                         |
| address           | Embedded AddressSchema | Optional                                 | Address details of the user                      |
| refreshToken      | String          | Default: Empty String, Not Returned by Default | Refresh token for authentication (secure)        |
| profileCompleted  | Boolean         | Default: False                                 | Indicates if the user's profile is complete      |

**Payment**

| Attribute Name  | Data Type        | Constraints                                    | Description                                     |
|-----------------|-----------------|------------------------------------------------|-------------------------------------------------|
| _id             | ObjectId        | Primary Key                                    | Unique identifier for the payment                |
| payId           | UUID            | Required, Unique                               | Payment ID (globally unique identifier)          |
| date            | Date            | Default: Current Timestamp                     | Date and time when the payment was created       |
| payee           | ObjectId (FK)   | References User, Required                      | Reference to the user making the payment         |
| productType     | String          | Required, Enum: "adoption", "donation", "rehome"| Type of product associated with the payment      |
| productDetails  | Mixed           | Default: Empty object                          | Details of the product (flexible structure)      |
| productId       | ObjectId (FK)   | Required                                       | Reference to the associated product              |
| price           | Number          | Required, Default: 0, Min: 0, Max: 300         | Payment amount                                   |
| progress        | String          | Enum: "Expired", "In-Progress", "Done", Default: "In-Progress" | Payment progress status       |

**Donation**

| Attribute Name       | Data Type        | Constraints                                   | Description                               |
| -------------------- | ---------------- | --------------------------------------------- | ----------------------------------------- |
| _id                  | ObjectId         | Primary Key                                   | Unique identifier for the donation        |
| name                 | String           | Required                                      | Name of the donation campaign             |
| amount               | Number           | Default: 0; Min: 0                            | Current amount raised                     |
| goal                 | Number           | Required; Min: 1                              | Goal amount for the donation campaign     |
| start                | Date             | Required                                      | Start date of the campaign                |
| end                  | Date             | Optional; Must be after start                 | End date of the campaign                  |
| description          | String           | Optional                                      | Description of the donation campaign      |
| status               | String           | Enum: "Active", "Inactive"; Default: "Active" | Current status of the donation campaign   |
| donors               | Array of Objects | Optional                                      | List of donors and their donation details |
| donors.donor         | ObjectId (FK)    | References User, Required                     | Reference to the donor (User)             |
| donors.amountDonated | Number           | Required, Min: 1, Max: 5000                   | Amount donated by a donor                 |
| donors.dateDonated   | Date             | Default: Current Timestamp                    | Date the donation was made                |
A notable database design choice is the balance between embedding and referencing documents, which are key concepts in MongoDB. These design choices were important to consider as they affect the performance of read/write and the integrity of the data.

Instead of embedding a list of all users within each donation document (which could become enormous and inefficient), the `donors` array in the **Donation** schema stores a **reference** to each user's `ObjectId`.

**Avoids Data Duplication:** The user's information (like their username) is stored in only one place—the `User` collection. This makes updates simple and ensures data consistency.

**Manages Document Size:** It prevents the donation documents from exceeding MongoDB's 16MB size limit, which could easily happen if large user objects were embedded.

```
donors: [
        {
            donor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            amountDonated: {
                type: Number,
                required: true,
                min: 1,
                max: 5000
            },
            dateDonated: {
                type: Date,
                default: Date.now
            }
        }
    ]
```

 Whereas for embedding a clear example is the `location` field embedded within the **Animal** document. The address details of where the animal is located are stored directly inside the animal's record, rather than in a separate `Addresses` collection.

**Performance on Read Operations**: This eliminates the need for a second query or a `$lookup` aggregation to join collections, significantly reducing latency and improving the performance of displaying an animal's profile page.

**Data Atomicity:** Updates to an animal and its location can be performed in a single, atomic write operation.

**Reflection**

This project was a significant challenge, as it combined full creative freedom with my first experience in web development. This created a highly rewarding environment where I could immediately apply new skills in software design and database modelling as I learned them.

A key lesson was in project scoping; my initial ambition had to be balanced with practical time constraints, which meant prioritising core functionalities over extra features. Ultimately, this project provided a strong foundation in web development, and I'm eager to build on this knowledge.



