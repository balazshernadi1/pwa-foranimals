const express = require("express")
const router = express.Router()
const controller = require("../controllers/AccountController")
const jwt = require("../auth/JsonWebToken")
const { checkUserProfileCompletion } = require("../middleware/CustomMiddleware")

router.get("/dashboard", jwt.authenticateToken, checkUserProfileCompletion, controller.renderDashbaord)

router.get("/logout", jwt.authenticateToken, controller.logoutUser)

router.get("/additional-details", jwt.authenticateToken, controller.renderGetAdditionalDetailsPage)

router.post("/save-details", jwt.authenticateToken, controller.saveDetails)

router.delete("/un-adopt", jwt.authenticateToken, controller.unAdopt)

router.post("/finalise-adoption", jwt.authenticateToken, controller.finaliseAdoption)

router.post("/take-off-site", jwt.authenticateToken, controller.takeOffSite)

module.exports = router