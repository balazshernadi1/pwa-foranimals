const express = require("express")
const router = express.Router()
const controller = require('../controllers/AdoptController')
const auth = require('../auth/JsonWebToken')
const { checkUserProfileCompletion } = require("../middleware/CustomMiddleware")

router.get("/", controller.renderAdoptPage)

router.get("/getBreeds", controller.getBreeds)

router.get('/pet/:id', controller.renderPetPage)

router.get('/pet/:id/adoptPet', auth.authenticateToken, checkUserProfileCompletion ,controller.makeAdoption)

module.exports = router