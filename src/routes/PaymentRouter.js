const express = require("express")
const router = express.Router()
const controller = require("../controllers/PaymentController")
const { checkUserProfileCompletion } = require("../middleware/CustomMiddleware")
const auth = require("../auth/JsonWebToken")

router.post("/initiate-payment", auth.authenticateToken, checkUserProfileCompletion, controller.paymentInitiation)

router.get("/:id", auth.authenticateToken, controller.renderPaymentPage)

router.get("/success/:id", auth.authenticateToken, controller.renderSuccessPage)

router.get("/:id/confirm-payment", auth.authenticateToken, controller.confirmPayment)

module.exports = router