const express = require("express")
const controller = require('../controllers/HomeController')
const router = express.Router()

router.get("/", controller.renderHomePage)

router.get("/fallback", controller.renderFallbackPage)

module.exports = router