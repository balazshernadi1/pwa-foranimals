const express = require("express")
const router = express.Router()
const controller = require("../controllers/RehomeController")
const { checkUserProfileCompletion } = require("../middleware/CustomMiddleware")
const { authenticateToken } = require("../auth/JsonWebToken")
const upload = require("../middleware/uploadImage")


router.get("/", controller.renderRehomePage)

router.get("/pet-details", authenticateToken , checkUserProfileCompletion ,controller.renderRehomeFormPage)

router.post("/getBreeds", controller.getBreedsBasedOfSpecies)

router.post("/getColours", controller.getColoursBasedOfSpecies)

router.post("/getFeatures", controller.getFeaturesBasedOfSpecies)

router.get("/upload",authenticateToken ,controller.renderUploadPage)

router.post("/upload-images", authenticateToken ,upload.array("images"), controller.uploadImages)



module.exports = router