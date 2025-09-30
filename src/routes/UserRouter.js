const express = require("express")
const router = express.Router()
const controller = require("../controllers/UserController")


router.get("/", controller.renderLoginPage)

router.post("/loginUser", controller.logInUser)

module.exports = router