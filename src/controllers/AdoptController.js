const Animal = require('../models/Animal')
const User = require('../models/User')

const MIN_ITEMS_PER_PAGE = 5
const DEFAULT_ITEMS_PER_PAGE = 5
const MAX_ITEMS_PER_PAGE = 20
const MAX_DISPLAYED_PAGES = 5

exports.renderAdoptPage = async (req, res) => {

    filters = destructFilterParams(req.query)

    const sortBy = req.query.sortBy ? req.query.sortBy : 'none'
    const {field, order} = splitSortBy(sortBy)
    const sortObj = field && order ? {[field]:order} : null

    let pageNum = parseInt(req.query.page) || 1
    const itemsPerPage = Math.min(Math.max(parseInt(req.query.itemsPerPage) || DEFAULT_ITEMS_PER_PAGE, MIN_ITEMS_PER_PAGE), MAX_ITEMS_PER_PAGE) // Makes sure the itemsPerPage is within the valid bounds
    const animalsCounted = await Animal.countDocuments(filters)
    const pageOffset = (pageNum - 1) * itemsPerPage
    const {startPage, endPage, nextPage, previousPage} = pageStartAndEnd(pageNum,itemsPerPage,animalsCounted)
    const filtersQueryString = buildFilterQuery(req.query)
    const species = await Animal.distinct('species')
    const locations = await Animal.distinct('location.city')
    const features = await Animal.distinct('features')
    const colours = await Animal.distinct('colours')

    if (pageNum > endPage && endPage > 0){
        console.log("Redirect")
        const redirectTo = new URL(req.originalUrl, `http://${req.headers.host}`)
        redirectTo.searchParams.set("page", `${endPage}`)  
        console.log(redirectTo.href)
        return res.redirect(redirectTo.href)
    }

    try {
        const animals = await Animal.findAdoptableAnimals(itemsPerPage, pageOffset, sortby = sortObj, filters);
        res.render('adopt.ejs', {
            animals: animals, 
            extractScripts: true, 
            startPage : startPage,
            endPage : endPage,
            nextPage : nextPage,
            previousPage : previousPage,
            currentPage : pageNum,
            filtersQueryString : filtersQueryString, 
            locations : locations,
            species : species,
            colours : colours,
            features : features})
    } catch (error) {
        console.error("Error fetching adoptable animals:", error);
        res.status(500).send({ error: "Error fetching adoptable animals" })
    }

}

exports.getBreeds = async (req, res) => {
    const species = req.query.species
    if (!species){
        return res.status(400).send("Error, species parameter is required to make call to this route")
    }
    try {
        const breeds = await Animal.distinct('breeds', {species})
        res.send({breeds : breeds})
    } catch (error) {
        res.status(500).send("Error fetching breeds")
    }

    

}

exports.renderPetPage = async (req, res) => {
    const lookUpId = req.params.id
    
    try {
        const animal = await Animal.findById(lookUpId)

        const date = new Date(animal.dateAdded)

        let formattedDate = date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })


        const details = [
            {name : 'Breed(s)', value : animal.breeds.join(", ")},
            {name : 'Colour(s)', value : animal.colours.join(", ")},
            {name : 'Species', value : animal.species},
            {name : 'Age', value : animal.age},
            {name : 'Sex', value : animal.sex || 'male'},
            {name : 'Location', value : animal.location.city},
            {name : 'Date Added', value : formattedDate}
        ]

        res.render('pet.ejs', {animal, details, extractScripts: true, })

    } catch (error) {
        res.redirect("/adopt")
    }
}

exports.makeAdoption = async (user_id, animal_id) => {
    if (!user_id || !animal_id) {
        return { success: false, message: "Invalid parameters" }
    }
    
    try {
        const userUpdateResult = await User.updateAdoptedAnimals(user_id, animal_id);
        if (!userUpdateResult) {
            return { success: false, message: "Failed to update user's adopted animals."}
        }

        const animalUpdateResult = await Animal.findByIdAndUpdate(
            animal_id,
            { adoptionStatus: "Reserved", adopter: user_id },
            { new: true }
        );
        if (!animalUpdateResult) {
            return { success: false, message: "Failed to update animal adoption status."}
        }

        return { success: true}
    } catch (error) {
        console.error("Error:", error)
        return { success: false, message: "An error occurred during adoption." }
    }
}


function buildFilterQuery(filters){
        
    const filterQuery = new URLSearchParams()

    Object.keys(filters).forEach(key => {
        if (filters[key]){
            if (Array.isArray(filters[key])){
                filters[key].forEach(value => filterQuery.append(key, value))
            }else{
                filterQuery.append(key, filters[key])
            }
        }
    })
    return `&${filterQuery.toString()}`
}

function pageStartAndEnd(pageNum, itemsPerPage, animalsCounted) {
    const totalPages = Math.ceil(animalsCounted / itemsPerPage)
    const halfRange = Math.floor(MAX_DISPLAYED_PAGES / 2)

    let startPage = Math.max(pageNum - halfRange, 1)
    let endPage = Math.min(pageNum + halfRange, totalPages)

    if (endPage - startPage + 1 < MAX_DISPLAYED_PAGES) {
        if (startPage === 1) {
            endPage = Math.min(startPage + MAX_DISPLAYED_PAGES - 1, totalPages)
        } else if (endPage === totalPages) {
            startPage = Math.max(endPage - MAX_DISPLAYED_PAGES + 1, 1)
        }
    }

    const nextPage = pageNum+1 <= totalPages;
    const previousPage = pageNum-1 >= 1;

    return { startPage, endPage, nextPage, previousPage };

}


function destructFilterParams(queryParamObj){
    const query = {adoptionStatus : "Available"}

    if (queryParamObj.locations){
        query['location.city'] = queryParamObj.locations
    }

    if(queryParamObj.minAge || queryParamObj.maxAge){
        query.age = {}
        if (queryParamObj.minAge){
            query.age.$gte = queryParamObj.minAge 
        }
    
        if (queryParamObj.maxAge){
            query.age.$lte = queryParamObj.maxAge
        }
    }

    if (queryParamObj.species){
        query.species = queryParamObj.species

        if (queryParamObj.breed){
            query.breeds = [queryParamObj.breed]
        }
    }

    if (queryParamObj.colours){
        query.colours = [queryParamObj.colours]
    }

    if (queryParamObj.features){
        query.features = { $in: Array.isArray(queryParamObj.features) ? queryParamObj.features : [queryParamObj.features] };
    }

    return query
}

function splitSortBy(sortBy){
    if (sortBy === null){
        return {field : null, order :null}
    }else{
        match1 = sortBy.match(/^(age|dateAdded)/)
        match2 = sortBy.match(/(Asc|Desc)$/)

        let field = match1 ? match1[0] : null
        const order = match2 ? match2[0].toLowerCase() : null

        return {field, order}
    }
    
}