const express = require("express")
const router = express.Router()
const controller = require("../controllers/DonationController")

router.get("/", controller.renderDonationPage)

module.exports = router